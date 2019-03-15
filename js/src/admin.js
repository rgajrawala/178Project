class Admin extends React.Component {
	state = {
		// customer
		custEmail: '',
		custPhone: '',
		custName: '',
		custAddress: '',

		// car
		licenseNumber: '',
		model: '',

		// mechanic
		mechanicID: '',
		hourlyPayRate: '',

		// part
		partCost: '',

		// problem
		problemType: '',

		customerPhones: [],
	}

	componentDidMount() {
		$.ajax({
			type: 'GET',
			url: 'api/customer.php',
			success: (data, textStatus, jqXHR) => {
				this.setState({
					customerPhones: data
				});
			},
			error: (jqXHR, textStatus, errorThrown) => {
				alert(errorThrown + ': ' + textStatus)
			}
		});
	}

	updateCustEmail = e => {
		this.setState({ custEmail: e.target.value });
	}

	updateCustPhone = e => {
		this.setState({ custPhone: e.target.value });
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

	updateHourlyPayRate = e => {
		this.setState({ hourlyPayRate: e.target.value });
	}

	updatePartCost = e => {
		this.setState({ partCost: e.target.value });
	}

	updateProblemType = e => {
		this.setState({ problemType: e.target.value });
	}

	createCustomer = e => {
		e.preventDefault();

		$.ajax({
			type: 'POST',
			url: 'api/customer.php',
			data: {
				custPhone: this.state.custPhone,
				custEmail: this.state.custEmail,
				custName: this.state.custName,
				custAddress: this.state.custAddress
			},
			success: () => {
				alert('Success!');

				this.setState({
					custPhone: '',
					custEmail: '',
					custName: '',
					custAddress: ''
				});
			},
			error: (jqXHR, textStatus, errorThrown) => {
				alert(errorThrown + ': ' + textStatus)
			}
		});
	}

	createCar = e => {
		e.preventDefault();

		$.ajax({
			type: 'POST',
			url: 'api/car.php',
			data: {
				custPhone: this.state.custPhone,
				// custEmail: this.state.custEmail,
				licenseNumber: this.state.licenseNumber,
				model: this.state.model
			},
			success: () => {
				alert('Success!');

				this.setState({
					// custEmail: '',
					custPhone: '',
					licenseNumber: '',
					model: ''
				});
			},
			error: (jqXHR, textStatus, errorThrown) => {
				alert(errorThrown + ': ' + textStatus)
			}
		});
	}

	createMechanic = e => {
		e.preventDefault();

		$.ajax({
			type: 'POST',
			url: 'api/mechanic.php',
			data: {
				mechanicID: this.state.mechanicID,
				empPhone: this.state.custPhone,
				empName: this.state.custName,
				hourlyPayRate: this.state.hourlyPayRate
			},
			success: () => {
				alert('Success!');

				this.setState({
					mechanicID: '',
					custPhone: '',
					custName: '',
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
			url: 'api/customer.php',
			data: {
				partName: this.state.custName,
				partCost: this.state.partCost
			},
			success: () => {
				alert('Success!');

				this.setState({
					custName: '',
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
			url: 'api/customer.php',
			data: {
				problemID: this.state.mechanicID,
				problemType: this.state.problemType
			},
			success: () => {
				alert('Success!');

				this.setState({
					mechanicID: '',
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
					<h3>Create Customer</h3>
					<div className="form-group">
						<label htmlFor="custPhone">Phone</label>
						<input type="tel" className="form-control" id="custPhone" placeholder="Enter customer phone" value={this.state.custPhone} onChange={this.updateCustPhone} />
						<small className="form-text text-muted">Enter the phone number of the customer associated with the car.</small>
					</div>
					<div className="form-group">
						<label htmlFor="custEmail">Email</label>
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

					<button type="submit" className="btn btn-primary" onClick={this.createCustomer}>Submit</button>
				</form>

				<form>
					<h3>Create Car</h3>
					<div className="form-group">
						<label htmlFor="custPhone">Customer Phone</label>
						<input type="tel" className="form-control" id="custPhone" placeholder="Enter customer phone" value={this.state.custPhone} onChange={this.updateCustPhone} />
						<small className="form-text text-muted">Enter the phone number of the customer associated with the car.</small>
					</div>
					{/*<div className="form-group">
						<label htmlFor="custEmail">Customer Email</label>
						<input type="email" className="form-control" id="custEmail" placeholder="Enter customer email" value={this.state.custEmail} onChange={this.updateCustEmail} />
						<small className="form-text text-muted">Enter the email address of the customer associated with the car.</small>
					</div>*/}
					<div className="form-group">
						<label htmlFor="licenseNumber">License Number</label>
						<input type="text" className="form-control" id="licenseNumber" placeholder="Enter license number" value={this.state.licenseNumber} onChange={this.updateLicenseNumber} />
						<small className="form-text text-muted">Enter the license number of the car that is being repaired.</small>
					</div>
					<div className="form-group">
						<label htmlFor="model">Model</label>
						<input type="text" className="form-control" id="model" placeholder="Enter car model" value={this.state.model} onChange={this.updateCarModel} />
						<small className="form-text text-muted">Enter the model of the car that is being repaired.</small>
					</div>

					<button type="submit" className="btn btn-primary" onClick={this.createCar}>Submit</button>
				</form>

				<form>
					<h3>Create Mechanic</h3>
					<div className="form-group">
						<label htmlFor="mechanicID">Mechanic ID</label>
						<input type="text" className="form-control" id="mechanicID" placeholder="Enter mechanic ID" value={this.state.mechanicID} onChange={this.updateMechanicID} />
						<small className="form-text text-muted">Enter the ID of the mechanic to assign to this repair job.</small>
					</div>

					<button type="submit" className="btn btn-primary" onClick={this.createMechanic}>Submit</button>
				</form>

				<form>
					<h3>Create Part</h3>
					<div className="form-group">
						<label htmlFor="mechanicID">Mechanic ID</label>
						<input type="text" className="form-control" id="mechanicID" placeholder="Enter mechanic ID" value={this.state.mechanicID} onChange={this.updateMechanicID} />
						<small className="form-text text-muted">Enter the ID of the mechanic to assign to this repair job.</small>
					</div>

					<button type="submit" className="btn btn-primary" onClick={this.createPart}>Submit</button>
				</form>

				<form>
					<h3>Create Problem</h3>
					<div className="form-group">
						<label htmlFor="mechanicID">Mechanic ID</label>
						<input type="text" className="form-control" id="mechanicID" placeholder="Enter mechanic ID" value={this.state.mechanicID} onChange={this.updateMechanicID} />
						<small className="form-text text-muted">Enter the ID of the mechanic to assign to this repair job.</small>
					</div>

					<button type="submit" className="btn btn-primary" onClick={this.createProblem}>Submit</button>
				</form>
			</div>
		);
	}
}
