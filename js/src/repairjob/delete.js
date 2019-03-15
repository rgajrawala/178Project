class RepairJobDelete extends React.Component {
	state = {
		repairJob: null,
		repairJobID: -1,
		repairJobIDs: []
	}

	componentDidMount() {
		$.ajax({
			type: 'GET',
			url: 'api/repairjob.php',
			data: {
				finished: true
			},
			success: (data, textStatus, jqXHR) => {
				this.setState({
					repairJobIDs: data
				});
			},
			error: (jqXHR, textStatus, errorThrown) => {
				alert(errorThrown + ': ' + textStatus)
			}
		});
	}

	selectRepairJob = e => {
		if (e.target.value == -1) {
			this.setState({
				repairJobID: -1,
				repairJob: null
			});
		}

		this.setState({
			repairJobID: e.target.value
		}, () => {
			$.ajax({
				type: 'GET',
				url: 'api/bill.php',
				data: {
					repairJobID: this.state.repairJobID
				},
				success: (data, textStatus, jqXHR) => {
					this.setState({
						repairJob: data
					});
				},
				error: (jqXHR, textStatus, errorThrown) => {
					alert(errorThrown + ': ' + textStatus)
				}
			});
		});
	}

	renderRepairJobOptions() {
		return this.state.repairJobIDs.map(repairJobID => (
			<option key={repairJobID} value={repairJobID}>{repairJobID}</option>
		));
	}

	renderBill() {
		if (this.state.repairJobID == -1 || !this.state.repairJob) {
			return null;
		}

		const repairJob = this.state.repairJob;

		const parts = repairJob.PARTS.length ?
			repairJob.PARTS.map(part => (
				<li key={part.PART_NAME}>{part.PART_NAME} (${part.COST} x {part.QTY})</li>
			)) :
			<li>N/A</li>;

		const problems = repairJob.PROBLEMS.length ?
			repairJob.PROBLEMS.map(problem => (
				<li key={problem.PROBLEM_ID}>{problem.TYPE} ({problem.PROBLEM_ID})</li>
			)) :
			<li>N/A</li>;

		const hourlyCharge = 25;

		const totalPartsCost = repairJob.PARTS.reduce((sum, part) => (
			sum + (+part.COST * +part.QTY)
		), 0);

		return [
			<hr key={0} />,
			<div key={1}>
				<b>Customer information:</b>
				<p>Name: {repairJob.CUST_NAME}</p>
				<p>Phone: {repairJob.CUST_PHONE}</p>
				<p>Address: {repairJob.CUST_ADDRESS}</p>
				<br />
				<b>Car information:</b>
				<p>Model: {repairJob.MODEL}</p>
				<p>Time In: {repairJob.TIME_IN}</p>
				<p>Time Out: {repairJob.TIME_OUT}</p>
				<br />
				<b>Mechanic information:</b>
				<p>Name: {repairJob.MECHANIC.EMP_NAME}</p>
				<br />
				<b>Problems Fixed:</b>
				<ul>
					{problems}
				</ul>
				<br />
				<b>Parts Used:</b>
				<ul>
					{parts}
				</ul>
				<br />
				<p>Total Parts Cost: <b>${totalPartsCost}</b></p>
				<p>Labor Cost: {repairJob.LABOR_HOURS} hours x ${hourlyCharge}/hr = <b>${+repairJob.LABOR_HOURS * hourlyCharge}</b></p>
				<p>Service Charge: <b>${repairJob.SERVICE_CHARGE}</b> ($30 Service Fee + Labor Cost)</p>
				<p>10% Discount: <b>{repairJob.DISCOUNT === '0' ? 'No' : 'Yes'}</b></p>
				<p><u><b>Total Cost: ${repairJob.TOTAL_COST}</b></u> (Service Charge + Parts Cost - Discount)</p>
			</div>
		];
	}

	render() {
		return (
			<div className="container">
				<h1>View Repair Job Bill</h1>

				<form>
					<label>Repair Job ID: &nbsp; </label>
					<select className="form-control form-control-inline" value={this.state.repairJobID} onChange={this.selectRepairJob}>
						<option key={-1} value={-1}>Select...</option>
						{this.renderRepairJobOptions()}
					</select>

					{this.renderBill()}
				</form>
			</div>
		);
	}
}
