class Admin extends React.Component {
	state = {
		// mechanic
		mechanicID: '',
		empPhone: '',
		empName: '',
		hourlyPayRate: '',

		// part
		partName: '',
		partCost: '',

		// problem
		problemID: '',
		problemType: ''
	}

	updateMechanicID = e => {
		this.setState({ mechanicID: e.target.value });
	}

	updateEmpPhone = e => {
		this.setState({ empPhone: e.target.value });
	}

	updateEmpName = e => {
		this.setState({ empName: e.target.value });
	}

	updateHourlyPayRate = e => {
		this.setState({ hourlyPayRate: e.target.value });
	}

	updatePartName = e => {
		this.setState({ partName: e.target.value });
	}

	updatePartCost = e => {
		this.setState({ partCost: e.target.value });
	}

	updateProblemID = e => {
		this.setState({ problemID: e.target.value });
	}

	updateProblemType = e => {
		this.setState({ problemType: e.target.value });
	}

	createMechanic = e => {
		e.preventDefault();

		$.ajax({
			type: 'POST',
			url: 'api/mechanic.php',
			data: {
				mechanicID: this.state.mechanicID,
				empPhone: this.state.empPhone,
				empName: this.state.empName,
				hourlyPayRate: this.state.hourlyPayRate
			},
			success: () => {
				alert('Success!');

				this.setState({
					mechanicID: '',
					empPhone: '',
					empName: '',
					hourlyPayRate: ''
				});
			},
			error: (jqXHR, textStatus, errorThrown) => {
				alert(errorThrown + ': ' + textStatus)
			}
		});
	}

	createPart = e => {
		e.preventDefault();

		$.ajax({
			type: 'POST',
			url: 'api/part.php',
			data: {
				partName: this.state.partName,
				partCost: this.state.partCost
			},
			success: () => {
				alert('Success!');

				this.setState({
					partName: '',
					partCost: ''
				});
			},
			error: (jqXHR, textStatus, errorThrown) => {
				alert(errorThrown + ': ' + textStatus)
			}
		});
	}

	createProblem = e => {
		e.preventDefault();

		$.ajax({
			type: 'POST',
			url: 'api/problem.php',
			data: {
				problemID: this.state.problemID,
				problemType: this.state.problemType
			},
			success: () => {
				alert('Success!');

				this.setState({
					problemID: '',
					problemType: ''
				});
			},
			error: (jqXHR, textStatus, errorThrown) => {
				alert(errorThrown + ': ' + textStatus)
			}
		});
	}

	render() {
		return (
			<div className="container">
				<h1>Admin Page</h1>

				<form>
					<h3>Create Mechanic</h3>
					<div className="form-group">
						<label htmlFor="mechanicID">Mechanic ID</label>
						<input type="text" className="form-control" id="mechanicID" placeholder="Enter mechanic ID" value={this.state.mechanicID} onChange={this.updateMechanicID} />
						<small className="form-text text-muted">Enter the ID of the mechanic.</small>
					</div>
					<div className="form-group">
						<label htmlFor="empPhone">Mechanic Phone</label>
						<input type="tel" className="form-control" id="empPhone" placeholder="Enter mechanic phone" value={this.state.empPhone} onChange={this.updateEmpPhone} />
						<small className="form-text text-muted">Enter the phone number of the mechanic.</small>
					</div>
					<div className="form-group">
						<label htmlFor="empName">Mechanic Name</label>
						<input type="text" className="form-control" id="empName" placeholder="Enter mechanic name" value={this.state.empName} onChange={this.updateEmpName} />
						<small className="form-text text-muted">Enter the name of the mechanic.</small>
					</div>
					<div className="form-group">
						<label htmlFor="hourlyPayRate">Hourly Pay Rate</label>
						<input type="number" min="10" className="form-control" id="hourlyPayRate" placeholder="Enter mechanic hourly pay rate" value={this.state.hourlyPayRate} onChange={this.updateHourlyPayRate} />
						<small className="form-text text-muted">Enter the hourly pay rate of the mechanic.</small>
					</div>

					<button type="submit" className="btn btn-primary" onClick={this.createMechanic}>Submit</button>
				</form>

				<br />
				<br />

				<form>
					<h3>Create Part</h3>

					<div className="form-group">
						<label htmlFor="partName">Part Name</label>
						<input type="text" className="form-control" id="partName" placeholder="Enter part name" value={this.state.partName} onChange={this.updatePartName} />
						<small className="form-text text-muted">Enter the name of the part.</small>
					</div>
					<div className="form-group">
						<label htmlFor="partCost">Part Cost</label>
						<input type="number" min="0" className="form-control" id="partCost" placeholder="Enter part cost" value={this.state.partCost} onChange={this.updatePartCost} />
						<small className="form-text text-muted">Enter the cost of the part.</small>
					</div>

					<button type="submit" className="btn btn-primary" onClick={this.createPart}>Submit</button>
				</form>

				<br />
				<br />

				<form>
					<h3>Create Problem</h3>
					<div className="form-group">
						<label htmlFor="problemID">Problem ID</label>
						<input type="text" className="form-control" id="problemID" placeholder="Enter problem ID" value={this.state.problemID} onChange={this.updateProblemID} />
						<small className="form-text text-muted">Enter the ID of the problem.</small>
					</div>
					<div className="form-group">
						<label htmlFor="problemType">Problem Type</label>
						<input type="text" className="form-control" id="problemType" placeholder="Enter problem type" value={this.state.problemType} onChange={this.updateProblemType} />
						<small className="form-text text-muted">Enter the type of the problem.</small>
					</div>

					<button type="submit" className="btn btn-primary" onClick={this.createProblem}>Submit</button>
				</form>
			</div>
		);
	}
}
