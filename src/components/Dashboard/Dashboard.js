import React from "react";
import {getFirestore} from 'firebase/firestore';
import {relDiff} from "../helpers.js";
import {DashboardSectors} from "./dashboard-sectors";
import {Box, Card, CardContent, CardHeader, Grid} from "@material-ui/core";
import {DashboardChart} from "./dashboard-chart";
import Watchlist from "../WatchList/watchlist";
import Portfolio from "../Portfolio/portfolio";
import {PositionContext} from "../../services/position-history";
import {DashboardNews} from "./dashboard-news";
import {DashboardCard} from "./dashboard-card";
import withWidth from '@material-ui/core/withWidth';

const db = getFirestore();



let portfolioStocks = [],
	portfolioShares = [],
	portfolioValue = [],
	portfolioDifference = [],
	portfolioColor = [],
	portfolioMoneyPaid = [];


class Dashboard extends React.Component {
	static contextType = PositionContext;

	_isMounted = false;
	constructor(props) {
		super(props);
		this.state = {
			loader1: "",
			loader2: "",
			loader3: "",
			portfolioLoader: "",
			fundsWithoutCommas: "",
			accountValue: "",
			marketStatus: "",
			theme: "",
		};
		this.componentDidMount = this.componentDidMount.bind(this);
		this.getAccountInfo = this.getAccountInfo.bind(this);
		this.getWatchlist = this.getWatchlist.bind(this);
		this.portfolio = React.createRef();
		this.chartFirst = React.createRef();
		this.chartSecond = React.createRef();
	}


	getApiContext(){
		return this.context.position.api;
	}


	/*
	 * fetches market price for portfolio stocks and pushes to portfolio arrays difference
	 * @param {symbol} name of stock as symbol
	 * @param {i} index in array
	 */
	getLatestPrice(symbol, i) {

		this.getApiContext().api.getQuoteSummary$(symbol).subscribe(value => {
			let result = value.result[0];
			let latestPrice = result.price.regularMarketPrice.raw.toFixed(2);
			portfolioValue[parseInt(i)] = parseFloat(
				Number(
					portfolioShares[parseInt(i)] * latestPrice
				).toFixed(2)
			);
			portfolioDifference[parseInt(i)] =
				relDiff(
					parseFloat(portfolioValue[parseInt(i)]),
					parseFloat(portfolioMoneyPaid[parseInt(i)])
				).toFixed(2) + "%";
			if (
				portfolioValue[parseInt(i)] >
				portfolioMoneyPaid[parseInt(i)]
			) {
				portfolioDifference[parseInt(i)] =
					"+" + portfolioDifference[parseInt(i)];
				portfolioColor[parseInt(i)] = "#66F9DA";
			} else if (
				portfolioValue[parseInt(i)] ===
				portfolioMoneyPaid[parseInt(i)]
			) {
				portfolioColor[parseInt(i)] = "#999EAF";
			} else {
				portfolioDifference[parseInt(i)] =
					"-" + portfolioDifference[parseInt(i)];
				portfolioColor[parseInt(i)] = "#F45385";
			}
			if (portfolioDifference[parseInt(i)].includes("NaN")) {
				portfolioDifference[parseInt(i)] = "---";
				portfolioColor[parseInt(i)] = "#999EAF";
			}
		});


	}


	getAccountInfo() {

	}

	getWatchlist(){

	}
	

	componentDidMount() {
		this._isMounted = true;
		this.context.position.getCache$().subscribe(doc => {
			if (typeof doc.data() !== "undefined") {
				this.setState({
					fundsWithoutCommas: doc.data().currentfunds,
				});
			}
		});
		document.title = this.props.title + " - Dashboard";
	}

	componentWillUnmount() {
		this._isMounted = false;
	}

	render() {
		return (
			!/xs/.test(this.props.width) ?

			<Grid container spacing={1}>

				<Grid item md={6} sm={6} container direction={"column"} spacing={1}>

					<Grid item>
						<DashboardChart/>
					</Grid>

					<Grid item>
						<DashboardSectors/>
					</Grid>

					<Grid item>
						<DashboardNews/>
					</Grid>

				</Grid>

				<Grid item md={3} sm={6} container direction={"column"} spacing={1}>

					<Grid item style={{position: 'sticky', top: '64px'}}>
						<DashboardCard title="Stocks">
							<Portfolio bodyOnly={true}/>
						</DashboardCard>
					</Grid>

					<Grid item style={{position: 'sticky', top: '472px'}}>
						<DashboardCard title="Watchlist">
							<Watchlist bodyOnly={true}/>
						</DashboardCard>
					</Grid>

				</Grid>
			</Grid>

		: <Grid container spacing={1} direction={"column"} >

			<Grid item>
				<DashboardChart/>
			</Grid>

			<Grid item>
				<DashboardCard title="Stocks">
					<Portfolio bodyOnly={true}/>
				</DashboardCard>
			</Grid>

			<Grid item>
				<DashboardCard title="Watchlist">
					<Watchlist bodyOnly={true}/>
				</DashboardCard>
			</Grid>

			<Grid item>
				<DashboardSectors/>
			</Grid>

			<Grid item>
				<DashboardNews/>
			</Grid>

		</Grid>
		);
	}
}

export default withWidth()(Dashboard);
