// Editing includes "completing" the job (aka generate customer bill)

class RepairJobEdit extends React.Component {
	state = {
		repairJobIDs: [],
		repairJobID: -1,
		repairJob: null,
		partNames: [],
		problems: [],
	}

	componentDidMount() {
		$.ajax({
			type: 'GET',
			url: 'api/repairjob.php',
			success: (data, textStatus, jqXHR) => {
				this.setState({
					repairJobIDs: data
				});
			},
			error: (jqXHR, textStatus, errorThrown) => {
				alert(errorThrown + ': ' + textStatus)
			}
		});

		$.ajax({
			type: 'GET',
			url: 'api/part.php',
			success: (data, textStatus, jqXHR) => {
				this.setState({
					partNames: data
				});
			},
			error: (jqXHR, textStatus, errorThrown) => {
				alert(errorThrown + ': ' + textStatus)
			}
		});

		$.ajax({
			type: 'GET',
			url: 'api/problem.php',
			success: (data, textStatus, jqXHR) => {
				this.setState({
					problems: data
				});
			},
			error: (jqXHR, textStatus, errorThrown) => {
				alert(errorThrown + ': ' + textStatus)
			}
		});
	}

	getRepairJob = e => {
		if (e.target.value == -1) {
			return this.setState({
				repairJobID: -1,
				repairJob: null
			});
		}

		this.setState({
			repairJobID: e.target.value
		}, () => {
			$.ajax({
				type: 'GET',
				url: 'api/repairjob.php',
				data: {
					repairJobID: this.state.repairJobID
				},
				success: (data, textStatus, jqXHR) => {
					this.setState({
						repairJob: data[0]
					});
				},
				error: (jqXHR, textStatus, errorThrown) => {
					alert(errorThrown + ': ' + textStatus)
				}
			});
		});
	}

	updateRepairJob = e => {
		e.preventDefault();

		$.ajax({
			type: 'PATCH',
			url: 'api/repairjob.php',
			data: this.state.repairJob,
			success: (data, textStatus, jqXHR) => {
				alert('Success!');
			},
			error: (jqXHR, textStatus, errorThrown) => {
				alert(errorThrown + ': ' + textStatus)
			}
		});
	}

	updateLaborHours = e => {
		this.setState({
			repairJob: {
				...this.state.repairJob,
				LABOR_HOURS: e.target.value
			}
		});
	}

	updatePartQuantity = e => {
		const partName = e.target.getAttribute('data-part-name');

		this.setState({
			repairJob: {
				...this.state.repairJob,
				PARTS: this.state.repairJob.PARTS.map(p => p.PART_NAME === partName ? {
					...p,
					QTY: e.target.value
				} : p)
			}
		});
	}

	addPart = e => {
		const partName = e.target.value;

		e.target.value = -1;

		if (this.state.repairJob.PARTS.find(p => p.PART_NAME === partName)) {
			return;
		}

		this.setState({
			repairJob: {
				...this.state.repairJob,
				PARTS: this.state.repairJob.PARTS.concat([{
					REPAIRJOB_ID: this.state.repairJob.REPAIRJOB_ID,
					PART_NAME: partName,
					QTY: 1
				}])
			}
		});
	}

	addProblem = e => {
		const problemID = e.target.value;

		e.target.value = -1;

		if (this.state.repairJob.PROBLEMS.find(p => p.PROBLEM_ID === problemID)) {
			return;
		}

		this.setState({
			repairJob: {
				...this.state.repairJob,
				PROBLEMS: this.state.repairJob.PROBLEMS.concat([{
					REPAIRJOB_ID: this.state.repairJob.REPAIRJOB_ID,
					PROBLEM_ID: problemID
				}])
			}
		});
	}

	removePart = e => {
		e.preventDefault();

		const partName = e.target.getAttribute('data-part-name');

		this.setState({
			repairJob: {
				...this.state.repairJob,
				PARTS: this.state.repairJob.PARTS.filter(p => p.PART_NAME !== partName)
			}
		});
	}

	removeProblem = e => {
		e.preventDefault();

		const problemID = e.target.getAttribute('data-problem-id');

		this.setState({
			repairJob: {
				...this.state.repairJob,
				PROBLEMS: this.state.repairJob.PROBLEMS.filter(p => p.PROBLEM_ID !== problemID)
			}
		});
	}

