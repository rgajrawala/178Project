function formatDate(date) {
	return (
		date.getFullYear() + '-' +
		(date.getMonth() + 1).toString().padStart(2, '0') + '-' +
		date.getDate().toString().padStart(2, '0')
	);
}

class RepairJobShow extends React.Component {
	state = {
		startDate: formatDate(new Date()),
		endDate: formatDate(new Date()),
		repairJobs: null,
	}

	search = e => {
		e.preventDefault();

		$.ajax({
			type: 'GET',
			url: 'api/report.php',
			data: {
				repairJobs: true,
				startDate: this.state.startDate,
				endDate: this.state.endDate
			},
			success: (data, textStatus, jqXHR) => {
				this.setState({
					repairJobs: data
				});
			},
			error: (jqXHR, textStatus, errorThrown) => {
				alert(errorThrown + ': ' + textStatus)
			}
		});
	}

	updateStartDate = e => {
		this.setState({
			startDate: e.target.value,
		});
	}

	updateEndDate = e => {
		this.setState({
			endDate: e.target.value,
		});
	}

	renderRepairJobs() {
		if (!this.state.repairJobs) {
			return null;
		}

		return this.state.repairJobs.length ?
			this.state.repairJobs.map(repairJob => (
				<div key={repairJob.REPAIRJOB_ID}>
					<hr />
					<b>ID: {repairJob.REPAIRJOB_ID}</b>
					<p>Mechanic: {repairJob.EMP_NAME} ({repairJob.MECHANIC_ID})</p>
					<p>Car Model: {repairJob.MODEL}</p>
					<p>Problems:</p>
					<ul>{
						repairJob.PROBLEMS.map(problem => (
							<li key={problem.PROBLEM_ID}>{problem.TYPE} ({problem.PROBLEM_ID})</li>
						))
					}</ul>
				</div>
			)) :
			<p>No results</p>;
	}

	render() {
		return (
			<div className="container">
				<h1>View Finished Repair Jobs</h1>
				<form>
					<div className="form-group">
						<label htmlFor="startDate">Start Date: &nbsp; </label>
						<input type="date" className="form-control form-control-inline" id="startDate" value={this.state.startDate} onChange={this.updateStartDate} />
						<br />
						<label htmlFor="endDate">End Date: &nbsp; </label>
						<input type="date" className="form-control form-control-inline" id="endDate" value={this.state.endDate} onChange={this.updateEndDate} />
					</div>

					<button type="submit" className="btn btn-primary" onClick={this.search}>Submit</button>
				</form>

				{this.renderRepairJobs()}
			</div>
		);
	}
}
