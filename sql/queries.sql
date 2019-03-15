create or replace procedure newRepairJob(
	p_repairjob_id in RepairJob.repairjob_id%type,
	p_time_in in RepairJob.time_in%type,
	p_employee_id in RepairJob.employee_id%type,

	p_model in Car.model%type) as
res INTEGER;
begin
	select count(*) into res from Car where license_number = p_license_number;
	if res = 0 then
		insert into Car values(p_license_number, p_model, p_cust_phone);
	end if;
	insert into RepairJob(repairjob_id, time_in, employee_id, license_number)
		values(p_repairjob_id, p_time_in, p_employee_id, p_license_number);
	select count(*) into res from Meteor_Customer where cust_phone = p_cust_phone;
	if res = 0 then
	 	insert into Meteor_Customer values(p_cust_phone, p_cust_email, p_cust_name, p_cust_address);
	 end if;
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
--test: exec updateRepairJob('r3', 15, '2019-03-20 08:00:00')

--repairjob must have been updated with remaining attributes
create or replace procedure finishRepairJob(p_repairjob_id in RepairJob.repairjob_id%type) is
begin
	delete from RepairJob where repairjob_id = p_repairjob_id;
end;
/
show errors;
--test: exec finishRepairJob('r3')


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
--------------use afer running finishRepairJob-------------------------

create or replace function getCustName(p_repairjob_id in RepairJob.repairjob_id%type)
return Meteor_Customer.cust_name%type
is
	res Meteor_Customer.cust_name%type;
	tmp_cust_phone Meteor_Customer.cust_phone%type;
begin
	select cust_phone into tmp_cust_phone from Car
	where license_number = (select license_number from Finished_RepairJob where repairjob_id = p_repairjob_id);
	select cust_name into res from Meteor_Customer where cust_phone = tmp_cust_phone;
	return res;
end;
/
show errors;
--test: select getCustName('r1') from dual;

create or replace function getPhone(p_repairjob_id in RepairJob.repairjob_id%type)
return Meteor_Customer.cust_phone%type
is
	res Meteor_Customer.cust_phone%type;
begin

	select cust_phone into res from Car where license_number = (select license_number from Finished_RepairJob where repairjob_id = p_repairjob_id);
	return res;
end;
/
show errors;
--test: select getPhone('r1') from dual;

create or replace function getAddress(p_repairjob_id in RepairJob.repairjob_id%type)
return Meteor_Customer.cust_address%type
is
	res Meteor_Customer.cust_address%type;
	tmp_cust_phone Meteor_Customer.cust_phone%type;
begin
	select cust_phone into tmp_cust_phone from Car
	where license_number = (select license_number from Finished_RepairJob where repairjob_id = p_repairjob_id);
	select cust_address into res from Meteor_Customer where cust_phone = tmp_cust_phone;
	return res;
end;
/
show errors;
--test: select getAddress('r1') from dual;

create or replace function getModel(p_repairjob_id in RepairJob.repairjob_id%type)
return Car.model%type
is
	res Car.model%type;
begin
	select model into res from Car where license_number = (select license_number from Finished_RepairJob where repairjob_id = p_repairjob_id);
	return res;
end;
/
show errors;
--test: select getModel('r1') from dual;

create or replace function getTimeIn(p_repairjob_id in RepairJob.repairjob_id%type)
return RepairJob.time_in%type
is
	res RepairJob.time_in%type;
begin
	select time_in into res from Finished_RepairJob where repairjob_id = p_repairjob_id;
	return res;
end;
/
show errors;
--test: select getTimeIn('r1') from dual;

create or replace function getTimeOut(p_repairjob_id in RepairJob.repairjob_id%type)
return RepairJob.time_out%type
is
	res RepairJob.time_out%type;
begin
	select time_out into res from Finished_RepairJob where repairjob_id = p_repairjob_id;
	return res;
end;
/
show errors;
--test: select getTimeOut('r1') from dual;

