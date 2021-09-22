import React, {Component} from "react";
import "firebase/firestore";

import {auth} from "../auth";
import LandingMenu from "../LandingPage/LandingMenu";
import {Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle} from "@material-ui/core";
import Confetti from "react-confetti";
import {PositionContext} from "../../services/position-history";

class Register extends Component {
  static contextType = PositionContext;

  constructor() {
    super();
    this.state = {
      msg: "",
      dialogOpen: false,
    };
    this.handleClickRegisterUser = this.handleClickRegisterUser.bind(this);
    this.handleClose = this.handleClose.bind(this);

    this.setDialogRef = element => {
      this.setState({dialog: element});
    };
  }

  handleClickRegisterUser(e) {

    var re = /^(([^<>()\\.,;:\s@"]+(\.[^<>()\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    if (this.password.value.length > 6 && re.test(String(this.email.value).toLowerCase())) {

      localStorage.setItem("user", this.username.value);
      auth(this.email.value, this.password.value).then(()=> {
        this.context.position.update$(100000).subscribe(value => {
          this.setState({
            msg: "User Registered",
            dialogOpen: true
          })
        });
      });

    }
    if (this.password.value.length < 6) {
      alert("Password must have at least 6 characters");
    }
    if (re.test(String(this.email.value).toLowerCase()) === false) {
      alert("wrong email adress");
    }

  }



  handleClose(){
    this.props.history.push({
      pathname: '/dashboard',
    })
  }

  render() {

    return (
      <section className="limiter">
        <Dialog
            open={this.state.dialogOpen}
            onClose={this.handleClose}
        >
          <DialogTitle id="alert-dialog-title">Welcome!</DialogTitle>
          <DialogContent >

            <DialogContentText id="alert-dialog-description">
              You have been awarded SAR 100,000 of virtual money to trade!
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button variant="contained" onClick={this.handleClose} autoFocus>
              Start Trading!
            </Button>
          </DialogActions>
        </Dialog>

        <LandingMenu name="HOME" url="/" name2="LOGIN" url2="/login" />
        <div className="container-register" ref={this.setDialogRef}>
          {this.state.dialogOpen && <Confetti width={this.state.dialog.clientWidth} height={this.state.dialog.clientHeight + 100}/>}
          <div className="wrap-register">

            <form className="register-form validate-form">
              <span className="register-form-title">Register</span>

              <div className="wrap-input ">
                <input
                  className="input"
                  type="text"
                  name="username"
                  placeholder="Username"
                  required
                  ref={username => (this.username = username)}
                />
              </div>

              <div className="wrap-input ">
                <input
                  className="input"
                  type="text"
                  name="email"
                  placeholder="Email"
                  required
                  ref={email => (this.email = email)}
                />
              </div>

              <div className="wrap-input " data-validate="Password is required">
                <input
                  className="input"
                  type="password"
                  name="pass"
                  placeholder="Password"
                  required
                  ref={password => (this.password = password)}
                />
              </div>

              <div className="container-register-form-btn">
                <button
                  type="button"
                  className="register-form-btn"
                  onClick={event =>
                    this.handleClickRegisterUser(event, this.props.role)
                  }>
                  Register
                </button>
              </div>

              
              {this.state.msg !== "" ? (
                <h3 style={{color: "green"}}>{this.state.msg}</h3>
              ) : (
                <div />
              )}
            </form>
          </div>
        </div>
      </section>
    );
  }
}

export default Register;
