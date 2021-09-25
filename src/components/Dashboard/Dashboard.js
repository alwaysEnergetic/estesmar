import React from "react";
import {getFirestore} from 'firebase/firestore';
import {relDiff} from "../helpers.js";
import {DashboardSectors} from "./dashboard-sectors";
import {Box, Card, CardContent, CardHeader, Grid, makeStyles} from "@material-ui/core";
import {DashboardChart} from "./dashboard-chart";
import Watchlist from "../WatchList/watchlist";
import Portfolio from "../Portfolio/portfolio";
import {PositionContext} from "../../services/position-history";
import {DashboardNews} from "./dashboard-news";
import {DashboardCard} from "./dashboard-card";
import withWidth from '@material-ui/core/withWidth';
import { ClassSharp, FullscreenExit } from "@material-ui/icons";
import { withStyles } from "@material-ui/styles";
import {useTheme} from "@material-ui/core"
import {useState, useEffect, useContext} from 'react';

const styles = theme => ({
	position: {
		display: "flex",
		justifyContent: "flex-start"
	},
	title: {
	  color: "#8C6F46",
	  fontSize: 45,
	  marginLeft: 139,
	  fontWeight: 400,
	  fontFamily: "cursive",
	},
	companyDesc: {
		fontSize: 26,
		marginTop: 203,
	},
	features: {
		borderRadius: 12,
		padding:16,
		backgroundColor: "#006400",
		fontSize: 27,
		color: "#D1D1D6",
		margin: "60px 0 60px 0",
		width: "100%",
	},
	item: {
		display: "flex",
		justifyContent: "center"
	},
	itemElement: {
		fontSize: 20,
		padding: 12,
		marginLeft: 12,
		border: "1px solid #8C6F46",
		borderRadius: 12,
	},
	itemElementICT: {
		fontSize: 20,
		padding: "12px 45px",
		marginLeft: 12,
		border: "1px solid #8C6F46",
		borderRadius: 12,
	},
	companyDescCenter: {
		display: "flex",
		justifyContent: "center"
	},
	companyTextCenter: {
		display: "flex",
		justifyContent: "center"
	}
  });
  
const db = getFirestore();
let portfolioStocks = [],
	portfolioShares = [],
	portfolioValue = [],
	portfolioDifference = [],
	portfolioColor = [],
	portfolioMoneyPaid = [];

const Dashboard = (props) => {
	

//const [themeMode, setThemeMode] = useState(theme.palette.type);

	const context = useContext(PositionContext);

	let _isMounted = false;
		const [loader1, setLoader1] = useState('') ;
		const [loader2, setLoader2] = useState('') ;
		const [loader3, setLoader3] = useState('') ;
		const [portfolioLoader, setPortfolioLoader] = useState('') ;
		const [fundsWithoutCommas, setFundsWithoutCommas] = useState('') ;
		const [accountValue, setAccountValue] = useState('') ;
		const [marketStatus, setMarketStatus] = useState('') ;
		const [theme, setTheme] = useState('');

		// this.componentDidMount = this.componentDidMount.bind(this);
		// this.getAccountInfo = this.getAccountInfo.bind(this);
		// this.getWatchlist = this.getWatchlist.bind(this);
		
		const portfolio = React.createRef();
		const chartFirst = React.createRef();
		const chartSecond = React.createRef();
		console.log(props)
		//console.log(theme.palette.type);

	function getApiContext(){
		return context.position.api;
	}

	/*
	 * fetches market price for portfolio stocks and pushes to portfolio arrays difference
	 * @param {symbol} name of stock as symbol
	 * @param {i} index in array
	 */
	function getLatestPrice(symbol, i) {

		getApiContext().api.getQuoteSummary$(symbol).subscribe(value => {
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


const getAccountInfo = () => {

}

const getWatchlist = () => {

}

	useEffect(()=> {
		_isMounted = true;
		context.position.getCache$().subscribe(doc => {
			if (typeof doc.data() !== "undefined") {
				setFundsWithoutCommas(doc.data().currentfunds);
			}
		});
		document.title = props.title + " - Dashboard";
	}, [context]);

	useEffect(()=> {
		_isMounted = false;
	},[]);

		const { classes } = props;
		return (
			// !/xs/.test(this.props.width) ?
			<div>
				<div>
					<div>
						<span  className = {classes.title}>Public </span>
					</div>
					<div>
						<span  className = {classes.title}> investment fund </span>
					</div>
				</div>
				<div className={classes.companyTextCenter}>
					<p className={classes.companyDesc}>Use the search bar to access PIF portfolio companies financial data and benchmark companies</p>
				</div>
				<div className={classes.companyDescCenter}>
					<div className={classes.companyTextCenter}>
						<p className={classes.features}>Type the company's name, i.e. SABIC, NCB, CIB or search for sectors </p>
					</div>
				</div>
				<div className={classes.item}>
					<p className={classes.itemElement} >Mining </p>
					<p className={classes.itemElement}>Finanacial services</p>
					<p className={classes.itemElementICT}>ICT </p>
					<p className={classes.itemElement}>Food & Agriculture </p>
				</div>
			</div>
		);
	}

export default withStyles(styles) (Dashboard);




