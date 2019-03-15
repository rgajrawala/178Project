-- Reset tables
Delete Fixes;
Delete Uses;
Delete RepairJob;
Delete Finished_RepairJob;
Delete Car;
Delete Meteor_Customer;
Delete Mechanic;
Delete Part;
Delete Problem;

-- Set date check with select sysdate, dump(sysdate) as date_bytes from dual;
alter session set nls_date_format='YYYY-MM-DD HH24:MI:SS';

-- Meteor Customer
INSERT INTO Meteor_Customer (cust_phone, cust_name, cust_address)
	VALUES ('111-123-4567', 'Caleb', '1234 Lane Santa Clara, CA 95050');
INSERT INTO Meteor_Customer (cust_phone, cust_email, cust_name, cust_address)
	VALUES ('222-329-3918','carlo@gmail.com', 'Carlo', '1182 5th Ave. Santa Rosa, CA 95089');
INSERT INTO Meteor_Customer (cust_phone, cust_name, cust_address)
	VALUES ('333-123-4567', 'Andres', '1375 Pauline Dr. Sunnyvale, CA 94087');

-- Car
INSERT INTO Car (license_number, model, cust_phone)
	VALUES ('SDIE2KD', 'Toyota Tundra', '111-123-4567');
INSERT INTO Car (license_number, model, cust_phone)
	VALUES ('KDKA32Q', 'Tesla Model 3', '222-329-3918');
INSERT INTO Car (license_number, model, cust_phone)
	VALUES ('A23KDU4', 'Fiat Spider', '333-123-4567');

-- Mechanic
INSERT INTO Mechanic (mechanic_id, emp_phone, emp_name)
	VALUES ('e1', '123-235-6436', 'Billy');
INSERT INTO Mechanic (mechanic_id, emp_phone, emp_name)
	VALUES ('e2', '123-464-6436', 'Bob');
INSERT INTO Mechanic (mechanic_id, emp_phone, emp_name)
	VALUES ('e3', '154-235-6436', 'Joe');

-- Repair Job
INSERT INTO RepairJob (RepairJob_id,time_in, time_out, labor_hours, mechanic_id, license_number)
	VALUES ('r4', '2019-03-07 08:00:00', NULL, 10, 'e1', 'A23KDU4');
INSERT INTO RepairJob (RepairJob_id,time_in, time_out, labor_hours, mechanic_id, license_number)
	VALUES ('r3', '2019-03-08 12:00:00', NULL, 10, 'e2', 'KDKA32Q');

-- Finished Repair Job
INSERT INTO Finished_RepairJob (RepairJob_id,time_in, time_out, labor_hours, mechanic_id, license_number)
	VALUES ('r2', '2019-03-03 11:00:00', '2019-03-08 14:00:00', 8, 'e3', 'SDIE2KD');
INSERT INTO Finished_RepairJob (RepairJob_id,time_in, time_out, labor_hours, mechanic_id, license_number)
	VALUES ('r1', '2019-02-04 08:00:00', '2019-02-05 08:00:00', 11, 'e1', 'A23KDU4');

-- Part
INSERT INTO Part(part_name,cost) VALUES ('Tire', 100.00);
INSERT INTO Part(part_name,cost) VALUES ('Axle', 80.00);
INSERT INTO Part(part_name,cost) VALUES ('Window', 200.00);
INSERT INTO Part(part_name,cost) VALUES ('Paint Bucket', 20.00);

-- Problem
INSERT INTO Problem(problem_id, type) VALUES ('TI_AL_3', 'Tire Alignment Large');
INSERT INTO Problem(problem_id, type) VALUES ('TI_RP_1', 'Tire Replace Small');
INSERT INTO Problem(problem_id, type) VALUES ('EX_TO', 'Exterior Paint Touchup');
INSERT INTO Problem(problem_id, type) VALUES ('WH_RP_A', 'Wheel Replacement All');
INSERT INTO Problem(problem_id, type) VALUES ('WI_RP_1', 'Window Replacement All');

/* Create Relationship Tables */
-- Fixed
INSERT INTO Fixed (RepairJob_id, problem_id) VALUES ('r1', 'EX_TO');
INSERT INTO Fixed (RepairJob_id, problem_id) VALUES ('r1', 'TI_AL_3');
INSERT INTO Fixed (RepairJob_id, problem_id) VALUES ('r2', 'TI_RP_1');

-- Fixes
INSERT INTO Fixes (RepairJob_id, problem_id) VALUES ('r3', 'TI_AL_3');
INSERT INTO Fixes (RepairJob_id, problem_id) VALUES ('r4', 'WH_RP_A');

-- Used
INSERT INTO Used (RepairJob_id, part_name, qty) VALUES ('r1', 'Paint Bucket', 2);
INSERT INTO Used (RepairJob_id, part_name, qty) VALUES ('r2', 'Tire', 1);

-- Uses
INSERT INTO Uses (RepairJob_id, part_name, qty) VALUES ('r4', 'Tire', 4);
INSERT INTO Uses (RepairJob_id, part_name, qty) VALUES ('r4', 'Axle', 4);
