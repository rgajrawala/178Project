class RepairJobCreate extends React.Component {
	state = {
		// customer
		contactInfo: '',
		custName: '',
		custAddress: '',

		// car
		licenseNumber: '',
		model: '',

		// repair job main
		mechanicID: '',
		repairJobID: ''
	}

	updateContactInfo = e => {
		this.setState({ contactInfo: e.target.value });
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

	updateCarModel = e => {
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

		return false;
	}

	render() {
		return (
			<div className="container">
				<h1>Create Repair Job</h1>

				<form>
					<h3>Customer Information</h3>
					<div className="form-group">
						<label htmlFor="contactInfo">Contact Info</label>
						<input type="tel" className="form-control" id="contactInfo" placeholder="Enter customer phone or email" value={this.state.contactInfo} onChange={this.updateContactInfo} />
						<small className="form-text text-muted">Enter the phone number or email address of the customer associated with the car.</small>

						<label htmlFor="custName">Name</label>
						<input type="text" className="form-control" id="custName" placeholder="Enter customer name" value={this.state.custName} onChange={this.updateCustName} />
						<small className="form-text text-muted">Enter the full name of the customer associated with the car.</small>

						<label htmlFor="custAddress">Address</label>
						<textarea className="form-control" id="custAddress" placeholder="Enter customer address" value={this.state.custAddress} onChange={this.updateCustAddress} />
						<small className="form-text text-muted">Enter the full address of the customer associated with the car.</small>
					</div>

					<h3>Car Information</h3>
					<div className="form-group">
						<label htmlFor="licenseNumber">License Number</label>
						<input type="text" className="form-control" id="licenseNumber" placeholder="Enter license number" value={this.state.licenseNumber} onChange={this.updateLicenseNumber} />
						<small className="form-text text-muted">Enter the license number of the car that is being repaired.</small>

						<label htmlFor="model">Model</label>
						<input type="text" className="form-control" id="model" placeholder="Enter car model" value={this.state.model} onChange={this.updateCarModel} />
						<small className="form-text text-muted">Enter the model of the car that is being repaired.</small>
					</div>

					<h3>Misc Information</h3>
					<div className="form-group">
						<label htmlFor="mechanicID">Mechanic ID</label>
						<input type="text" className="form-control" id="mechanicID" placeholder="Enter mechanic ID" value={this.state.mechanicID} onChange={this.updateMechanicID} />
						<small className="form-text text-muted">Enter the ID of the mechanic to assign to this repair job.</small>

						<label htmlFor="repairJobID">Repair Job ID</label>
						<input type="text" className="form-control" id="repairJobID" placeholder="Enter mechanic ID" value={this.state.repairJobID} onChange={this.updateRepairJobID} />
						<small className="form-text text-muted">Enter the ID of this repair job.</small>
					</div>

					<button type="submit" className="btn btn-primary" onClick={this.createRepairJob}>Submit</button>
				</form>
			</div>
		);
	}
}
