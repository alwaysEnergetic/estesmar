import React from "react";
import {getAuth} from 'firebase/auth';

import {relDiff} from "../helpers.js";
import Loader from "../Elements/Loader";
import {Divider, Grid, List, ListItem, Typography} from "@material-ui/core";
import {PortfolioChart} from "./portfolio-chart";
import {PortfolioTable} from "./portfolio-table";
import Button from "@material-ui/core/Button";
import BoxPaper from "../Elements/BoxPaper";
import {PositionContext} from "../../services/position-history";
import {mergeMap, take} from "rxjs/operators";
import {formatNumber} from "../../services/formatter";


let difference = [],
  moneyPaid = [],
  symbols = [],
  color = [],
  shares = [],
  value = [],
  change = [],
  position = [],
  stockNames = [];

export default class portfolio extends React.Component {
  static contextType = PositionContext;

  _isMounted = false;
  constructor(props) {
    super(props);
    this.state = {
      loader1: "",
      confirmation: "",
      funds: "",
      marketStatus: true,
      error: "",
      bulkLoading: true,
      totalStocksValue: 0
    };
    this.handleStockSell = this.handleStockSell.bind(this);
  }

  getApiContext(){
    return this.context.position.api;
  }

  processBulkQuotes(data){

    for(let result of data) {
      let ai = [];
      for (let j in symbols) {
        if (result.symbol === symbols[j]) {
          ai.push(j);
        }
      }

      for (let i of ai) {
        stockNames[i] = result.longName;
        let latestPrice = result.regularMarketPrice.toFixed(2);

        value[parseInt(i)] = Number(shares[parseInt(i)] * latestPrice).toFixed(2);

        difference[parseInt(i)] = relDiff(parseFloat(value[parseInt(i)]), parseFloat(moneyPaid[parseInt(i)])).toFixed(2);

        change[parseInt(i)] = parseFloat(value[parseInt(i)] - parseFloat(moneyPaid[parseInt(i)])).toFixed(2);

        if (value[parseInt(i)] >= moneyPaid[parseInt(i)]) {
          difference[parseInt(i)] = `+${difference[parseInt(i)]}`;
          color[parseInt(i)] = "#66F9DA";
        } else if (value[parseInt(i)] === moneyPaid[parseInt(i)]) {
          color[parseInt(i)] = "#999EAF";
        } else {
          difference[parseInt(i)] = `-${difference[parseInt(i)]}`;
          color[parseInt(i)] = "#F45385";
        }
        if (difference[parseInt(i)].includes("NaN")) {
          difference[parseInt(i)] = "---";
          color[parseInt(i)] = "#999EAF";
        }
        if (change[parseInt(i)].split("")[1] === "-") {
          let name = "" + change[parseInt(i)];
          change[parseInt(i)] = `-${name.substr(2)}`;
        }
      }
    }
  }

  /*
   * gets users opened positions
   */
  getPositions(v) {

    symbols = [];
    position = [];
    shares = [];
    moneyPaid = [];
    value = [];

    this.context.position.loadStocks$().subscribe(snapshot => {
      if (snapshot.docs.length !== 0) {
        snapshot.forEach(doc => {
          position.push(doc.id);
          symbols.push(doc.data().symbol);
          shares.push(doc.data().shares);
          moneyPaid.push(doc.data().moneyPaid);
        });

        this.processBulkQuotes(v.data);

        this.setState({
          loader1: true,
          totalStocksValue: v.sum
        });
      } else {
        this.setState({
            loader1: "nothing",
          });
      }
    });

  }

  /*
   * closes position
   * @param {position} name of position
   * @param {number} index of 'value' array
   */
  handleStockSell(position, number) {
    let val = Number(this.state.funds) + Number(value[parseInt(number)]);

    this.context.position.sell$(position, val).pipe(
        mergeMap(r => this.context.position.recordPosition$()),
        take(1)
    ).subscribe(v => {
        this.getPositions(v);
    });
  }

  componentDidMount() {
    this._isMounted = true;
    if(!this.props.bodyOnly) document.title = `${this.props.title} - Portfolio`;

    this.context.position.getTotalValue$().subscribe(v => {
      this.getPositions(v);
    });

    this.context.position.getCurrentFunds$().subscribe(value => {
      this.setState({
        funds: value,
      });
    });

  }

  componentWillUnmount() {
    this._isMounted = false;
  }

  getBody(){

    if(this.state.loader1 === "") return <Loader />;

    return (
        symbols.length > 0
            ? <PortfolioTable symbols={symbols}
                               names={stockNames}
                               shares={shares}
                               color={color}
                               difference={difference}
                               change={change}
                               value={value}
                               handleStockSell={this.handleStockSell}
                               position={position}
                               compact={this.props.bodyOnly}
            />
          : <Typography>You haven't bought any stocks yet</Typography>
    );
  }

  render() {
    let totalStocksValue = this.state.totalStocksValue;
    let totalValue = totalStocksValue + parseFloat(this.state.funds);

    return this.props.bodyOnly ? this.getBody() : (
      <>
        {this.state.error === true && (
          <div className="alertMessage">
            Market is currently closed{" "}
            <button
              style={{margin: "20px"}}
              className="stockPage__buy-button"
              onClick={() => {
                if (this._isMounted) {
                  this.setState({
                    error: false,
                  });
                }
              }}>
              CONFIRM
            </button>
          </div>
        )}

        {this.state.loader1 === "" && <Loader />}

        {this.state.loader1 === true &&
          <Grid container alignItems={"flex-start"} direction={"column"} spacing={1} alignItems={"stretch"}>

            <Grid item container spacing={1} alignItems={"flex-end"}>

              <Grid item md={6} sm={6} xs={12}>
                <Typography variant={"h6"}>Total portfolio value</Typography>
                <BoxPaper transparent={true}>
                    <List>
                      <ListItem>
                        <Grid container>
                          <Grid item xs={3}>Stocks</Grid>
                          <Grid item xs>{(totalStocksValue*100/totalValue).toFixed(2)}%</Grid>
                          <Grid item xs>SAR {formatNumber(totalStocksValue.toFixed(2))}</Grid>
                        </Grid>
                      </ListItem>
                      <Divider/>
                      <ListItem>
                        <Grid container>
                          <Grid item xs={3}>Cash</Grid>
                          <Grid item xs>{(parseFloat(this.state.funds)*100/totalValue).toFixed(2)}%</Grid>
                          <Grid item xs>SAR {formatNumber(parseFloat(this.state.funds).toFixed(2))}</Grid>
                        </Grid>
                      </ListItem>
                    </List>
                </BoxPaper>
              </Grid>

              <Grid item md={3} sm={6} xs={12}>
                <BoxPaper transparent={true}>
                    <PortfolioChart cash={this.state.funds} stocks={totalStocksValue} />
                </BoxPaper>
              </Grid>

            </Grid>

            <Grid item md={9}>
              <Typography variant={"h6"}>Stocks</Typography>
              <BoxPaper transparent={true} p={0}>
                  {this.getBody()}
              </BoxPaper>
            </Grid>
          </Grid>
        }

        {this.state.loader1 === "nothing" && (
            <BoxPaper transparent={true}>
              <Typography>You haven't bought any stocks yet</Typography>
            </BoxPaper>
        )}
      </>
    );
  }
}
