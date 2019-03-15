class Index extends React.Component {
	state = {
		currentPage: window.location.hash.slice(1) || 'home'
	}

	onNavClick = e => {
		this.setState({
			currentPage: e.target.getAttribute('href').slice(1)
		});
	}

	renderBody() {
		switch (this.state.currentPage) {
			case 'home':
				return <Home />;
			case 'admin':
				return <Admin />;
			case 'repairjob-create':
				return <RepairJobCreate />;
			case 'repairjob-edit':
				return <RepairJobEdit />;
			case 'repairjob-delete':
				return <RepairJobDelete />;
			case 'repairjob-show':
				return <RepairJobShow />;
			case 'mechanic-show':
				return <MechanicShow />;
			case 'revenue-show':
				return <RevenueShow />;
			default:
				return null;
		}
	}

	render() {
		return (
			<div>
				<nav className="navbar navbar-expand-lg navbar-light bg-light">
					<a className="navbar-brand" href="#">Meteor Car Dealership</a>
					<button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarSupportedContent">
						<span className="navbar-toggler-icon"></span>
					</button>

					<div className="collapse navbar-collapse" id="navbarSupportedContent">
						<ul className="navbar-nav mr-auto">
							<li className={`nav-item ${this.state.currentPage === 'home' ? 'active' : ''}`}>
								<a className="nav-link" href="#home" onClick={this.onNavClick}>Home</a>
							</li>
							<li className="nav-item dropdown">
								<a className="nav-link dropdown-toggle" href="#" id="navbarDropdown" role="button" data-toggle="dropdown">
									Menu
								</a>
								<div className="dropdown-menu">
									<a className={`dropdown-item ${this.state.currentPage === 'admin' ? 'active' : ''}`} href="#admin" onClick={this.onNavClick}>Show Admin Page</a>
									<div className="dropdown-divider"></div>
									<a className={`dropdown-item ${this.state.currentPage === 'repairjob-create' ? 'active' : ''}`} href="#repairjob-create" onClick={this.onNavClick}>Create Repair Job</a>
									<a className={`dropdown-item ${this.state.currentPage === 'repairjob-edit' ? 'active' : ''}`} href="#repairjob-edit" onClick={this.onNavClick}>Edit Repair Job</a>
									<a className={`dropdown-item ${this.state.currentPage === 'repairjob-delete' ? 'active' : ''}`} href="#repairjob-delete" onClick={this.onNavClick}>View Repair Job Bill</a>
									<div className="dropdown-divider"></div>
									<a className={`dropdown-item ${this.state.currentPage === 'repairjob-show' ? 'active' : ''}`} href="#repairjob-show" onClick={this.onNavClick}>Show Completed Repair Jobs</a>
									<a className={`dropdown-item ${this.state.currentPage === 'mechanic-show' ? 'active' : ''}`} href="#mechanic-show" onClick={this.onNavClick}>Show Mechanic Information</a>
									<a className={`dropdown-item ${this.state.currentPage === 'revenue-show' ? 'active' : ''}`} href="#revenue-show" onClick={this.onNavClick}>Show Revenue Information</a>
								</div>
							</li>
						</ul>
					</div>
				</nav>

				<br />

				{this.renderBody()}
			</div>
		);
	}
}

ReactDOM.render(
	<Index />,
	$('#container').get(0)
)
