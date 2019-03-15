<?php

// get customer information
// get car information
// time_in, time_out
// get problems ()
// get parts ()
// fee = labor_hours * hourly_pay_rate + SUM(cost * qty)

include_once 'base.php';

////////////////////////////////////////////////////////////////////////////////

if (
	$_SERVER['REQUEST_METHOD'] == 'GET' &&
	isset($_GET['repairJobID'])
) {
	$sql = 'SELECT getCustName(:repairJobID) FROM Dual';
	$query = oci_parse($conn, $sql);

	$repairJobID = $_GET['repairJobID'];

	oci_bind_by_name($query, ':repairJobID', $repairJobID);

	if (!oci_execute($query)) {
		header($_SERVER['SERVER_PROTOCOL'] . ' 500 Internal Server Error', true, 500);
		echo json_encode(oci_error());
		exit(1);
	}

	$custName = oci_fetch_array($query, OCI_NUM)[0];

	////////////////////////////////////////////////////////////////////////////

	$sql = 'SELECT getCustName(:repairJobID) FROM Dual';
	$query = oci_parse($conn, $sql);

	$repairJobID = $_GET['repairJobID'];

	oci_bind_by_name($query, ':repairJobID', $repairJobID);

	if (!oci_execute($query)) {
		header($_SERVER['SERVER_PROTOCOL'] . ' 500 Internal Server Error', true, 500);
		echo json_encode(oci_error());
		exit(1);
	}

	$custName = oci_fetch_array($query, OCI_NUM)[0];

	////////////////////////////////////////////////////////////////////////////
}

////////////////////////////////////////////////////////////////////////////////
