<?php
session_start();

require 'lib/Slim/Slim.php';
\Slim\Slim::registerAutoloader();

require_once('lib/Coinbase.php');
require_once('lib/DbConn.php');

$app = new \Slim\Slim();

$app->get('/', function() {
  echo "Welcome to the API!";
});


/*
POST /register
- params expected:
  - phone_no
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
  - phone number
  - amount
  - currency*/
// TODO: change to post
$app->get('/sendMoney', function() use ($app) {
});

$app->run();
