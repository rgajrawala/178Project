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
			echo json_encode(0);
			exit(1);
		}

		header($_SERVER['SERVER_PROTOCOL'] . ' 200 OK', true, 200);
		echo json_encode($repairJobs);
		exit(0);
	}

	if (isset($_GET['finished'])) {
		$sql = 'SELECT RepairJob_id FROM Finished_RepairJob';
		$query = oci_parse($conn, $sql);

		if (!oci_execute($query)) {
			header($_SERVER['SERVER_PROTOCOL'] . ' 500 Internal Server Error', true, 500);
			echo json_encode(oci_error());
			exit(1);
		}

		oci_fetch_all($query, $finishedRepairJobs);

		header($_SERVER['SERVER_PROTOCOL'] . ' 200 OK', true, 200);
		echo json_encode($finishedRepairJobs['REPAIRJOB_ID']);
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
	isset($_POST['custPhone']) &&
	isset($_POST['custEmail']) &&
	isset($_POST['custName']) &&
	isset($_POST['custAddress']) &&
	isset($_POST['licenseNumber']) &&
	isset($_POST['model']) &&
	isset($_POST['mechanicID']) &&
	isset($_POST['repairJobID'])
) {
	$sql = 'BEGIN newRepairJob(:repairJobID, :timeIn, :mechanicID, :licenseNumber, :model, :custPhone, :custEmail, :custName, :custAddress); END;';
	$query = oci_parse($conn, $sql);

	$timeIn = date('d-M-Y');

	oci_bind_by_name($query, ':custPhone', $_POST['custPhone']);
	oci_bind_by_name($query, ':custEmail', $_POST['custEmail']);
	oci_bind_by_name($query, ':custName', $_POST['custName']);
	oci_bind_by_name($query, ':custAddress', $_POST['custAddress']);
	oci_bind_by_name($query, ':licenseNumber', $_POST['licenseNumber']);
	oci_bind_by_name($query, ':model', $_POST['model']);
	oci_bind_by_name($query, ':mechanicID', $_POST['mechanicID']);
	oci_bind_by_name($query, ':repairJobID', $_POST['repairJobID']);
	oci_bind_by_name($query, ':timeIn', $timeIn);

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

if (
	$_SERVER['REQUEST_METHOD'] == 'PATCH'
) {
	parse_str(file_get_contents('php://input'), $_PATCH);

	if (
		!isset($_PATCH['REPAIRJOB_ID']) ||
		!isset($_PATCH['PARTS']) ||
		!isset($_PATCH['PROBLEMS']) ||
		!isset($_PATCH['LABOR_HOURS'])
	) {
		header($_SERVER['SERVER_PROTOCOL'] . '400 Bad Request', true, 400);
		echo json_encode(0);
		exit(1);
	}

	// Update repair job

	$repairJobID = $_PATCH['REPAIRJOB_ID'];

	$sql = 'UPDATE RepairJob SET labor_hours = :laborHours WHERE RepairJob_id = :repairJobID';
	$query = oci_parse($conn, $sql);

	$laborHours = $_PATCH['LABOR_HOURS'];

	oci_bind_by_name($query, ':repairJobID', $repairJobID);
	oci_bind_by_name($query, ':laborHours', $laborHours);

	if (!oci_execute($query)) {
		header($_SERVER['SERVER_PROTOCOL'] . ' 500 Internal Server Error', true, 500);
		echo json_encode(oci_error());
		exit(1);
	}

	// Update parts

	$sql = 'DELETE Uses WHERE RepairJob_id = :repairJobID';
	$query = oci_parse($conn, $sql);

	oci_bind_by_name($query, ':repairJobID', $repairJobID);

	if (!oci_execute($query)) {
		header($_SERVER['SERVER_PROTOCOL'] . ' 500 Internal Server Error', true, 500);
		echo json_encode(oci_error());
		exit(1);
	}

	$parts = $_PATCH['PARTS'];
	foreach ($parts as &$part) {
		$sql = 'BEGIN linkPart(:repairJobID, :partName, :partQuantity); END;';
		$query = oci_parse($conn, $sql);

		oci_bind_by_name($query, ':repairJobID', $part['REPAIRJOB_ID']);
		oci_bind_by_name($query, ':partName', $part['PART_NAME']);
		oci_bind_by_name($query, ':partQuantity', $part['QTY']);

		if (!oci_execute($query)) {
			header($_SERVER['SERVER_PROTOCOL'] . ' 500 Internal Server Error', true, 500);
			echo json_encode(oci_error());
			exit(1);
		}
	}

	// Update problems

	$sql = 'DELETE Fixes WHERE RepairJob_id = :repairJobID';
	$query = oci_parse($conn, $sql);

	oci_bind_by_name($query, ':repairJobID', $repairJobID);

	if (!oci_execute($query)) {
		header($_SERVER['SERVER_PROTOCOL'] . ' 500 Internal Server Error', true, 500);
		echo json_encode(oci_error());
		exit(1);
	}

	$problems = $_PATCH['PROBLEMS'];
	foreach ($problems as &$part) {
		$sql = 'BEGIN linkProblem(:repairJobID, :problemID); END;';
		$query = oci_parse($conn, $sql);

		oci_bind_by_name($query, ':repairJobID', $part['REPAIRJOB_ID']);
		oci_bind_by_name($query, ':problemID', $part['PROBLEM_ID']);

		if (!oci_execute($query)) {
			header($_SERVER['SERVER_PROTOCOL'] . ' 500 Internal Server Error', true, 500);
			echo json_encode(oci_error());
			exit(1);
		}
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
		echo json_encode(0);
		exit(1);
	}

	$sql = 'BEGIN finishRepairJob(:repairJobID, :timeOut); END;';
	$query = oci_parse($conn, $sql);

	$timeOut = date('d-M-Y');

	oci_bind_by_name($query, ':repairJobID', $_DELETE['repairJobID']);
	oci_bind_by_name($query, ':timeOut', $timeOut);

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
