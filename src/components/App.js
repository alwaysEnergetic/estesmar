import React, {Component} from "react";
import {firebaseAuth} from "./auth";
import {BrowserRouter as Router, Redirect, Route, Switch} from "react-router-dom";


import LandingPage from "./LandingPage/landingPage";
import Dashboard from "./Dashboard/Dashboard";
import Register from "./Login&Register/Register";
import Login from "./Login&Register/Login";
import stockPage from "./SymbolPage/stockPage";
import portfolio from "./Portfolio/portfolio";
import page404 from "./404";
import Loader from "./Elements/Loader";
import Watchlist from "./WatchList/watchlist";
import Password from "./Elements/password";
import {ApiProvider} from "../services/rapidapi";
import {SymbolCacheProvider} from "../services/symbol-cache";
import {Sector} from "./SectorPage/Sector";
import {QueryClient, QueryClientProvider} from "react-query";
import {createMuiTheme, CssBaseline, MuiThemeProvider} from "@material-ui/core";
import {PositionProvider} from "../services/position-history";
import Layout from "./Elements/Layout";

let title = "DAWEL";

function PrivateRoute({ component: Component, authed, ...rest }) {
  return (
    <Route
      {...rest}
      render={props =>
        authed === true ? (
            <Layout {...props} {...rest}>
              <Component {...props} {...rest} title={title} key={Date.now()}/>
            </Layout>
        ) : (
          <Redirect
            to={{ pathname: "/login", state: { from: props.location } }}
          />
        )
      }
    />
  );
}

function PublicRoute({ component: Component, authed, ...rest }) {

  return (
    <Route
      {...rest}
      render={props =>
        true || authed === false ? (
          <div className="container">
            <Component {...props}  />
          </div>
        ) : (
          <Redirect to="/Dashboard" />
        )
      }
    />
  );
}

class App extends Component {
  _isMounted = false;
  state = {
    authed: false,
    loading: true,
    theme: "",
  };

  componentDidMount() {
    this._isMounted = true;


    let theme = localStorage.getItem("theme");
    if (
      window.location.href.split("/")[
        window.location.href.split("/").length - 1
      ] !== ""
    ) {
      if (theme !== null) {
        this.setState({
          theme
        });
      } else {
        this.setState({
          theme: "light"
        });
      }
    }


    this.removeListener = firebaseAuth().onAuthStateChanged(user => {
      if (this._isMounted) {
        if (user) {
          this.setState({
            authed: true,
            loading: false
          });
        } else {
          this.setState({
            authed: false,
            loading: false
          });
        }
      }
    });
  }

  componentWillUnmount() {
    this._isMounted = false;
    this.removeListener();
  }

  setTheme(theme){
    this.setState({theme: theme});
  }


  render() {
    const queryClient = new QueryClient();

    const themeColors = {
      palette: {
        success: {
          main: '#4caf50'
        },
        error: {
          main: '#ff3d00'
        }
      }
    }

    const lightTheme = createMuiTheme({...themeColors, ...{
      palette: {
        type: 'light',
      },
    }});

    const darkTheme = createMuiTheme({...themeColors, ...{
      palette: {
        type: 'dark',
      },
    }});

    if (this.state.theme === "light") {
      localStorage.setItem("theme", "light");
      document.getElementById("root").classList.add("light");
    }
    if (this.state.theme === "dark") {
      localStorage.setItem("theme", "dark");
      document.getElementById("root").classList.remove("light");
    }

    const theme = this.state.theme === "dark" ? darkTheme : lightTheme;

    return this.state.loading ? (
      <div className="loader-background">
        <Loader />
      </div>
    ) : (
        <MuiThemeProvider theme={theme}>
          <QueryClientProvider client={queryClient}>
            <ApiProvider queryClient={queryClient}><SymbolCacheProvider><PositionProvider>
              <CssBaseline />
                <Router>
                  <Switch>
                    <Route exact path="/" component={LandingPage} />
                    <PublicRoute
                      authed={this.state.authed}
                      path="/register"
                      component={Register}
                    />
                    <PublicRoute
                      authed={this.state.authed}
                      path="/login"
                      component={Login}
                    />
                    <PublicRoute
                      authed={this.state.authed}
                      path="/forgot"
                      component={Password}
                    />

                    <PrivateRoute
                      authed={this.state.authed}
                      path="/dashboard"
                      component={Dashboard}
                      setTheme={this.setTheme.bind(this)}
                    />
                    <PrivateRoute
                      authed={this.state.authed}
                      path="/portfolio"
                      component={portfolio}
                      setTheme={this.setTheme.bind(this)}
                    />
                    <PrivateRoute
                      authed={this.state.authed}
                      path="/watchlist"
                      component={Watchlist}
                      setTheme={this.setTheme.bind(this)}
                    />
                    <PrivateRoute
                      name="stocks"
                      authed={this.state.authed}
                      path="/stocks/:symbol"
                      component={stockPage}
                      setTheme={this.setTheme.bind(this)}
                      symbol={window.location.pathname.split("/")[2]}
                    />
                    <PrivateRoute
                        name="sectors"
                        authed={this.state.authed}
                        path="/sectors/:sector"
                        component={Sector}
                        setTheme={this.setTheme.bind(this)}
                        sector={window.location.pathname.split("/")[2]}
                    />
                    <Route component={page404} />
                  </Switch>
              </Router>
            </PositionProvider></SymbolCacheProvider></ApiProvider>
          </QueryClientProvider>
        </MuiThemeProvider>
    );
  }
}

export default App;
