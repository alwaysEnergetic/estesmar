import React from "react";
import {getAuth} from 'firebase/auth';
import {arrayRemove} from 'firebase/firestore';

import Loader from "../Elements/Loader";
import {Grid, Typography} from "@material-ui/core";
import {PortfolioTable} from "../Portfolio/portfolio-table";
import Button from "@material-ui/core/Button";
import BoxPaper from "../Elements/BoxPaper";
import {PositionContext} from "../../services/position-history";


let color = [],
  value = [],
  change = [],
  stockName = [],
  watchlist=[];

export default class portfolio extends React.Component {
  static contextType = PositionContext;

  _isMounted = false;
  constructor(props) {
    super(props);
    this.state = {
      loader1: "",
      confirmation: "",
      funds: "",
      marketStatus: "",
      error: "",
      bulkLoading: true
    };
    this.handleWatchlist = this.handleWatchlist.bind(this);
  }

  getApiContext(){
    console.log(this.context.position.api);
    return this.context.position.api;
  }

  /*
   * gets users bookmarked tickers
   */
  getWatchlist(){
    if (this._isMounted) {
      this.setState({
        loader1: "",
      });
    }
    this.context.position.getCache$().subscribe(doc => {
      if(!doc.data()) return;
      watchlist = doc.data().watchlist;
      this.prepareBulkQuery();

      if(watchlist.length === 0){
        if(this._isMounted){
          this.setState({
            loader1:"nothing"
          });
        }
      } else{
        if (this._isMounted) {
          this.setState({
            loader1: true,
          });
        }
      }
    });

  }

  handleWatchlist(symbol){

    this.context.position.updateWatchlist({
      watchlist: arrayRemove(symbol)
    });

    var index = watchlist.indexOf(symbol);

    if (index !== -1) {
        watchlist.splice(index, 1);
        stockName.splice(index,1);
        color.splice(index,1);
        change.splice(index,1);
    }
    if(this._isMounted && watchlist.length === 0){
      this.setState({
        loader1:"nothing"
      });
    }else {
      this.setState({
        loader1:true
      });
    }
  }

  prepareBulkQuery(){
    let limit = 10;
    const getSymbolsToQuery = () => {
      return watchlist.filter((collection, index) => index >= this.getItemCount() && index < this.getItemCount() + limit);
    };

    const showFetch = () => {
      return this.state.newItems && this.state.newItems.length > 0 && this.state.newItems.length < watchlist.length;
    }

    this.obs = this.getApiContext().api.getFetchBulkQuotesQuery$(getSymbolsToQuery(), {
      refetchOnWindowFocus: false,
      enabled: false,
      getNextPageParam: (lastPage, pages) => {
        
        return getSymbolsToQuery()
      }
    }, 'watchlist');

    this.obs.subscribe(rq => {
      console.log("----123123-----", rq);
      if(rq.data) {
        let newItems = [];
        rq.data.pages && rq.data.pages.forEach((value) => {
          newItems = newItems.concat(value.result)
        });
        // this.processBulkQuotes(newItems);
      }
    });
    this.fetchMore();
  }

  componentDidMount() {
    this._isMounted = true;
    if(!this.props.bodyOnly) document.title = `${this.props.title} - Watchlist`;

    this.getWatchlist();
  }

  componentWillUnmount() {
    this._isMounted = false;
  }

  processBulkQuotes(data){
    for(let result of data){
      let i = 0;
      for(let j in watchlist){
        if(result.symbol == watchlist[j]){
          i = j;
          break;
        }
      }

      value[i] = result.regularMarketPrice.toFixed(2);
      change[i] = parseFloat(result.regularMarketChangePercent).toFixed(2);
      stockName[i] = result.longName;

      if(Math.sign(change[parseInt(i)]) === 1){
        color[i] = "rgb(102,249,218)";
        change[parseInt(i)] = "+"+change[parseInt(i)];
      } else {
        color[i] = "#F45385";
      }
    }
    Promise.resolve(null).then(()=>this.setState({bulkLoading: false, newItems: data}));
  }

  getItemCount(){
    return this.state.newItems ? this.state.newItems.length : 0;
  }

  fetchMore(){
    this.obs.fetchNextPage();
  }

  showFetch(){
    return this.getItemCount() < watchlist.length;
  }

  getBody(){
    if(this.state.loader1 === "") return <Loader />;

    return (
        watchlist.length > 0
          ? <>
              <PortfolioTable symbols={watchlist.filter((v,i) => i < this.getItemCount())}
                              names={stockName}
                              color={color}
                              difference={change}
                              value={value}
                              handleWatchlist={this.handleWatchlist}
                              compact={this.props.bodyOnly}
              />
              {this.showFetch() && <Button variant="contained" color="primary"  onClick={() => this.fetchMore()}>Fetch more</Button>}
          </>
          : <Typography>You haven’t bookmarked any stocks yet</Typography>
    );
  }

  render() {
    return this.props.bodyOnly ? this.getBody() : (
        <Grid container>
          <Grid item md={9} xs={12}>
            <BoxPaper transparent={true} p={0}>
                {this.getBody()}
            </BoxPaper>
          </Grid>
        </Grid>
    );
  }
}
