class RepairJobCreate extends React.Component {
	state = {
		repairJobID: '',
		licenseNumber: -1,
		mechanicID: -1,

		mechanicIDs: [],
		licenseNumbers: []
	}

	componentDidMount() {
		$.ajax({
			type: 'GET',
			url: 'api/mechanic.php',
			success: (data, textStatus, jqXHR) => {
				this.setState({
					mechanicIDs: data
				});
			},
			error: (jqXHR, textStatus, errorThrown) => {
				alert(errorThrown + ': ' + textStatus)
			}
		});

		$.ajax({
			type: 'GET',
			url: 'api/car.php',
			success: (data, textStatus, jqXHR) => {
				this.setState({
					licenseNumbers: data
				});
			},
			error: (jqXHR, textStatus, errorThrown) => {
				alert(errorThrown + ': ' + textStatus)
			}
		});
	}

	updateLicenseNumber = e => {
		this.setState({ licenseNumber: e.target.value });
	}

	updateMechanicID = e => {
		this.setState({ mechanicID: e.target.value });
	}

	updateRepairJobID = e => {
		this.setState({ repairJobID: e.target.value });
	}

	createRepairJob = e => {
		e.preventDefault();

		$.ajax({
			type: 'POST',
			url: 'api/repairjob.php',
			data: this.state,
			success: () => {
				alert('Success!');
			},
			error: (jqXHR, textStatus, errorThrown) => {
				alert(errorThrown + ': ' + textStatus)
			}
		});
	}

	renderLicenseOptions() {
		return this.state.licenseNumbers.map(licenseNumber => (
			<option key={licenseNumber} value={licenseNumber}>{licenseNumber}</option>
		));
	}

	renderMechanicOptions() {
		return this.state.mechanicIDs.map(mechanicID => (
			<option key={mechanicID} value={mechanicID}>{mechanicID}</option>
		));
	}

	render() {
		return (
			<div className="container">
				<h1>Create Repair Job</h1>

				<form>
					<div className="form-group">
						<label htmlFor="licenseNumber">License Number</label>
						<select className="form-control" id="licenseNumber" value={this.state.licenseNumber} onChange={this.updateLicenseNumber}>
							<option key={-1} value={-1}>Select...</option>
							{this.renderLicenseOptions()}
						</select>
						<small className="form-text text-muted">Select the license number of the car that is being repaired.</small>
					</div>
					<div className="form-group">
						<label htmlFor="mechanicID">Mechanic ID</label>
						<select className="form-control" id="mechanicID" value={this.state.mechanicID} onChange={this.updateMechanicID}>
							<option key={-1} value={-1}>Select...</option>
							{this.renderMechanicOptions()}
						</select>
						<small className="form-text text-muted">Select the ID of the mechanic to assign to this repair job.</small>
					</div>
					<div className="form-group">
						<label htmlFor="repairJobID">Repair Job ID</label>
						<input type="text" className="form-control" id="repairJobID" placeholder="Enter repair job ID" value={this.state.repairJobID} onChange={this.updateRepairJobID} />
						<small className="form-text text-muted">Enter the ID of this repair job.</small>
					</div>

					<button type="submit" className="btn btn-primary" onClick={this.createRepairJob}>Submit</button>
				</form>
			</div>
		);
	}
}
