import React, { useEffect, useState, useCallback } from 'react';
import { myCookies } from '../../App'

const classNames = require("classnames");

export const LastFmFirst = props => {
  const [badInput, setBadInput] = useState(false);

  const APIicon = "https://cdn.last.fm/flatness/favicon.2.ico";
  const title = "LastFM";
  const APIroot = "http://ws.audioscrobbler.com/2.0/";
  const API_KEY = "29a3610a66a9e789ec3533de85bfe350";

  const [name, setName] = useState(false);
  const [listeners, setListeners] = useState(false);
  const [playcount, setPlaycount] = useState(false);
  const [similar, setSimilar] = useState(false);
  const [tags, setTags] = useState(false);

  const fetchData = useCallback(
    (artist) => {
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
          fetch(APIroot + "?method=artist.getInfo&api_key=" + API_KEY + "&artist=" + artist + "&format=json", {
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
                  for (let i = 0; i < 5; i++) {
                    tab1.push(data.artist.similar.artist[i].name);
                    tab2.push(data.artist.tags.tag[i].name);
                  }
                  setName(name => data.artist.name);
                  setListeners(listeners => data.artist.stats.listeners + " listeners");
                  setPlaycount(playcount => data.artist.stats.playcount + " playcounts");
                  setSimilar(similar => tab1);
                  setTags(tags => tab2);
                  setBadInput(badInput => false);
                } else {
                  setName(false);
                  setListeners(false);
                  setPlaycount(false);
                  setSimilar(false);
                  setTags(false);
                  setBadInput(badInput => true);
                }
                (props.item !== undefined) && setTimeout(() => { fetchData() }, refresh_rate)
              })
            }).catch((err) => console.error(err));
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
    <div className="lastFmFirst">
      <div className="top">
        <img alt={title} src={APIicon} />
        <h1>Artist Info</h1>
        <div className="butt">
          <button onClick={onClickRemove} className="btn btn-warning" ><i className="fas fa-trash-alt"></i></button>
        </div>
      </div>
      <div className="input-group">
        <div className="input-group-prepend">
          <span className="input-group-text">Country</span>
        </div>
        <input defaultValue={(props.item !== undefined) ? props.item.preference : ""}
          placeholder="Choose an artist" onKeyDown={onSubmit} type="text" aria-label="Artist"
          className={"form-control " + classNames({ badInput: badInput })} />
      </div>
      <div className="body">
        <div className="name">
          <p>{name && name}</p>
        </div>
        <div className="stats">
          <div>
            <p>{listeners && listeners}</p>
          </div>
          <div>
            <p>{playcount && playcount}</p>
          </div>
        </div>
        <div className="similar">
          <div>
            <p>{similar && "Similar artists :"}</p>
            {similar && similar.map((el, index) => { return <p key={index}>{el}</p> })}
          </div>
          <div>
            <p>{tags &&  "Common tags :"}</p>
            {tags && tags.map((el, index) => { return <p key={index}>{el}</p> })}
          </div>
        </div>
      </div>
    </div>
  );
};
