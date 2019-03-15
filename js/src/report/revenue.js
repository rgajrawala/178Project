function formatDate(date) {
	return (
		date.getFullYear() + '-' +
		(date.getMonth() + 1).toString().padStart(2, '0') + '-' +
		date.getDate().toString().padStart(2, '0')
	);
}

class RevenueShow extends React.Component {
	state = {
		startDate: formatDate(new Date()),
		endDate: formatDate(new Date()),
		revenueInfo: null,
	}

	search = e => {
		e.preventDefault();

		$.ajax({
			type: 'GET',
			url: 'api/report.php',
			data: {
				revenue: true,
				startDate: this.state.startDate,
				endDate: this.state.endDate
			},
			success: (data, textStatus, jqXHR) => {
				this.setState({
					revenueInfo: data
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

	renderRevenueStats() {
		if (this.state.revenueInfo === null) {
			return null;
		}

		return (
			<div>
				<br />
				<p><b>Total Revenue:</b> ${this.state.revenueInfo}</p>
			</div>
		);
	}

	render() {
		return (
			<div className="container">
				<h1>View Revenue Stats</h1>
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

				{this.renderRevenueStats()}
			</div>
		);
	}
}
