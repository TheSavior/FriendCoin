<?php

class DbConn {

  public $CONN;

  // new DbCon
  public function __construct() {
    try {
      $this->CONN = new mysqli('localhost',
                               getenv('FC_DB_USER'),
                               getenv('FC_DB_PASS'),
                               'friendcoindb');
    } catch (Exception $e) {
      echo $e;
    }
  }

  // Stores tokens for the given user
  // If the phone number already exists,
  // just update the access and refresh tokens.
  public function storeUserToken($phoneNum, $accessToken, $refreshToken) {
    // TODO Add user to database
    $query = "INSERT INTO users (phone_no,cb_access_token, cb_refresh_token) ";
    $query .= "VALUES ('$phoneNum','$accessToken','$refreshToken') ";
    $query .= "ON DUPLICATE KEY UPDATE ";
    $query .= "cb_access_token=VALUES(cb_access_token), ";
    $query .= "cb_refresh_token=VALUES(cb_refresh_token);";
    $result = $this->CONN->real_query($query);
    if (!$result) {
      throw new Exception($this->CONN->error);
    }
  }
}

// ============================================================================
// TESTS

/*
$dbcon = new DbConn();
try {
  $dbcon->storeUserToken('1234567890', 'ACCESSTOKENABCDEF', 'REFRESHTOKENABCDEF');
  echo "SUCCESS!";
} catch (Exception $e) {
  echo "ERROR: $e";
}
*/
