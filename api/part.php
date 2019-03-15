<?php

include_once 'base.php';

////////////////////////////////////////////////////////////////////////////////

if ($_SERVER['REQUEST_METHOD'] == 'GET') {
	$sql = 'SELECT part_name FROM Part';
	$query = oci_parse($conn, $sql);

	if (!oci_execute($query)) {
		header($_SERVER['SERVER_PROTOCOL'] . ' 500 Internal Server Error', true, 500);
		echo json_encode(oci_error());
		exit(1);
	}

	oci_fetch_all($query, $partNames);

	header($_SERVER['SERVER_PROTOCOL'] . ' 200 OK', true, 200);
	echo json_encode($partNames['PART_NAME']);
	exit(0);
}

////////////////////////////////////////////////////////////////////////////////

if (
	$_SERVER['REQUEST_METHOD'] == 'POST' &&
	isset($_POST['partName']) &&
	isset($_POST['cost'])
) {
	$sql = 'INSERT INTO Part (part_name, cost) VALUES (:partName, :cost)';
	$query = oci_parse($conn, $sql);

	$partName = $_POST['partName'];
	$cost = $_POST['cost'];

	oci_bind_by_name($query, ':partName', $partName);
	oci_bind_by_name($query, ':cost', $cost);

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
