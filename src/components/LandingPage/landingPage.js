import React from "react";

import LandingMenu from "./LandingMenu";
import land from "../../images/land.png";
import animation from "../../images/41383-digital-finance-animation.json";
import Lottie from "lottie-react";
import {Box, Container, Grid, Paper, Typography} from "@material-ui/core";
import BoxPaper from "../Elements/BoxPaper";

const LandingPage = () => (
	/*<Container style={{backgroundColor: '#ffffff'}}>*/
	<main>
		<LandingMenu
			name="LOGIN"
			url="/login"
			name2="REGISTER"
			url2="/register"
		/>

		<div className="splash-container">
			<div className="buffer" />
			<section className="splash-section-1">
				<div className="section-1-text">
					<header>Invest Your Way</header>
					<div className="subtext">
						At Dawel, we work to give you the tools you need to build your future.
					</div>

					<div className="filler" />
				</div>
				<div className="section-1-image" />
			</section>
			<section className="splash-section-2">
				<div className="section-2-header">
					100% Commission Free Trading
				</div>
				<div className="section-2-text">
					There are no commissions because all of the money used here at
					Dawel is <span>fake</span>. As a signup bonus, we grant you
					SAR 100,000 of our fake money for <span>free</span> so that you can
					practice for the real thing.
				</div>
			</section>
			<div className="test"></div>

		</div>

		{/*<Grid container direction={"column"} alignItems={"center"} spacing={1}>
			<Grid item md={6}>
				<BoxPaper>
					<Typography>
						Welcome to Dawel, a powerful, easy, and fun virtual stock market game. You start off with SAR 100,000 in virtual cash and can place unlimited trades. Our beautiful design and simplicity helps users learn the stock market, monitor their stocks, and test trading strategies.
					</Typography>
				</BoxPaper>
			</Grid>
			<Grid item md={6}>
				<Lottie animationData={animation} />
			</Grid>
		</Grid>*/}

	{/*</Container>*/}
	</main>
);
export default LandingPage;
