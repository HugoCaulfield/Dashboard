import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Switch, Route, useHistory } from "react-router-dom";

import { Navbar } from '../components/navbar';
import { All } from './all';
import { Weather } from './weatherPage';
import { LastFm } from './lastFmPage';
import { Nasa } from './nasaPage';
import { Gmail } from './gmailPage';
import { NotLogged } from './notLogged';

import { myCookies } from '../App'

export const Home = () => {
  const history = useHistory();

  const [ subServices, setSubServices ] = useState(false);
  const [ widgets, setWidgets ] = useState(false);

  useEffect(() => {
    if (!verifyToken()) {
      fetch("http://localhost:5000/api/subscribe/subscribe_list", {
        method: "GET",
        headers : { 
          'Accept': 'application/json',
          'jwt': myCookies.cookies.get('jwt')
        },
      }).then((res) => {
          res.json().then((data) => {
            setSubServices(subServices => data.list_service);
            setWidgets(widgets => data.Widgets);
          })
      }).catch((err) => console.error(err));
    }
  }, []);

  const verifyToken = () => {
    if (myCookies.cookies === undefined || myCookies.cookies.get('jwt') === undefined) {
      return (true)
    }
    fetch("http://localhost:5000/api/token/verifyToken", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        "authtoken": myCookies.cookies.get('jwt')
      })
    }).then((res) => {
      if (res.status === 200)
        return (false)
    }).catch((err) => { console.error(err); return (true) })
  }

  return (
    <>
      <Router>
        { !verifyToken() && <Navbar subServices={subServices} setSubServices={setSubServices} /> }
        <Switch>
          <Route exact path='/home'>
            {verifyToken() ? <NotLogged history={history} /> :
              <All widgets={widgets} setWidgets={setWidgets} subServices={subServices} setSubServices={setSubServices} /> }
          </Route>
          <Route path='/home/weather' component={Weather} />
          <Route path='/home/lastfm' component={LastFm} />
          <Route path='/home/nasa' component={Nasa} />
          <Route path='/home/gmail' component={Gmail} />
        </Switch>
        <footer>
          <p>Made by Lucas Simao & Hugo Caulfield.</p>
        </footer>
      </Router>
    </>
  );
};
