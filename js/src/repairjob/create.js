class RepairJobCreate extends React.Component {
	state = {
		custPhone: '',
		custEmail: '',
		custName: '',
		custAddress: '',

		licenseNumber: '',
		model: '',

		mechanicID: -1,
		repairJobID: '',

		mechanicIDs: [],
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
	}

	updateCustPhone = e => {
		this.setState({ custPhone: e.target.value });
	}

	updateCustEmail = e => {
		this.setState({ custEmail: e.target.value });
	}

	updateCustName = e => {
		this.setState({ custName: e.target.value });
	}

	updateCustAddress = e => {
		this.setState({ custAddress: e.target.value });
	}

	updateLicenseNumber = e => {
		this.setState({ licenseNumber: e.target.value });
	}

	updateModel = e => {
		this.setState({ model: e.target.value });
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
					<h3>Customer Information</h3>
					<div className="form-group">
						<label htmlFor="custPhone">Phone</label>
						<input type="tel" className="form-control" id="custPhone" placeholder="Enter customer phone" value={this.state.custPhone} onChange={this.updateCustPhone} />
						<small className="form-text text-muted">Enter the phone number of the customer associated with the car.</small>
					</div>
					<div className="form-group">
						<label htmlFor="custEmail">Email (Optional)</label>
						<input type="email" className="form-control" id="custEmail" placeholder="Enter customer email" value={this.state.custEmail} onChange={this.updateCustEmail} />
						<small className="form-text text-muted">Enter the email address of the customer associated with the car.</small>
					</div>
					<div className="form-group">
						<label htmlFor="custName">Name</label>
						<input type="text" className="form-control" id="custName" placeholder="Enter customer name" value={this.state.custName} onChange={this.updateCustName} />
						<small className="form-text text-muted">Enter the full name of the customer associated with the car.</small>
					</div>
					<div className="form-group">
						<label htmlFor="custAddress">Address</label>
						<textarea className="form-control" id="custAddress" placeholder="Enter customer address" value={this.state.custAddress} onChange={this.updateCustAddress} />
						<small className="form-text text-muted">Enter the full address of the customer associated with the car.</small>
					</div>

					<h3>Car Information</h3>
					<div className="form-group">
						<label htmlFor="licenseNumber">License Number</label>
						<input type="text" className="form-control" id="licenseNumber" placeholder="Enter license number" value={this.state.licenseNumber} onChange={this.updateLicenseNumber} />
						<small className="form-text text-muted">Enter the license number of the car that is being repaired.</small>
					</div>
					<div className="form-group">
						<label htmlFor="model">Model</label>
						<input type="text" className="form-control" id="model" placeholder="Enter car model" value={this.state.model} onChange={this.updateModel} />
						<small className="form-text text-muted">Enter the model of the car that is being repaired.</small>
					</div>

					<h3>Repair Job Information</h3>

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
