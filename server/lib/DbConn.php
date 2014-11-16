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
  public function storeUserToken($cbId, $phoneNum, $accessToken, $refreshToken) {
    // TODO Add user to database
    $query = "INSERT INTO users (cb_id, phone_no,cb_access_token, cb_refresh_token) ";
    $query .= "VALUES ('$cbId', '$phoneNum','$accessToken','$refreshToken') ";
    $query .= "ON DUPLICATE KEY UPDATE ";
    $query .= "cb_access_token=VALUES(cb_access_token), ";
    $query .= "cb_refresh_token=VALUES(cb_refresh_token);";
    $result = $this->CONN->real_query($query);
    if (!$result) {
      throw new Exception($this->CONN->error);
    }
  }

  public function getUserTokens($cbId) {
    $query = "SELECT cb_access_token, cb_refresh_token ";
    $query .= "FROM users WHERE cb_id='$cbId';";
    $result = $this->CONN->query($query);
    if (!$result || $result->num_rows === 0) {
      throw new Exception($this->CONN->error);
    }
    // TODO return user tokens
  }

  public function attachPhone($cbId, $phoneNum) {
    // TODO make update query for phone
    $query = "";
    $result = $this->CONN->real_query($query);
    if (!result) {
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
