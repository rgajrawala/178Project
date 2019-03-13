CREATE OR REPLACE TRIGGER DeleteRepairJob
	BEFORE DELETE ON RepairJob
	FOR EACH ROW
DECLARE
	-- Grab Fixes
	CURSOR problems_fixed_cur IS SELECT problem_id FROM Fixes WHERE repairjob_id = :old.repairjob_id;
	-- Grab Uses
	CURSOR parts_used_cur IS SELECT part_name, qty FROM Uses WHERE repairjob_id = :old.repairjob_id;
	t_pid Fixed.problem_id%TYPE;
	t_pname Used.part_name%TYPE;
	t_qty used.qty%type;
BEGIN
	INSERT INTO Finished_RepairJob (RepairJob_id,time_in, time_out, labor_hours, employee_id, license_number) VALUES (:old.RepairJob_id,:old.time_in, :old.time_out, :old.labor_hours, :old.employee_id, :old.license_number); 	
	-- Copy Fixed.	
	OPEN problems_fixed_cur;
	LOOP
	FETCH problems_fixed_cur into t_pid;
		EXIT WHEN problems_fixed_cur%notfound;
		INSERT INTO Fixed (RepairJob_id, problem_id) VALUES (:old.repairJob_id, t_pid);
		--dbms_output.put_line(t_pid);
	END LOOP;
	CLOSE problems_fixed_cur;
	-- Copy Uses into Used
	OPEN parts_used_cur;
	LOOP
	FETCH parts_used_cur into t_pname, t_qty;
		EXIT WHEN parts_used_cur%notfound;
		INSERT INTO Used (RepairJob_id, part_name, qty) VALUES (:old.repairJob_id, t_pname, t_qty);
		--dbms_output.put_line(t_pname);
	END LOOP;
	CLOSE parts_used_cur;
	-- Delete Fixes/Uses
	DELETE FROM Fixes where repairjob_id = :old.repairjob_id;
	DELETE FROM Uses where repairjob_id = :old.repairjob_id;
END;
/
Show errors; 
