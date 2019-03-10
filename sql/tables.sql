-- Reset tables
DROP TABLE Fixes;
DROP TABLE Uses;
DROP TABLE Fixed;
DROP TABLE Used;
DROP TABLE RepairJob;
DROP TABLE Finished_RepairJob;
DROP TABLE Car;
DROP TABLE Meteor_Customer;
DROP TABLE Mechanic;
DROP TABLE Part;
DROP TABLE Problem;


-- Create Tables For Entities
CREATE TABLE Meteor_Customer
(
	cust_phone varchar(13) PRIMARY KEY,
	cust_email varchar(40),
	cust_name varchar(40),
	cust_address varchar(140) 
);

CREATE TABLE Car with foreign key
(
	license_number varchar(10) PRIMARY KEY,
	model varchar(40),
	cust_phone varchar(13),
	CONSTRAINT FK_Customer FOREIGN KEY (cust_phone) REFERENCES Meteor_Customer(cust_phone)
);
CREATE TABLE Mechanic
(
	employee_id varchar(10) PRIMARY KEY,
	emp_phone varchar(13),
	emp_name varchar(40),
	hourly_pay_rate DECIMAL(7,2) DEFAULT 20.00
);
CREATE TABLE RepairJob
(
	RepairJob_id varchar(10) PRIMARY KEY,
	time_in DATE NOT NULL,
	time_out DATE,
	labor_hours INTEGER,
	employee_id varchar(10) NOT NULL,
	license_number varchar(10) NOT NULL,
	CONSTRAINT FK_Mechanic FOREIGN KEY (employee_id) REFERENCES Mechanic(employee_id),
	CONSTRAINT FK_Car FOREIGN KEY (license_number) REFERENCES Car(license_number)
);
CREATE TABLE Finished_RepairJob
(
	RepairJob_id varchar(10) PRIMARY KEY,
	time_in DATE NOT NULL,
	time_out DATE NOT NULL,
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

-- Create Relationship Tables
CREATE TABLE Fixes
(
	RepairJob_id varchar(10),
	problem_id varchar(10),
	CONSTRAINT FK_RepairJob_Fixes FOREIGN KEY (RepairJob_id) REFERENCES RepairJob(RepairJob_id),
	CONSTRAINT FK_Problem FOREIGN KEY (problem_id) REFERENCES Problem(problem_id)
);

-- Holds problems fixed by finished repair jobs
CREATE TABLE Fixed
(
	RepairJob_id varchar(10),
	problem_id varchar(10),
	CONSTRAINT FK_Finished_RepairJob_Fixed FOREIGN KEY (RepairJob_id) REFERENCES Finished_RepairJob(RepairJob_id),
	CONSTRAINT FK_Finished_Problem FOREIGN KEY (problem_id) REFERENCES Problem(problem_id)
);

CREATE TABLE Uses
(
	RepairJob_id varchar(10),
	part_name varchar(40),
	qty integer,
	CONSTRAINT FK_RepairJob FOREIGN KEY (RepairJob_id) REFERENCES RepairJob(RepairJob_id),
	CONSTRAINT FK_Part FOREIGN KEY (part_name) REFERENCES Part(part_name)
);

-- Holds parts used by the finished repair jobs
CREATE TABLE Used
(
	RepairJob_id varchar(10),
	part_name varchar(40),
	qty integer,
	CONSTRAINT FK_Finished_RepairJob FOREIGN KEY (RepairJob_id) REFERENCES Finished_RepairJob(RepairJob_id),
	CONSTRAINT FK_Finished_Part FOREIGN KEY (part_name) REFERENCES Part(part_name)
);

