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
	isset($_POST['partCost'])
) {
	$sql = 'BEGIN createPart(:partName, :partCost); END;';
	$query = oci_parse($conn, $sql);

	$partName = $_POST['partName'];
	$partCost = $_POST['partCost'];

	oci_bind_by_name($query, ':partName', $partName);
	oci_bind_by_name($query, ':partCost', $partCost);

	if (!oci_execute($query)) {
		header($_SERVER['SERVER_PROTOCOL'] . ' 500 Internal Server Error', true, 500);
		echo json_encode(oci_error());
		exit(1);
	}

	header($_SERVER['SERVER_PROTOCOL'] . ' 200 OK', true, 200);
	echo json_encode(0);
	exit(0);
}

////////////////////////////////////////////////////////////////////////////////

header($_SERVER['SERVER_PROTOCOL'] . '400 Bad Request', true, 400);
echo json_encode(0);
exit(1);
