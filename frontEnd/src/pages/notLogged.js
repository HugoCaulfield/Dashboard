import React from 'react';
import Logo from "../assets/logo.png"

export const NotLogged = params => {
  const onClick = () => {
    params.history.push("/login");
  };

  return (
    <div className="main">
      <div className="auth-wrapper">
        <div className="titlesLog">
          <h1>MY BOARD</h1>
          <br />
          <h2>Dive into your favorite custom dashboard !</h2>
          <br />
          <div className="auth-inner">
            <h3>You must <button onClick={onClick}>Sign In</button> !</h3>
          </div>
        </div>
      </div>
      <div className="bannerLogo">
        <img alt="" src={Logo}/>
      </div>
    </div>
  );
};
