--queries

create or replace procedure newRepairJob(
	p_id in RepairJob.repairjob_id%type,
	p_time_in in RepairJob.time_in%type, 
	p_employee_id in RepairJob.employee_id%type, 
	p_license_number in RepairJob.license_number%type) is
begin
	 insert into RepairJob(repairjob_id, time_in, employee_id, license_number) values(p_id, p_time_in, p_employee_id, p_license_number);
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
	-- call generateCustomerBill()
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

-- create or replace procedure generateCustomerBill()
-- begin

-- end;
-- /
-- show errors;