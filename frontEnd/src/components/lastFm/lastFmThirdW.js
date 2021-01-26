import React, { useState, useEffect, useCallback } from 'react';
import { myCookies } from '../../App'

const classNames = require("classnames");

export const LastFmThird = props => {
  const [badInput, setBadInput] = useState(false);

  const APIicon = "https://cdn.last.fm/flatness/favicon.2.ico";
  const title = "LastFM";
  const APIroot = "http://ws.audioscrobbler.com/2.0/";
  const API_KEY = "29a3610a66a9e789ec3533de85bfe350";

  const [field, setField] = useState(false);

  const fetchData = useCallback(
    (tag) => {
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
          fetch(APIroot + "?method=tag.gettoptracks&tag=" + tag + "&api_key=" + API_KEY + "&format=json", {
            method: "GET",
            headers: {
              'Accept': 'application/json'
            },
          })
            .then((res) => {
              res.json().then((data) => {
                if (data.tracks.track.length !== 0) {
                  let tab = [];
                  for (let i = 0; i < 10; i++) {
                    tab.push(i + 1 + ". " + data.tracks.track[i].name + " - " + data.tracks.track[i].artist.name);
                  }
                  setField(field => tab);
                  setBadInput(badInput => false);
                } else {
                  setField(field => false);
                  setBadInput(badInput => true);
                }
                (props.item !== undefined) && setTimeout(() => { fetchData(tag) }, refresh_rate)
              })
            })
            .catch((err) => console.error(err));
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
            props.setsubservices(data.list_service);
            props.setWidgets(data.Widgets);
          })
        }).catch((err) => console.error(err));
    }).catch((err) => { console.error(err) })
  };

  return (
    <div className="lastFmThird">
      <div className="top">
        <img alt={title} src={APIicon} />
        <h1>Top 10 / tags</h1>
        <div className="butt">
          <button onClick={onClickRemove} className="btn btn-warning" ><i className="fas fa-trash-alt"></i></button>
        </div>
      </div>
      <div className="input-group">
        <div className="input-group-prepend">
          <span className="input-group-text">Tag</span>
        </div>
        <input defaultValue={(props.item !== undefined) ? props.item.preference : ""} placeholder="Choose a tag" onKeyDown={onSubmit} type="text" aria-label="Tag" className={"form-control " + classNames({ badInput: badInput })} />
      </div>
      <div className="body">
        {field ? field.map((el, index) => { return <p key={index}>{el}</p> }) : null}
      </div>
    </div>
  );
};
