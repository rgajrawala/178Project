<?php

include_once 'base.php';

////////////////////////////////////////////////////////////////////////////////

if ($_SERVER['REQUEST_METHOD'] == 'GET') {
	if (isset($_GET['repairJobID'])) {
		$sql1 = 'SELECT * FROM RepairJob WHERE RepairJob_id = :repairJobID';
		$sql2 = 'SELECT * FROM Fixes WHERE RepairJob_id = :repairJobID';
		$sql3 = 'SELECT * FROM Uses WHERE RepairJob_id = :repairJobID';

		$query1 = oci_parse($conn, $sql1);

		$repairJobID = $_GET['repairJobID'];

		oci_bind_by_name($query1, ':repairJobID', $repairJobID);

		if (!oci_execute($query1)) {
			header($_SERVER['SERVER_PROTOCOL'] . ' 500 Internal Server Error', true, 500);
			echo json_encode(oci_error());
			exit(1);
		}

		$repairJobs = array();
		while (($row1 = oci_fetch_array($query1, OCI_ASSOC)) != false) {
			$query2 = oci_parse($conn, $sql2);
			$query3 = oci_parse($conn, $sql3);

			$repairJobID1 = $row1['REPAIRJOB_ID'];

			oci_bind_by_name($query2, ':repairJobID', $repairJobID1);
			oci_bind_by_name($query3, ':repairJobID', $repairJobID1);

			if (!oci_execute($query2) || !oci_execute($query3)) {
				header($_SERVER['SERVER_PROTOCOL'] . ' 500 Internal Server Error', true, 500);
				echo json_encode(oci_error());
				exit(1);
			}

			$row1['PROBLEMS'] = array();
			$row1['PARTS'] = array();

			while (($row2 = oci_fetch_array($query2, OCI_ASSOC)) != false) {
				$row1['PROBLEMS'][] = $row2;
			}

			while (($row3 = oci_fetch_array($query3, OCI_ASSOC)) != false) {
				$row1['PARTS'][] = $row3;
			}

			$repairJobs[] = $row1;
		}

		if (empty($repairJobs)) {
			header($_SERVER['SERVER_PROTOCOL'] . ' 404 Not Found', true, 404);
			exit(1);
		}

		header($_SERVER['SERVER_PROTOCOL'] . ' 200 OK', true, 200);
		echo json_encode($repairJobs);
		exit(0);
	}

	$sql = 'SELECT RepairJob_id FROM RepairJob';
	$query = oci_parse($conn, $sql);

	if (!oci_execute($query)) {
		header($_SERVER['SERVER_PROTOCOL'] . ' 500 Internal Server Error', true, 500);
		echo json_encode(oci_error());
		exit(1);
	}

	oci_fetch_all($query, $repairJobs);

	header($_SERVER['SERVER_PROTOCOL'] . ' 200 OK', true, 200);
	echo json_encode($repairJobs['REPAIRJOB_ID']);
	exit(0);
}

////////////////////////////////////////////////////////////////////////////////

if (
	$_SERVER['REQUEST_METHOD'] == 'POST' &&
	isset($_POST['licenseNumber']) &&
	isset($_POST['mechanicID']) &&
	isset($_POST['repairJobID'])
) {
	$sql = "INSERT INTO RepairJob (RepairJob_id, time_in, mechanic_id, license_number) VALUES (:repairJobID, CURRENT_DATE, :mechanicID, :licenseNumber)";
	$query = oci_parse($conn, $sql);

	$licenseNumber = $_POST['licenseNumber'];
	$mechanicID = $_POST['mechanicID'];
	$repairJobID = $_POST['repairJobID'];
	// $timeIn = date('d-m-Y h:i:s');

	oci_bind_by_name($query, ':licenseNumber', $licenseNumber);
	oci_bind_by_name($query, ':mechanicID', $mechanicID);
	oci_bind_by_name($query, ':repairJobID', $repairJobID);
	// oci_bind_by_name($query, ':timeIn', $timeIn);

	if (!oci_execute($query)) {
		header($_SERVER['SERVER_PROTOCOL'] . ' 500 Internal Server Error', true, 500);
		echo json_encode(oci_error());
		exit(1);
	}

	if (oci_num_rows($query) == 0) {
		header($_SERVER['SERVER_PROTOCOL'] . ' 500 Internal Server Error', true, 500);
		echo json_encode(oci_error());
		exit(1);
	}

	header($_SERVER['SERVER_PROTOCOL'] . ' 200 OK', true, 200);
	echo json_encode(0);
	exit(0);
}

////////////////////////////////////////////////////////////////////////////////

if (
	$_SERVER['REQUEST_METHOD'] == 'PATCH'
) {
	parse_str(file_get_contents('php://input'), $_PATCH);

	if (
		isset($_PATCH['REPAIRJOB_ID']) &&
		isset($_PATCH['TIME_IN']) &&
		isset($_PATCH['TIME_IN'])
	) {

	}

	header($_SERVER['SERVER_PROTOCOL'] . ' 200 OK', true, 200);
	echo json_encode(0);
	exit(0);
}

////////////////////////////////////////////////////////////////////////////////

if (
	$_SERVER['REQUEST_METHOD'] == 'DELETE'
) {
	parse_str(file_get_contents('php://input'), $_DELETE);

	if (!isset($_DELETE['repairJobID'])) {
		header($_SERVER['SERVER_PROTOCOL'] . '400 Bad Request', true, 400);
		exit(1);
	}

	$sql = 'UPDATE RepairJob SET time_out = SYSDATE WHERE RepairJob_id = :repairJobID';
	$query = oci_parse($conn, $sql);

	$repairJobID = $_DELETE['repairJobID'];

	oci_bind_by_name($query, ':repairJobID', $repairJobID);

	if (!oci_execute($query)) {
		header($_SERVER['SERVER_PROTOCOL'] . ' 500 Internal Server Error', true, 500);
		echo json_encode(oci_error());
		exit(1);
	}

	if (oci_num_rows($query) == 0) {
		header($_SERVER['SERVER_PROTOCOL'] . ' 500 Internal Server Error', true, 500);
		echo json_encode(oci_error());
		exit(1);
	}

	$sql = 'SELECT finishRepairJob(:repairJobID) FROM Dual';
	$query = oci_parse($conn, $sql);

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
exit(1);
