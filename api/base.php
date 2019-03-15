<?php

// error_reporting(E_ALL);
// ini_set('display_errors', 1);

header('Content-type: application/json');

$conn = oci_connect('rgajrawa', '178Project', '//dbserver.engr.scu.edu/db11g');
if (!$conn) {
	header($_SERVER['SERVER_PROTOCOL'] . ' 500 Internal Server Error', true, 500);
	echo json_encode(oci_error());
	exit(1);
}