	finishRepairJob = e => {
		e.preventDefault();

		$.ajax({
			type: 'DELETE',
			url: 'api/repairjob.php',
			data: {
				repairJobID: this.state.repairJob.REPAIRJOB_ID
			},
			success: (data, textStatus, jqXHR) => {
				alert('Success!');
			},
			error: (jqXHR, textStatus, errorThrown) => {
				alert(errorThrown + ': ' + textStatus);
			}
		});
	}

	renderRepairJobOptions() {
		return this.state.repairJobIDs.map(id => (
			<option key={id} value={id}>{id}</option>
		));
	}

	renderProblems() {
		if (!this.state.repairJob.PROBLEMS.length) {
			return <p>N/A</p>;
		}

		return this.state.repairJob.PROBLEMS.map(problem => (
			<div key={problem.PROBLEM_ID}>
				<input type="text" className="form-control form-control-inline" value={problem.PROBLEM_ID} disabled={true} />
				&nbsp;
				<button className="btn btn-danger" data-problem-id={problem.PROBLEM_ID} onClick={this.removeProblem}>Remove</button>
			</div>
		));
	}

	renderParts() {
		if (!this.state.repairJob.PARTS.length) {
			return <p>N/A</p>;
		}

		return this.state.repairJob.PARTS.map(part => (
			<div key={part.PART_NAME}>
				<input type="text" className="form-control form-control-inline" value={part.PART_NAME} disabled={true} />
				&nbsp;
				<input type="number" min="0" className="form-control form-control-inline" value={part.QTY} data-part-name={part.PART_NAME} onChange={this.updatePartQuantity} />
				&nbsp;
				<button className="btn btn-danger" data-part-name={part.PART_NAME} onClick={this.removePart}>Remove</button>
			</div>
		));
	}

	renderPartOptions() {
		return this.state.partNames.map(partName => (
			<option value={partName}>{partName}</option>
		));
	}

	renderProblemOptions() {
		return this.state.problems.map(problem => (
			<option value={problem.PROBLEM_ID}>{problem.TYPE} ({problem.PROBLEM_ID})</option>
		));
	}

	renderRepairJob() {
		if (!this.state.repairJob) {
			return null;
		}

		return [
			<hr key={-100} />,
			<div key={-3} className="form-group">
				<label htmlFor="mechanicID">Mechanic ID</label>
				<input type="text" className="form-control" id="mechanicID" value={this.state.repairJob.MECHANIC_ID} disabled={true} />
			</div>,
			<div key={-2} className="form-group">
				<label htmlFor="licenseNumber">License Number</label>
				<input type="text" className="form-control" id="licenseNumber" value={this.state.repairJob.LICENSE_NUMBER} disabled={true} />
			</div>,
			<div key={-1} className="form-group">
				<label htmlFor="laborHours">Labor Hours</label>
				<input type="number" className="form-control" min="0" id="laborHours" value={this.state.repairJob.LABOR_HOURS} onChange={this.updateLaborHours} />
			</div>,
			<div key={2} className="form-group">
				<label>Parts</label>
				{this.renderParts()}
				<br />
				<label htmlFor="partSelect">Add Part: &nbsp; </label>
				<select className="form-control form-control-inline" id="partSelect" onChange={this.addPart}>
					<option key={-1} value={-1}>Select...</option>
					{this.renderPartOptions()}
				</select>
			</div>,
			<div key={1} className="form-group">
				<label>Problems</label>
				{this.renderProblems()}
				<br />
				<label htmlFor="problemSelect">Add Problem: &nbsp; </label>
				<select className="form-control form-control-inline" id="problemSelect" onChange={this.addProblem}>
					<option key={-1} value={-1}>Select...</option>
					{this.renderProblemOptions()}
				</select>
			</div>,
			<button key={3} type="submit" className="btn btn-primary" onClick={this.updateRepairJob}>Submit</button>,
			" ",
			<button key={4} className="btn btn-success" onClick={this.finishRepairJob}>Finish</button>,
		];
	}

	render() {
		return (
			<div className="container">
				<h1>Edit Repair Job</h1>
				<form>
					<div className="form-group">
						<label htmlFor="repairJobOption">Select a repair job to view/edit:</label>
						<select className="form-control" id="repairJobOption" onChange={this.getRepairJob} value={this.state.repairJobID}>
							<option key={-1} value={-1}>Select...</option>
							{this.renderRepairJobOptions()}
						</select>
					</div>

					{this.renderRepairJob()}
				</form>
			</div>
		);
	}
}
