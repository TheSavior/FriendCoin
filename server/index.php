<?php
session_start();

require 'lib/Slim/Slim.php';
\Slim\Slim::registerAutoloader();

require_once('lib/Coinbase.php');
require_once('lib/DbConn.php');

$app = new \Slim\Slim();

/*
  GET /

  Homepage for PayRail

*/
$app->get('/', function() {

  // Initialize Coinbase Oauth object
  $_CLIENT_ID = getenv('FC_CLIENT_ID');
  $_CLIENT_SECRET = getenv('FC_CLIENT_SECRET');
  $_REDIRECT_URL = "http://localhost:8080/server/callback";
  $coinbaseOauth = new Coinbase_OAuth($_CLIENT_ID, $_CLIENT_SECRET, $_REDIRECT_URL);

  // Render the index.html file
  // NOTE: this HTML file has some PHP that uses the above Coinbase Oauth object
  require_once('build/index.html');
});


/*
  GET /callback

  Redirect URL for Coinbase OAuth

  This endpoint sets cookies and redirects to the homepage.

  This function sets the following cookies:
  - authed
    - 0 = auth failed
    - 1 = auth succeeded
  - hasPhone
    - (exists) = user's phone number is in the database
  - failed
    - (exists) = something went wrong!
  - msg
    - <string> = What exactly went wrong. (only exists when 'failed' exists)
*/
$app->get('/callback', function() use ($app) {

  // Defining the CLIENT and REDIRECT URLS
  $_CLIENT_ID = getenv('FC_CLIENT_ID');
  $_CLIENT_SECRET = getenv('FC_CLIENT_SECRET');
  $_REDIRECT_URL = "http://localhost:8080/server/callback";

  // if code isn't set, set authed to 0
  // and redirect back to homepage
  if(is_null($app->request->params('code'))) {
    $app->setCookie('authed', 0);
    $app->response->headers->set('Location', 'http://localhost:8080/server/');
    return;
  }

  // Get the tokens using the code received
  // Get the coinbase object
  // TODO set authed to 0 if token retrieval fails?
  $coinbaseOauth = new Coinbase_OAuth($_CLIENT_ID, $_CLIENT_SECRET, $_REDIRECT_URL);
  $tokens = $coinbaseOauth->getTokens($app->request->params('code'));
  $coinbase = Coinbase::withOauth($coinbaseOauth, $tokens);

  try {
    $dbc = new DbConn();
    // Insert/Update database with user's coinbase id
    $cbId = $coinbase->getUser()->id;
    $dbc->storeUserToken($cbId,
                         $tokens["access_token"],
                         $tokens["refresh_token"]);
    // Setting a cookie if the user has a phone in the database
    if ($dbc->userHasPhone($cbId)) {
      $app->setCookie('hasPhone');
    }

    // set cookie to success
    // redirect to index.php
    $app->setCookie('authed', 1);

  } catch(Exception $e) {
    $app->setCookie('failed');
    $app->setCookie('msg', $e->getMessage());
  } finally {
    $app->response->headers->set('Location', 'http://localhost:8080/server/');
  }
});


/*
  POST /register
  - params expected:
  - redirects user to AuthorizeUrl
  - redirectUrl is the same as this ‘/register’
- if code param set
  - get new tokens and store them in session
  - get coinbase token
  - store phone number and coinbase token
  - return a success!

if session var is already set, return a failure code

*/
$app->get('/register', function() use ($app){

  // if session var is set, then just renew tokens
  // send failure JSON
  if (is_null($app->request->params('phoneno')) &&
      !isset($_SESSION['phoneno'])) {
    echo json_encode(array(
      "status" => false,
      "msg" => "Phone number needed"));
    return;
  }

  // Create an application at https://coinbase.com/oauth/applications and set these values accordingly
  $_CLIENT_ID = getenv('FC_CLIENT_ID');
  $_CLIENT_SECRET = getenv('FC_CLIENT_SECRET');

  // Note: your redirect URL should use HTTPS.
  $_REDIRECT_URL = "http://localhost:8080/server/register";

  $coinbaseOauth = new Coinbase_OAuth($_CLIENT_ID, $_CLIENT_SECRET, $_REDIRECT_URL);

  // If code hasn't been set, redirect to the coinbase page
  // and set session variable
  if (is_null($app->request->params('code'))) {
    $_SESSION['phoneno'] = $app->request->params('phoneno');
    $app->response->headers->set('Location', $coinbaseOauth->createAuthorizeUrl("user", "balance", "buttons"));
    return;
  }

  // if code has been set, get the tokens
  $tokens = $coinbaseOauth->getTokens($app->request->params('code'));

  // Save tokens to session variable
  try {
    $dbc = new DbConn();
    $dbc->storeUserToken($_SESSION['phoneno'],
                       $tokens["access_token"],
                       $tokens["refresh_token"]);
  } catch(Exception $e) {
    echo json_encode(array(
              "status" => false,
              "msg" => $e->getMessage()));
  }

  // Return success JSON response
  echo json_encode(array(
    "status" => true
  ));

});

/*
POST /sendMoney
- params expected:
  - sender's phone number
  - amount
  - currency*/
// TODO: change to post
$app->get('/sendMoney', function() use ($app) {

  /*
    preconditions


  */


});

$app->run();
