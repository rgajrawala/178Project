<?php

include_once 'base.php';

////////////////////////////////////////////////////////////////////////////////

if ($_SERVER['REQUEST_METHOD'] == 'GET') {
	$sql = 'SELECT cust_phone FROM Meteor_Customer';
	$query = oci_parse($conn, $sql);

	if (!oci_execute($query)) {
		header($_SERVER['SERVER_PROTOCOL'] . ' 500 Internal Server Error', true, 500);
		echo json_encode(oci_error());
		exit(1);
	}

	oci_fetch_all($query, $customerPhones);

	header($_SERVER['SERVER_PROTOCOL'] . ' 200 OK', true, 200);
	echo json_encode($customerPhones['CUST_PHONE']);
	exit(0);
}

////////////////////////////////////////////////////////////////////////////////

if (
	$_SERVER['REQUEST_METHOD'] == 'POST' &&
	isset($_POST['custPhone']) &&
	isset($_POST['custEmail']) &&
	isset($_POST['custName']) &&
	isset($_POST['custAddress'])
) {
	$sql = 'INSERT INTO Meteor_Customer (cust_phone, cust_email, cust_name, cust_address) VALUES (:custPhone, :custEmail, :custName, :custAddress)';
	$query = oci_parse($conn, $sql);

	$custPhone = $_POST['custPhone'];
	$custEmail = $_POST['custEmail'];
	$custName = $_POST['custName'];
	$custAddress = $_POST['custAddress'];

	oci_bind_by_name($query, ':custPhone', $custPhone);
	oci_bind_by_name($query, ':custEmail', $custEmail);
	oci_bind_by_name($query, ':custName', $custName);
	oci_bind_by_name($query, ':custAddress', $custAddress);

	if (!oci_execute($query)) {
		header($_SERVER['SERVER_PROTOCOL'] . ' 500 Internal Server Error', true, 500);
		echo json_encode(oci_error());
		exit(1);
	}

	oci_fetch($query);

	if (oci_num_rows($query) == 0) {
		header($_SERVER['SERVER_PROTOCOL'] . ' 500 Internal Server Error', true, 500);
		echo json_encode(oci_error());
		exit(1);
	}

	header($_SERVER['SERVER_PROTOCOL'] . ' 200 OK', true, 200);
	exit(0);
}

////////////////////////////////////////////////////////////////////////////////

header($_SERVER['SERVER_PROTOCOL'] . '400 Bad Request', true, 400);
exit(1);
