import React, { useState, useEffect, useCallback } from 'react';
import { myCookies } from '../../App'

const classNames = require("classnames");

export const NasaFirst = props => {
  const [badDate, setBadDate] = useState(false);

  const APIicon = "https://api.nasa.gov/assets/img/favicons/favicon-192.png";
  const title = "Nasa";
  const API_KEY = "tmvssA9eR4O8VX2RdrOTdiDP0MoG7nPCGIHMIYCF";

  const [top, setTop] = useState(false);
  const [image, setImage] = useState(false);

  const fetchData = useCallback(
    (date) => {
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
          fetch("https://api.nasa.gov/planetary/apod?date=" + date + "&api_key=" + API_KEY, {
            method: "GET",
            headers: {
              'Accept': 'application/json'
            },
          }).then((res) => {
            if (res.status === 200) {
              res.json().then((data) => {
                setBadDate(badDate => false);
                setTop(top => data.title);
                setImage(image => data.url);
              })
            } else {
              setBadDate(badDate => true);
              setTop(top => false);
              setImage(image => false);
            }
            (props.item !== undefined) && setTimeout(() => { fetchData(date) }, refresh_rate)
          }).catch((err) => console.error(err));
        })
      }).catch((err) => console.error(err));
    },
    [props.item],
  );

  useEffect(() => {
    (props.item !== undefined) && fetchData(props.item.preference);
  }, [props.item, fetchData]);

  const onKeyDown = event => {
    if (event.key === 'Enter')
      fetchData(event.target.value);
  };

  const onClick = () => {
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
    <div className="nasaFirst">
      <div className="top">
        <img alt={title} src={APIicon} />
        <h1>Astronomy Picture</h1>
        <div className="butt">
          <button onClick={onClick} className="btn btn-warning" ><i className="fas fa-trash-alt"></i></button>
        </div>
      </div>
      <div className="date">
        <input defaultValue={(props.item !== undefined) ? props.item.preference : ""} className={classNames({ badDate: badDate })} onKeyDown={onKeyDown} placeholder="Choose a date" type="date" aria-label="Date" />
      </div>
      <div className="body">
        {image && <img alt="imgoftheday" src={image} />}
        <p>{top}</p>
      </div>
    </div>
  );
};
