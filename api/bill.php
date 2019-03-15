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
	!$_SERVER['REQUEST_METHOD'] == 'GET' ||
	!isset($_GET['repairJobID'])
) {
	header($_SERVER['SERVER_PROTOCOL'] . '400 Bad Request', true, 400);
	echo json_encode(0);
	exit(1);
}

$data = array();

$sql = 'SELECT getCustName(:repairJobID) FROM Dual';
$query = oci_parse($conn, $sql);

oci_bind_by_name($query, ':repairJobID', $_GET['repairJobID']);

if (!oci_execute($query)) {
	header($_SERVER['SERVER_PROTOCOL'] . ' 500 Internal Server Error', true, 500);
	echo json_encode(oci_error());
	exit(1);
}

$data['CUST_NAME'] = oci_fetch_array($query, OCI_NUM)[0];

////////////////////////////////////////////////////////////////////////////

$sql = 'SELECT getCustPhone(:repairJobID) FROM Dual';
$query = oci_parse($conn, $sql);

oci_bind_by_name($query, ':repairJobID', $_GET['repairJobID']);

if (!oci_execute($query)) {
	header($_SERVER['SERVER_PROTOCOL'] . ' 500 Internal Server Error', true, 500);
	echo json_encode(oci_error());
	exit(1);
}

$data['CUST_PHONE'] = oci_fetch_array($query, OCI_NUM)[0];

////////////////////////////////////////////////////////////////////////////

$sql = 'SELECT getCustAddress(:repairJobID) FROM Dual';
$query = oci_parse($conn, $sql);

oci_bind_by_name($query, ':repairJobID', $_GET['repairJobID']);

if (!oci_execute($query)) {
	header($_SERVER['SERVER_PROTOCOL'] . ' 500 Internal Server Error', true, 500);
	echo json_encode(oci_error());
	exit(1);
}

$data['CUST_ADDRESS'] = oci_fetch_array($query, OCI_NUM)[0];

////////////////////////////////////////////////////////////////////////////

$sql = 'SELECT getModel(:repairJobID) FROM Dual';
$query = oci_parse($conn, $sql);

oci_bind_by_name($query, ':repairJobID', $_GET['repairJobID']);

if (!oci_execute($query)) {
	header($_SERVER['SERVER_PROTOCOL'] . ' 500 Internal Server Error', true, 500);
	echo json_encode(oci_error());
	exit(1);
}

$data['MODEL'] = oci_fetch_array($query, OCI_NUM)[0];

////////////////////////////////////////////////////////////////////////////

$sql = 'SELECT getTimeIn(:repairJobID) FROM Dual';
$query = oci_parse($conn, $sql);

oci_bind_by_name($query, ':repairJobID', $_GET['repairJobID']);

if (!oci_execute($query)) {
	header($_SERVER['SERVER_PROTOCOL'] . ' 500 Internal Server Error', true, 500);
	echo json_encode(oci_error());
	exit(1);
}

$data['TIME_IN'] = oci_fetch_array($query, OCI_NUM)[0];

////////////////////////////////////////////////////////////////////////////

$sql = 'SELECT getTimeOut(:repairJobID) FROM Dual';
$query = oci_parse($conn, $sql);

oci_bind_by_name($query, ':repairJobID', $_GET['repairJobID']);

if (!oci_execute($query)) {
	header($_SERVER['SERVER_PROTOCOL'] . ' 500 Internal Server Error', true, 500);
	echo json_encode(oci_error());
	exit(1);
}

$data['TIME_OUT'] = oci_fetch_array($query, OCI_NUM)[0];

////////////////////////////////////////////////////////////////////////////

$sql = 'SELECT getServiceCharge(:repairJobID) FROM Dual';
$query = oci_parse($conn, $sql);

oci_bind_by_name($query, ':repairJobID', $_GET['repairJobID']);

if (!oci_execute($query)) {
	header($_SERVER['SERVER_PROTOCOL'] . ' 500 Internal Server Error', true, 500);
	echo json_encode(oci_error());
	exit(1);
}

