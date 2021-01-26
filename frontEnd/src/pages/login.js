import React from 'react';
import { Link, useHistory } from "react-router-dom";
import { MailConfirmM } from '../components/mailConfirmModal';
import {myCookies} from '../App'

import Logo from "../assets/logo.png"

const classNames = require("classnames");

export const Login = () => {

  const [ spinner, setSpinner ] = React.useState(false);
  const [modalShow, setModalShow] = React.useState(false);

  const history = useHistory();
  const [ BadEmail, setBadEmail ] = React.useState(false);
  const [ BadPassword, setBadPassword ] = React.useState(false);

  const onSubmit = (event) => {
    event.preventDefault();
    fetch("http://localhost:5000/api/user/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email: event.target.email.value,
        password: event.target.password.value,
      }),
    })
      .then((res) => {
        if (res.status === 200) {
          res.json().then(data => {
            myCookies.cookies.set('jwt', data.token)
          });
          setSpinner(spinner => true);
          setTimeout(() => {
            history.push("/home");
          },
            1000
          );
        } else if (res.status === 401) {
          event.target.email.value = "";
          setBadEmail(BadEmail => true)
        } else if (res.status === 402) {
          event.target.password.value = "";
          setBadPassword(BadPassword => true)
        } else if (res.status === 403) {
          setModalShow(true);
        }
      })
      .catch((err) => {
        console.error(err);
        alert("Error logging in please try again");
      });
  };

  return (
    <div className="App">
      <div className="auth-wrapper">
        <div className="titlesLog">
          <h1>MY BOARD</h1>
          <br />
          <h2>Dive into your favorite custom dashboard !</h2>
          <br />
          <p>Welcome back ! Please login to your account.</p>
        </div>
        <div className="auth-inner">
          <form onSubmit={onSubmit}>
            <h3>Log In</h3>
            <div className="form-group">
              <label>Email address</label>
              <input name="email" type="email" className={ "form-control " + classNames({ BadEmail: BadEmail }) } placeholder="Enter email" />
            </div>
            <div className="form-group">
              <label>Password</label>
              <input name="password" type="password" className={ "form-control " + classNames({ BadPassword: BadPassword }) } placeholder="Enter password" />
            </div>
            <button type="submit" className="btn btn-primary btn-block">
              { spinner && <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span> }
              { spinner ? "Loading ..." : "Sign In" }
            </button>
            <br />
            <p>Don't have an account ? <Link to={"/register"}>Register</Link></p>
            <div className="socialList">
              <a href="http://localhost:5000/oauth/facebook" type="button" className="btn btn-primary"><i className="fa fa-facebook" /></a>
              <a href="http://localhost:5000/oauth/google" type="button" className="btn btn-danger"><i className="fa fa-google" /></a>
              <a href="http://www.localhost:5000/oauth/twitter" type="button" className="btn btn-info"><i className="fa fa-twitter" /></a>
            </div>
          </form>
        </div>
      </div>
      <div className="bannerLogo">
        <img alt="" src={Logo}/>
      </div>
      <MailConfirmM show={modalShow} onHide={() => setModalShow(false)} />
    </div>
  );
};
