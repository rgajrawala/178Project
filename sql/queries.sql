--queries

create or replace procedure newRepairJob(
	p_repairjob_id in RepairJob.repairjob_id%type,
	p_time_in in RepairJob.time_in%type, 
	p_employee_id in RepairJob.employee_id%type, 

	p_contact_info in Meteor_Customer.contact_info%type,
	p_cust_name in Meteor_Customer.cust_name%type,
	p_cust_address in Meteor_Customer.cust_address%type,

	p_license_number in Car.license_number%type,
	p_model in Car.model%type) is
begin
	 insert into RepairJob(repairjob_id, time_in, employee_id, license_number) 
	 	values(p_repairjob_id, p_time_in, p_employee_id, p_license_number);
	 insert into Car values(p_license_number, p_model, p_contact_info);
	 insert into Meteor_Customer values(p_contact_info, p_cust_name, p_cust_address);
end;
/
show errors;
--test: exec newRepairJob('r5','2019-03-09 08:00:00','e3', 'A23KDU4')

create or replace procedure updateRepairJob(
	p_repairjob_id in RepairJob.repairjob_id%type,
	p_labor_hours in RepairJob.labor_hours%type, 
	p_time_out in RepairJob.time_out%type) is
begin
	update RepairJob set labor_hours = p_labor_hours, time_out = p_time_out where repairjob_id = p_repairjob_id;
end;
/
show errors;
--test: exec finishRepairJob('r3', 12, '2019-03-10 08:00:00')

--repairjob must have been updated
create or replace procedure finishRepairJob(p_repairjob_id in RepairJob.repairjob_id%type) is
begin
	delete from RepairJob where repairjob_id = p_repairjob_id;
end;
/
show errors;

create or replace procedure createProblem(p_problem_id in Problem.problem_id%type,
	p_problem_type in Problem.type%type) as
begin
	insert into Problem values(p_problem_id, p_problem_type);
end;
/
show errors;

--problem must exist
create or replace procedure linkProblem(p_repairjob_id in RepairJob.repairjob_id%type, 
	p_problem_id in Problem.problem_id%type) is
begin
	insert into Fixes values(p_repairjob_id, p_problem_id);
end;
/
show errors;
--test: exec linkProblem('r3', 'TI_AL_3')

create or replace procedure createPart(p_part_name in Part.part_name%type, p_cost in Part.cost%type) is
begin
	insert into Part values(p_part_name, p_cost);
end;
/
show errors;

--part must exist
create or replace procedure linkPart(
	p_repairjob_id in RepairJob.repairjob_id%type, 
	p_part_name in Part.part_name%type, 
	p_qty in Uses.qty%type) is
begin
	insert into Uses values(p_repairjob_id, p_part_name, p_qty);
end;
/
show errors;
--test: exec linkPart('r3', 'Tire', 2)

--------------functions for generating customer bill-------------------
--------------use afer updating, before running finishRepairJob--------

create or replace function getCustName(p_repairjob_id in RepairJob.repairjob_id%type)
return Meteor_Customer.cust_name%type
is
	res Meteor_Customer.cust_name%type;
	tmp_contact_info Meteor_Customer.contact_info%type;
begin
	select contact_info into tmp_contact_info from Car
	where license_number = (select license_number from RepairJob where repairjob_id = p_repairjob_id);
	select cust_name into res from Meteor_Customer where contact_info = tmp_contact_info;
	return res;
end;
/
show errors;
--test: select getCustName('r3') from dual;

create or replace function getContactInfo(p_repairjob_id in RepairJob.repairjob_id%type)
return Meteor_Customer.contact_info%type
is
	res Meteor_Customer.contact_info%type;
begin

	select contact_info into res from Car where license_number = (select license_number from RepairJob where repairjob_id = p_repairjob_id);
	return res;
end;
/
show errors;
--test: select getContactInfo('r3') from dual;

create or replace function getAddress(p_repairjob_id in RepairJob.repairjob_id%type)
return Meteor_Customer.cust_address%type
is
	res Meteor_Customer.cust_address%type;
	tmp_contact_info Meteor_Customer.contact_info%type;
begin
	select contact_info into tmp_contact_info from Car
	where license_number = (select license_number from RepairJob where repairjob_id = p_repairjob_id);
	select cust_address into res from Meteor_Customer where contact_info = tmp_contact_info;
	return res;
end;
/
show errors;
--test: select getAddress('r3') from dual;

create or replace function getModel(p_repairjob_id in RepairJob.repairjob_id%type)
return Car.model%type
is
	res Car.model%type;
begin
	select model into res from Car where license_number = (select license_number from RepairJob where repairjob_id = p_repairjob_id);
	return res;
end;
/
show errors;
--test: select getModel('r3') from dual;

create or replace function getTimeIn(p_repairjob_id in RepairJob.repairjob_id%type)
return RepairJob.time_in%type
is
	res RepairJob.time_in%type;
begin
	select time_in into res from RepairJob where repairjob_id = p_repairjob_id;
	return res;
end;
/
show errors;
--test: select getTimeIn('r3') from dual;

create or replace function getTimeOut(p_repairjob_id in RepairJob.repairjob_id%type)
return RepairJob.time_out%type
is
	res RepairJob.time_out%type;
begin
	select time_out into res from RepairJob where repairjob_id = p_repairjob_id;
	return res;
end;
/
show errors;
--test: select getTimeOut('r3') from dual;

create or replace function getServiceCharge(p_repairjob_id in RepairJob.repairjob_id%type)
return NUMBER 
is 
	res NUMBER;
	hrly_rate Mechanic.hourly_pay_rate%type;
	labor_hrs RepairJob.labor_hours%type;
begin
	select hourly_pay_rate into hrly_rate from Mechanic
		where employee_id = (select employee_id from RepairJob where repairjob_id = p_repairjob_id);
	select labor_hours into labor_hrs from RepairJob where repairjob_id = p_repairjob_id;
	res := hrly_rate * labor_hrs;
	return res;
end;
/
show errors;
--test: exec updateRepairJob('r3', 10, '2019-03-20 08:00:00')
--select getServiceCharge('r3') from dual;

create or replace function GetTotalCost(p_repairjob_id in RepairJob.repairjob_id%type)
return NUMBER
is
	cost_of_parts Part.cost%type;
	cost_of_labor NUMBER;
begin
	select sum(cost) into cost_of_parts from (Uses NATURAL JOIN Part) where repairjob_id = p_repairjob_id;
	cost_of_labor := getServiceCharge(p_repairjob_id);
	return cost_of_labor + cost_of_parts;
end;
/
show errors;
--test: select gettotalcost('r4') from dual;


------------queries to be executed in PHP file for customer bill------------------

--get parts used and their costs
-- COLUMN cost FORMAT $99999.99
-- select part_name, cost from (Uses NATURAL JOIN Part) where repairjob_id = p_repairjob_id;

--get problems
-- select problem_id, type from (Fixes NATURAL JOIN Problem) where repairjob_id = 'r3';

-- --get problems (if above function doesn't work)
-- select problem_id, type from (Fixes NATURAL JOIN Problem) where repairjob_id = p_repairjob_id;