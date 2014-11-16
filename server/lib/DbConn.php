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
  public function storeUserToken($cbId, $accessToken, $refreshToken) {
    // TODO Add user to database
    $query = "INSERT INTO users (cb_id, cb_access_token, cb_refresh_token) ";
    $query .= "VALUES ('$cbId','$accessToken','$refreshToken') ";
    $query .= "ON DUPLICATE KEY UPDATE ";
    $query .= "cb_access_token=VALUES(cb_access_token), ";
    $query .= "cb_refresh_token=VALUES(cb_refresh_token);";
    $result = $this->CONN->real_query($query);
    if (!$result) {
      throw new Exception($this->CONN->error);
    }
    return $result;
  }

  public function userHasPhone($cbId) {
    $query = "SELECT phone_no FROM users WHERE cb_id='$cbId';";
    $result = $this->CONN->query($query);
    if(!$result) {
      throw new Exception($this->CONN->error);
    }

    // If cb id doesn't exist in the database, return false
    if ($result->num_rows === 0) {
      return false;
    }

    // Check if phone is null or an empty string, return false
    $row = $result->fetch_assoc();
    return !is_null($row['phone_no']) &&
           strlen(trim($row['phone_no'])) > 0;
  }

  public function getUserTokens($cbId) {
    $query = "SELECT cb_access_token, cb_refresh_token ";
    $query .= "FROM users WHERE cb_id='$cbId';";
    $result = $this->CONN->query($query);
    if (!$result || $result->num_rows === 0) {
      throw new Exception($this->CONN->error);
    }
    // Fetch only the first record and
    // return the access/refresh token
    $row = $res->fetch_assoc();
    return array(
      "access_token" => $row['cb_access_token'],
      "refresh_token" => $row['cb_refresh_token']
    );
  }

  public function attachPhone($cbId, $phoneNum) {
    $query = "UPDATE users ";
    $query .= "SET phone_no='$phoneNum' ";
    $query .= "WHERE cb_id='$cbId';";
    
    $result = $this->CONN->real_query($query);
    if (!result) {
      throw new Exception($this->CONN->error);
    }
    return true;
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