$data['SERVICE_CHARGE'] = oci_fetch_array($query, OCI_NUM)[0];

////////////////////////////////////////////////////////////////////////////

$sql = 'SELECT getsDiscount(:phoneNumber) FROM Dual';
$query = oci_parse($conn, $sql);

oci_bind_by_name($query, ':phoneNumber', $data['CUST_PHONE']);

if (!oci_execute($query)) {
	header($_SERVER['SERVER_PROTOCOL'] . ' 500 Internal Server Error', true, 500);
	echo json_encode(oci_error());
	exit(1);
}

$data['DISCOUNT'] = oci_fetch_array($query, OCI_NUM)[0];

////////////////////////////////////////////////////////////////////////////////

$sql = 'SELECT getTotalCost(:repairJobID) FROM Dual';
$query = oci_parse($conn, $sql);

oci_bind_by_name($query, ':repairJobID', $_GET['repairJobID']);

if (!oci_execute($query)) {
	header($_SERVER['SERVER_PROTOCOL'] . ' 500 Internal Server Error', true, 500);
	echo json_encode(oci_error());
	exit(1);
}

$data['TOTAL_COST'] = oci_fetch_array($query, OCI_NUM)[0];

////////////////////////////////////////////////////////////////////////////////

$sql = 'SELECT part_name, qty, cost FROM Used NATURAL JOIN Part WHERE RepairJob_id = :repairJobID';
$query = oci_parse($conn, $sql);

oci_bind_by_name($query, ':repairJobID', $_GET['repairJobID']);

if (!oci_execute($query)) {
	header($_SERVER['SERVER_PROTOCOL'] . ' 500 Internal Server Error', true, 500);
	echo json_encode(oci_error());
	exit(1);
}

$data['PARTS'] = array();
while (($row = oci_fetch_array($query, OCI_ASSOC)) != false) {
	$data['PARTS'][] = $row;
}

////////////////////////////////////////////////////////////////////////////////

$sql = 'SELECT problem_id, type FROM Fixed NATURAL JOIN Problem WHERE RepairJob_id = :repairJobID';
$query = oci_parse($conn, $sql);

oci_bind_by_name($query, ':repairJobID', $_GET['repairJobID']);

if (!oci_execute($query)) {
	header($_SERVER['SERVER_PROTOCOL'] . ' 500 Internal Server Error', true, 500);
	echo json_encode(oci_error());
	exit(1);
}

$data['PROBLEMS'] = array();
while (($row = oci_fetch_array($query, OCI_ASSOC)) != false) {
	$data['PROBLEMS'][] = $row;
}

////////////////////////////////////////////////////////////////////////////////

$sql = 'SELECT labor_hours FROM Finished_RepairJob WHERE RepairJob_id = :repairJobID';
$query = oci_parse($conn, $sql);

oci_bind_by_name($query, ':repairJobID', $_GET['repairJobID']);

if (!oci_execute($query)) {
	header($_SERVER['SERVER_PROTOCOL'] . ' 500 Internal Server Error', true, 500);
	echo json_encode(oci_error());
	exit(1);
}

$data['LABOR_HOURS'] = oci_fetch_array($query, OCI_NUM)[0];

////////////////////////////////////////////////////////////////////////////////

$sql = 'SELECT mechanic_id, emp_name, hourly_pay_rate FROM Finished_RepairJob NATURAL JOIN Mechanic WHERE RepairJob_id = :repairJobID';
$query = oci_parse($conn, $sql);

oci_bind_by_name($query, ':repairJobID', $_GET['repairJobID']);

if (!oci_execute($query)) {
	header($_SERVER['SERVER_PROTOCOL'] . ' 500 Internal Server Error', true, 500);
	echo json_encode(oci_error());
	exit(1);
}

$data['MECHANIC'] = oci_fetch_array($query, OCI_ASSOC);

////////////////////////////////////////////////////////////////////////////////

header($_SERVER['SERVER_PROTOCOL'] . ' 200 OK', true, 200);
echo json_encode($data);
exit(0);
