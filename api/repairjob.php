<?php

include_once 'base.php';

if (
	$_SERVER['REQUEST_METHOD'] == 'POST' &&
	isset($_POST['contactInfo']) &&
	isset($_POST['custName']) &&
	isset($_POST['custAddress']) &&
	isset($_POST['licenseNumber']) &&
	isset($_POST['model']) &&
	isset($_POST['mechanicID']) &&
	isset($_POST['repairJobID'])
) {
	$sql = 'BEGIN newRepairJob(:contactInfo, :custName, :custAddress, :licenseNumber, :model, :mechanicID, :repairJobID); END;';
	$query = oci_parse($conn, $sql);

	oci_bind_by_name($query, ':contactInfo', $contactInfo);
	oci_bind_by_name($query, ':custName', $custName);
	oci_bind_by_name($query, ':custAddress', $custAddress);
	oci_bind_by_name($query, ':licenseNumber', $licenseNumber);
	oci_bind_by_name($query, ':model', $model);
	oci_bind_by_name($query, ':mechanicID', $mechanicID);
	oci_bind_by_name($query, ':repairJobID', $repairJobID);

	$contactInfo = isset($_POST['contactInfo']);
	$custName = isset($_POST['custName']);
	$custAddress = isset($_POST['custAddress']);
	$licenseNumber = isset($_POST['licenseNumber']);
	$model = isset($_POST['model']);
	$mechanicID = isset($_POST['mechanicID']);
	$repairJobID = isset($_POST['repairJobID']);

	if (!oci_execute($query)) {
		header($_SERVER['SERVER_PROTOCOL'] . ' 500 Internal Server Error', true, 500);
		echo json_encode(oci_error());
		exit(1);
	}

	header($_SERVER['SERVER_PROTOCOL'] . ' 200 OK', true, 200);
	echo json_encode(array('success' => TRUE));
	exit(0);
}
