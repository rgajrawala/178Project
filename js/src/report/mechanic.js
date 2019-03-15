class MechanicShow extends React.Component {
	state = {
		mechanicInfo: null
	}

	componentDidMount() {
		$.ajax({
			type: 'GET',
			url: 'api/report.php',
			data: {
				mechanics: true
			},
			success: (data, textStatus, jqXHR) => {
				this.setState({
					mechanicInfo: data
				});
			},
			error: (jqXHR, textStatus, errorThrown) => {
				alert(errorThrown + ': ' + textStatus)
			}
		});
	}

	renderMechanicStats() {
		const mechanicInfo = this.state.mechanicInfo;

		if (!mechanicInfo) {
			return <i>Loading...</i>;
		}

		return (
			<div>
				<p><b>Hardest-Working Mechanic:</b> {mechanicInfo.mostHours.EMP_NAME} ({mechanicInfo.mostHours.MECHANIC_ID})</p>
				<p><b>Laziest Mechanic:</b> {mechanicInfo.leastHours.EMP_NAME} ({mechanicInfo.leastHours.MECHANIC_ID})</p>
				<p><b>Average Mechanic Hours:</b> {mechanicInfo.totalAvgHours}</p>
				<ul>{
					mechanicInfo.avgHours.map(avgHours => (
						<li key={avgHours.MECHANIC_ID}><b>ID:</b> {avgHours.MECHANIC_ID}, <b>Average Hours:</b> {avgHours['AVG(LABOR_HOURS)']}</li>
					))
				}</ul>
			</div>
		);
	}

	render() {
		return (
			<div className="container">
				<h1>Show Mechanic Stats</h1>

				{this.renderMechanicStats()}
			</div>
		);
	}
}
