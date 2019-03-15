<?php

include_once 'base.php';

////////////////////////////////////////////////////////////////////////////////

if ($_SERVER['REQUEST_METHOD'] == 'GET') {
	$sql = 'SELECT license_number FROM Car';
	$query = oci_parse($conn, $sql);

	if (!oci_execute($query)) {
		header($_SERVER['SERVER_PROTOCOL'] . ' 500 Internal Server Error', true, 500);
		echo json_encode(oci_error());
		exit(1);
	}

	oci_fetch_all($query, $licenseNumbers);

	header($_SERVER['SERVER_PROTOCOL'] . ' 200 OK', true, 200);
	echo json_encode($licenseNumbers['LICENSE_NUMBER']);
	exit(0);
}

////////////////////////////////////////////////////////////////////////////////

if (
	$_SERVER['REQUEST_METHOD'] == 'POST' &&
	isset($_POST['custPhone']) &&
	isset($_POST['custName']) &&
	isset($_POST['custAddress'])
) {
	$sql = 'INSERT INTO Car (license_number, model, cust_phone) VALUES (:licenseNumber, :model, :custPhone)';
	$query = oci_parse($conn, $sql);

	$licenseNumber = _POST['licenseNumber'];
	$model = _POST['model'];
	$custPhone = _POST['custPhone'];

	oci_bind_by_name($query, ':licenseNumber', $licenseNumber);
	oci_bind_by_name($query, ':model', $model);
	oci_bind_by_name($query, ':custPhone', $custPhone);

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
