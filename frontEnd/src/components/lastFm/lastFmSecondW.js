import React, { useState, useEffect, useCallback } from 'react';
import { myCookies } from '../../App'

const classNames = require("classnames");

export const LastFmSecond = props => {
  const [badInput, setBadInput] = useState(false);

  const APIicon = "https://cdn.last.fm/flatness/favicon.2.ico";
  const title = "LastFM";
  const APIroot = "http://ws.audioscrobbler.com/2.0/";
  const API_KEY = "29a3610a66a9e789ec3533de85bfe350";

  const [artist, setArtist] = useState(false);
  const [name, setName] = useState(false);
  const [listeners, setListeners] = useState(false);

  const fetchData = useCallback(
    (country) => {
      let refresh_rate = 667
      fetch("http://localhost:5000/api/subscribe/subscribe_list", {
        method: "GET",
        headers: {
          'Accept': 'application/json',
          'jwt': myCookies.cookies.get('jwt')
        },
      }).then((res) => {
        res.json().then((data) => {
          if (props.item !== undefined) {
            for (let index = 0; index < data.Widgets.length; index++) {
              if (data.Widgets[index]._id === props.item._id)
                refresh_rate = data.Widgets[index].refreshRate * 1000
            }
            if (refresh_rate === 667)
              return;
          }
          fetch(APIroot + "?method=geo.gettoptracks&country=" + country + "&api_key=" + API_KEY + "&format=json", {
            method: "GET",
            headers: {
              'Accept': 'application/json'
            },
          })
            .then((res) => {
              res.json().then((data) => {
                if (data.error === undefined) {
                  let tab1 = [];
                  let tab2 = [];
                  let tab3 = [];
                  for (let i = 0; i < 10; i++) {
                    tab1.push(data.tracks.track[i].artist.name);
                    tab2.push(i + 1 + ". " + data.tracks.track[i].name);
                    tab3.push(data.tracks.track[i].listeners);
                  }
                  setArtist(hour => tab1);
                  setName(name => tab2);
                  setListeners(listeners => tab3);
                  setBadInput(badInput => false);
                } else {
                  setArtist(hour => false);
                  setName(name => false);
                  setListeners(listeners => false);
                  setBadInput(badInput => true);
                }
                (props.item !== undefined) && setTimeout(() => { fetchData(country) }, refresh_rate)
              })
            })
        })
      }).catch((err) => console.error(err));
    },
    [props.item],
  );

  useEffect(() => {
    (props.item !== undefined) && fetchData(props.item.preference);
  }, [props.item, fetchData]);

  const onSubmit = (event) => {
    if (event.key === 'Enter') {
      fetchData(event.target.value);
    };
  };

  const onClickRemove = () => {
    fetch("http://localhost:5000/api/subscribe/delWidget", {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        'jwt': myCookies.cookies.get('jwt')
      },
      body: JSON.stringify({
        "Widgets": [{
          "_id": props.item._id
        }]
      })
    }).then((res) => {
      if (res.status === 200)
        fetch("http://localhost:5000/api/subscribe/subscribe_list", {
          method: "GET",
          headers: {
            'Accept': 'application/json',
            'jwt': myCookies.cookies.get('jwt')
          },
        }).then((res) => {
          res.json().then((data) => {
            props.setsubservices(data.list_service)
            props.setWidgets(data.Widgets)
          })
        }).catch((err) => console.error(err));
    }).catch((err) => { console.error(err) })
  };

  return (
    <div className="lastFmSecond">
      <div className="top">
        <img alt={title} src={APIicon} />
        <h1>Top 10 / country</h1>
        <div className="butt">
          <button onClick={onClickRemove} className="btn btn-warning" ><i className="fas fa-trash-alt"></i></button>
        </div>
      </div>
      <div className="input-group">
        <div className="input-group-prepend">
          <span className="input-group-text">Country</span>
        </div>
        <input defaultValue={(props.item !== undefined) ? props.item.preference : ""} placeholder="Choose a country" onKeyDown={onSubmit} type="text" aria-label="Country" className={"form-control " + classNames({ badInput: badInput })} />
      </div>
      <div className="body">
        <div>
          {name ? name.map((el, index) => { return <p key={index}>{el}</p> }) : null}
        </div>
        <div>
          {artist ? artist.map((el, index) => { return <p key={index}>{el}</p> }) : null}
        </div>
        <div>
          {listeners ? listeners.map((el, index) => { return <p key={index}>{el} <i className="fas fa-headphones-alt"></i></p> }) : null}
        </div>
      </div>
    </div>
  );
};