create or replace function getServiceCharge(p_repairjob_id in RepairJob.repairjob_id%type)
return NUMBER
is
	res NUMBER;
	hrly_rate Mechanic.hourly_pay_rate%type;
	labor_hrs RepairJob.labor_hours%type;
begin
	select hourly_pay_rate into hrly_rate from Mechanic
		where mechanic_id = (select mechanic_id from Finished_RepairJob where repairjob_id = p_repairjob_id);
	select labor_hours into labor_hrs from Finished_RepairJob where repairjob_id = p_repairjob_id;
	res := hrly_rate * labor_hrs;
	return res + 30;
end;
/
show errors;
--test: select getServiceCharge('r1') from dual;

create or replace function getsDiscount(p_cust_phone Meteor_Customer.cust_phone%type)
return INTEGER as
res INTEGER;
begin
	select count(*) into res from Finished_RepairJob where license_number in (select license_number from Car where cust_phone = p_cust_phone);
	if res > 1 then
		return 1;
	end if;
	return 0;
end;
/
show errors;

--only use for finished repairjobs
create or replace function getTotalCost(p_repairjob_id in RepairJob.repairjob_id%type)
return NUMBER
is
	cost_of_parts Part.cost%type;
	cost_of_labor NUMBER;
begin
	select sum(cost) into cost_of_parts from (Used NATURAL JOIN Part) where repairjob_id = p_repairjob_id;
	if cost_of_parts is null then
		cost_of_parts := 0;
	end if;
	cost_of_labor := getServiceCharge(p_repairjob_id);
	if getsDiscount(getPhone(p_repairjob_id)) = 1 then
		return (cost_of_labor + cost_of_parts) * 0.9;
	end if;
	return cost_of_labor + cost_of_parts;
end;
/
show errors;
--test: select gettotalcost('r1') from dual;


------------queries to be executed in PHP file for customer bill------------------

--get parts used and their costs
-- COLUMN cost FORMAT $99999.99
-- select part_name, cost from (Uses NATURAL JOIN Part) where repairjob_id = p_repairjob_id;

-- get problems
-- select problem_id, type from (Fixes NATURAL JOIN Problem) where repairjob_id = 'r3';

------------query for 1.3----------------------------------------------------------

-- get repair jobs between two dates
-- select * from Finished_RepairJob where time_out > to_timestamp('10-JAN-2019 08:00:00') and time_out < to_timestamp('20-MAR-2019 08:00:00')


create or replace function getMechanicWithMostHours
return Mechanic.mechanic_id%type
as
res Mechanic.mechanic_id%type;
begin
	select mechanic_id into res from
	(select mechanic_id, sum(labor_hours) as sum from Finished_RepairJob group by mechanic_id order by sum desc) where rownum = 1;
	return res;
end;
/
show errors;

create or replace function getMechanicWithLeastHours
return Mechanic.mechanic_id%type
as
res Mechanic.mechanic_id%type;
begin
	select mechanic_id into res from
	(select mechanic_id, sum(labor_hours) as sum from Finished_RepairJob group by mechanic_id order by sum asc) where rownum = 1;
	return res;
end;
/
show errors;

create or replace function getAverageHoursWorked
return NUMBER
as
res NUMBER;
begin
	select avg(sum) into res from (select sum(labor_hours) as sum from Finished_RepairJob group by mechanic_id order by sum asc);
	return res;
end;
/
show errors;

create or replace function getTotalRevenue(p_start RepairJob.time_out%type, p_finish RepairJob.time_out%type)
return NUMBER
as
res NUMBER;
Cursor repairjob_cursor is
	select * from Finished_RepairJob;
l_repairjob repairjob_cursor%rowtype;
begin
	res := 0;
	for l_repairjob in repairjob_cursor
	loop
		if l_repairjob.time_out > p_start and l_repairjob.time_out < p_finish then
			res := res + getTotalCost(l_repairjob.repairjob_id);
		end if;
	end loop;
	return res;
end;
/
show errors;
--test: select gettotalrevenue('2019-02-01 08:00:00','2019-03-27 08:00:00') from dual;

