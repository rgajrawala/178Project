-- Set up all the tables/relations.

-- Table Schemas updated: 3/4/19
DROP TABLE Fixes;
DROP TABLE Uses;
DROP TABLE RepairJob;
DROP TABLE Finished_RepairJob;
DROP TABLE Car;
DROP TABLE Meteor_Customer;
DROP TABLE Mechanic;
DROP TABLE Part;
DROP TABLE Problem;


CREATE TABLE Meteor_Customer
(
	cust_phone varchar(13),
	cust_email varchar(40),
	cust_name varchar(40),
	cust_address varchar(140),
	CONSTRAINT PK_Customer PRIMARY KEY (cust_phone, cust_email)
);

CREATE TABLE Car
(
	license_number varchar(10) PRIMARY KEY,
	model varchar(40),
	cust_phone varchar(13),
	cust_email varchar(40),
	CONSTRAINT FK_Customer FOREIGN KEY (cust_phone, cust_email) REFERENCES Meteor_Customer(cust_phone, cust_email)
);
CREATE TABLE Mechanic
(
	employee_id varchar(10) PRIMARY KEY,
	emp_phone varchar(10),
	emp_name varchar(40),
	hourly_pay_rate DECIMAL(7,2) DEFAULT 20.00
);
CREATE TABLE RepairJob
(
	RepairJob_id NUMBER PRIMARY KEY,
	time_in timestamp NOT NULL,
	time_out timestamp,
	labor_hours INTEGER NOT NULL,
	employee_id varchar(10) NOT NULL,
	license_number varchar(10) NOT NULL,
	CONSTRAINT FK_Mechanic FOREIGN KEY (employee_id) REFERENCES Mechanic(employee_id),
	CONSTRAINT FK_Car FOREIGN KEY (license_number) REFERENCES Car(license_number)
);
CREATE TABLE Finished_RepairJob
(
	RepairJob_id NUMBER PRIMARY KEY,
	time_in timestamp NOT NULL,
	time_out timestamp,
	labor_hours INTEGER NOT NULL,
	employee_id varchar(10) NOT NULL,
	license_number varchar(10) NOT NULL,
	CONSTRAINT FK_Mechanic_Finished FOREIGN KEY (employee_id) REFERENCES Mechanic(employee_id),
	CONSTRAINT FK_Car_Finished FOREIGN KEY (license_number) REFERENCES Car(license_number)
);
CREATE TABLE Part
(
	part_name varchar(40) PRIMARY KEY,
	cost DECIMAL(20,2)
);

CREATE TABLE Problem
(
	problem_id varchar(10) PRIMARY KEY,
	type varchar(40)
);

CREATE TABLE Fixes
(
	RepairJob_id NUMBER,
	problem_id varchar(10),
	CONSTRAINT FK_RepairJob_Fixes FOREIGN KEY (RepairJob_id) REFERENCES RepairJob(RepairJob_id),
	CONSTRAINT FK_Problem FOREIGN KEY (problem_id) REFERENCES Problem(problem_id)
);

CREATE TABLE Uses
(
	RepairJob_id NUMBER,
	part_name varchar(40),
	CONSTRAINT FK_RepairJob FOREIGN KEY (RepairJob_id) REFERENCES RepairJob(RepairJob_id),
	CONSTRAINT FK_Part FOREIGN KEY (part_name) REFERENCES Part(part_name)
);

--Insert Values TODO



