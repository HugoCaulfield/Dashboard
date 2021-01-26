import React from "react";
import { Link, useHistory } from "react-router-dom";

import Logo from "../assets/logo.png"

const classNames = require("classnames");

export const Register = () => {
  const history = useHistory();

  const [ BadEmail, setBadEmail ] = React.useState(false);

  const onSubmit = (event) => {
    event.preventDefault();
    fetch("http://localhost:5000/api/user/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        username: event.target.username.value,
        email: event.target.email.value,
        password: event.target.password.value,
      }),
    })
      .then((res) => {
        if (res.status === 200) {
          history.push("/");
        } else if (res.status === 401 || res.status === 402) {
          event.target.email.value = "";
          setBadEmail(BadEmail => true)
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
            <h3>Register</h3>
            <div className="form-group">
                <label>Username</label>
                <input name="username" type="text" className="form-control" placeholder="Username" />
            </div>
            <div className="form-group">
                <label>Email address</label>
                <input name="email" type="email" className={ "form-control " + classNames({ BadEmail: BadEmail }) } placeholder="Enter email" />
            </div>
            <div className="form-group">
                <label>Password</label>
                <input name="password" type="password" className="form-control" placeholder="Enter password" />
            </div>
            <button type="submit" className="btn btn-primary btn-block">Register</button>
            <br />
            <p>Already have an account ? <Link to={"/login"}>Login</Link></p>
            <div className="socialList">
              <a href="http://localhost:5000/oauth/facebook" type="button" className="btn btn-primary"><i className="fa fa-facebook" /></a>
              <a href="http://localhost:5000/oauth/google" type="button" className="btn btn-danger"><i className="fa fa-google" /></a>
              <a href="http://localhost:5000/oauth/twitter" type="button" className="btn btn-info"><i className="fa fa-twitter" /></a>
            </div>
          </form>
        </div>
      </div>
      <div className="bannerLogo">
        <img alt="" src={Logo}/>
      </div>
    </div>
  );
};
