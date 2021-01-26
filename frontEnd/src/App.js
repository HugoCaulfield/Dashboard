import React from 'react';
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import "./styles/index.css"
import Cookies from 'universal-cookie';

import { Login } from "./pages/login";
import { Register } from "./pages/register";
import { Home } from "./pages/home";
import { mail_sent } from './pages/mail_sent';
import { validate_account } from './pages/validate_account';
import { About } from './pages/about';

export var myCookies = {
  cookies:  new Cookies()
}

function App() {
  return (
    <Router>
      <Switch>
        <Route exact path='/' component={Login} />
        <Route path="/login" component={Login} />
        <Route path="/register" component={Register} />
        <Route path="/home" component={Home}/>
        <Route path="/mail_sent" component={mail_sent} />
        <Route path="/validate_account" component={validate_account} />
        <Route path="/about.json" component={About} />
      </Switch>
    </Router>
  );
}

export default App;
