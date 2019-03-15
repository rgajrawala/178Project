<?php

include_once 'base.php';

////////////////////////////////////////////////////////////////////////////////

if (
	isset($_GET['repairJobs']) &&
	isset($_GET['startDate']) &&
	isset($_GET['endDate'])
) {
	$sql = 'SELECT RepairJob_id, model, mechanic_id, emp_name FROM Finished_RepairJob NATURAL JOIN Car NATURAL JOIN Mechanic WHERE time_out BETWEEN :startDate AND :endDate';
	$query1 = oci_parse($conn, $sql);

	$startDate = date('d-M-Y', strtotime($_GET['startDate']));
	$endDate = date('d-M-Y', strtotime($_GET['endDate']));

	oci_bind_by_name($query1, ':startDate', $startDate);
	oci_bind_by_name($query1, ':endDate', $endDate);

	if (!oci_execute($query1)) {
		header($_SERVER['SERVER_PROTOCOL'] . ' 500 Internal Server Error', true, 500);
		echo json_encode(oci_error());
		exit(1);
	}

	$repairJobs = array();
	while (($row1 = oci_fetch_array($query1, OCI_ASSOC)) != false) {
		$sql = 'SELECT problem_id, type FROM Fixed NATURAL JOIN Problem WHERE RepairJob_id = :repairJobID';
		$query2 = oci_parse($conn, $sql);

		oci_bind_by_name($query2, ':repairJobID', $row1['REPAIRJOB_ID']);

		if (!oci_execute($query2)) {
			header($_SERVER['SERVER_PROTOCOL'] . ' 500 Internal Server Error', true, 500);
			echo json_encode(oci_error());
			exit(1);
		}

		$row1['PROBLEMS'] = array();
		while (($row2 = oci_fetch_array($query2, OCI_ASSOC)) != false) {
			$row1['PROBLEMS'][] = $row2;
		}

		$repairJobs[] = $row1;
	}

	header($_SERVER['SERVER_PROTOCOL'] . ' 200 OK', true, 200);
	echo json_encode($repairJobs);
	exit(0);
}

////////////////////////////////////////////////////////////////////////////////

if (isset($_GET['mechanics'])) {
	$data = array('mostHours' => array(), 'leastHours' => array(), 'avgHours' => array());

	$sql = 'SELECT getMechanicWithMostHours() FROM Dual';
	$query = oci_parse($conn, $sql);

	if (!oci_execute($query)) {
		header($_SERVER['SERVER_PROTOCOL'] . ' 500 Internal Server Error', true, 500);
		echo json_encode(oci_error());
		exit(1);
	}

	$data['mostHours']['MECHANIC_ID'] = oci_fetch_array($query, OCI_NUM)[0];

	$sql = 'SELECT emp_name FROM Mechanic WHERE mechanic_id = :mechanicID';
	$query = oci_parse($conn, $sql);

	oci_bind_by_name($query, ':mechanicID', $data['mostHours']['MECHANIC_ID']);

	if (!oci_execute($query)) {
		header($_SERVER['SERVER_PROTOCOL'] . ' 500 Internal Server Error', true, 500);
		echo json_encode(oci_error());
		exit(1);
	}

	$data['mostHours']['EMP_NAME'] = oci_fetch_array($query, OCI_NUM)[0];

	$sql = 'SELECT getMechanicWithLeastHours() FROM Dual';
	$query = oci_parse($conn, $sql);

	if (!oci_execute($query)) {
		header($_SERVER['SERVER_PROTOCOL'] . ' 500 Internal Server Error', true, 500);
		echo json_encode(oci_error());
		exit(1);
	}

	$data['leastHours']['MECHANIC_ID'] = oci_fetch_array($query, OCI_NUM)[0];

	$sql = 'SELECT emp_name FROM Mechanic WHERE mechanic_id = :mechanicID';
	$query = oci_parse($conn, $sql);

	oci_bind_by_name($query, ':mechanicID', $data['leastHours']['MECHANIC_ID']);

	if (!oci_execute($query)) {
		header($_SERVER['SERVER_PROTOCOL'] . ' 500 Internal Server Error', true, 500);
		echo json_encode(oci_error());
		exit(1);
	}

	$data['leastHours']['EMP_NAME'] = oci_fetch_array($query, OCI_NUM)[0];

	$sql = 'SELECT getAverageHoursWorked() FROM Dual';
	$query = oci_parse($conn, $sql);

	if (!oci_execute($query)) {
		header($_SERVER['SERVER_PROTOCOL'] . ' 500 Internal Server Error', true, 500);
		echo json_encode(oci_error());
		exit(1);
	}

	$data['totalAvgHours'] = oci_fetch_array($query, OCI_NUM)[0];

	$sql = 'SELECT mechanic_id, AVG(labor_hours) FROM Finished_RepairJob GROUP BY mechanic_id';
	$query = oci_parse($conn, $sql);

	if (!oci_execute($query)) {
		header($_SERVER['SERVER_PROTOCOL'] . ' 500 Internal Server Error', true, 500);
		echo json_encode(oci_error());
		exit(1);
	}

	while (($row = oci_fetch_array($query, OCI_ASSOC)) != false) {
		$data['avgHours'][] = $row;
	}

	header($_SERVER['SERVER_PROTOCOL'] . ' 200 OK', true, 200);
	echo json_encode($data);
	exit(0);
}

////////////////////////////////////////////////////////////////////////////////

if (isset($_GET['revenue'])) {
	$sql = 'SELECT getTotalRevenue(:startDate, :endDate) FROM Dual';
	$query = oci_parse($conn, $sql);

	$startDate = date('d-M-Y', strtotime($_GET['startDate']));
	$endDate = date('d-M-Y', strtotime($_GET['endDate']));

	oci_bind_by_name($query, ':startDate', $startDate);
	oci_bind_by_name($query, ':endDate', $endDate);

	if (!oci_execute($query)) {
		header($_SERVER['SERVER_PROTOCOL'] . ' 500 Internal Server Error', true, 500);
		echo json_encode(oci_error());
		exit(1);
	}

	$info = oci_fetch_array($query, OCI_NUM)[0];

	header($_SERVER['SERVER_PROTOCOL'] . ' 200 OK', true, 200);
	echo json_encode($info);
	exit(0);
}

////////////////////////////////////////////////////////////////////////////////

header($_SERVER['SERVER_PROTOCOL'] . '400 Bad Request', true, 400);
echo json_encode(0);
exit(1);
