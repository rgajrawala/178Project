<?php

include_once 'base.php';

////////////////////////////////////////////////////////////////////////////////

if ($_SERVER['REQUEST_METHOD'] == 'GET') {
	$sql = 'SELECT * FROM Problem';
	$query = oci_parse($conn, $sql);

	if (!oci_execute($query)) {
		header($_SERVER['SERVER_PROTOCOL'] . ' 500 Internal Server Error', true, 500);
		echo json_encode(oci_error());
		exit(1);
	}

	$problems = array();
	while (($row = oci_fetch_array($query, OCI_ASSOC)) != false) {
		$problems[] = $row;
	}

	header($_SERVER['SERVER_PROTOCOL'] . ' 200 OK', true, 200);
	echo json_encode($problems);
	exit(0);
}

////////////////////////////////////////////////////////////////////////////////

if (
	$_SERVER['REQUEST_METHOD'] == 'POST' &&
	isset($_POST['problemID']) &&
	isset($_POST['problemType'])
) {
	$sql = 'BEGIN createProblem(:problemID, :problemType); END;';
	$query = oci_parse($conn, $sql);

	$problemID = $_POST['problemID'];
	$problemType = $_POST['problemType'];

	oci_bind_by_name($query, ':problemID', $problemID);
	oci_bind_by_name($query, ':problemType', $problemType);

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
