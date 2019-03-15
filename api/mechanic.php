<?php

include_once 'base.php';

////////////////////////////////////////////////////////////////////////////////

if ($_SERVER['REQUEST_METHOD'] == 'GET') {
	$sql = 'SELECT mechanic_id FROM Mechanic';
	$query = oci_parse($conn, $sql);

	if (!oci_execute($query)) {
		header($_SERVER['SERVER_PROTOCOL'] . ' 500 Internal Server Error', true, 500);
		echo json_encode(oci_error());
		exit(1);
	}

	oci_fetch_all($query, $mechanicIDs);

	header($_SERVER['SERVER_PROTOCOL'] . ' 200 OK', true, 200);
	echo json_encode($mechanicIDs['MECHANIC_ID']);
	exit(0);
}

////////////////////////////////////////////////////////////////////////////////

if (
	$_SERVER['REQUEST_METHOD'] == 'POST' &&
	isset($_POST['mechanicID']) &&
	isset($_POST['empPhone']) &&
	isset($_POST['empName']) &&
	isset($_POST['hourlyPayRate'])
) {
	$sql = 'INSERT INTO Mechanic (mechanic_id, emp_phone, emp_name, hourly_pay_rate) VALUES (:mechanicID, :empPhone, :empName, :hourlyPayRate)';
	$query = oci_parse($conn, $sql);

	oci_bind_by_name($query, ':mechanicID', $_POST['mechanicID']);
	oci_bind_by_name($query, ':empPhone', $_POST['empPhone']);
	oci_bind_by_name($query, ':empName', $_POST['empName']);
	oci_bind_by_name($query, ':hourlyPayRate', $_POST['hourlyPayRate']);

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
