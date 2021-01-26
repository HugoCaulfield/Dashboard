import React, { useEffect, useState, useCallback } from 'react'
import { myCookies } from '../../App'

const classNames = require("classnames");

export const WeatherFirst = props => {
  const [badCity, setBadCity] = useState(false);

  const icon = 'https://www.gotenzo.com/wp-content/uploads/2018/05/icon-openweathermap-1.png';
  const title = 'Open Weather Map';
  const API_KEY = 'cd7c19ab6f0c9824806598c0ea9ddd5f';
  const iconW = 'http://openweathermap.org/img/w/'

  const [coord, setCoord] = useState(false);
  const [weather, setWeather] = useState(false);
  const [image, setImage] = useState(false);
  const [temp, setTemp] = useState(false);
  const [ressenti, setRessenti] = useState(false);
  const [humidity, setHumidity] = useState(false);
  const [sunrise, setSunrise] = useState(false);
  const [sunset, setSunset] = useState(false);

  const fetchData = useCallback(
    (city) => {
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
          fetch('http://api.openweathermap.org/data/2.5/weather?q=' + city + '&units=metric&appid=' + API_KEY, {
            method: "GET",
            headers: {
              'Accept': 'application/json'
            },
          })
            .then((res) => {
              if (res.status === 200) {
                res.json().then((data) => {
                  setCoord(coord => "Longitud: " + data.coord.lon + " --- Latitud: " + data.coord.lat);
                  setWeather(weather => data.weather[0].main + " (" + data.weather[0].description + ")");
                  setTemp(temp => "Temperature: " + String(data.main.temp).split('.')[0] + "°");
                  setRessenti(ressenti => "Feels like: " + String(data.main.feels_like).split('.')[0] + "°");
                  setImage(image => iconW + data.weather[0].icon + ".png");
                  setHumidity(humidity => "Humidity: " + data.main.humidity + "%");
                  const date1 = new Date(data.sys.sunrise * 1000);
                  const hours1 = date1.getHours();
                  const minutes1 = "0" + date1.getMinutes();
                  const formatedTime1 = hours1 + ':' + minutes1.substr(-2);
                  setSunrise(sunrise => "Sunrise: " + formatedTime1)
                  const date2 = new Date(data.sys.sunset * 1000);
                  const hours2 = date2.getHours();
                  const minutes2 = "0" + date2.getMinutes();
                  const formatedTime2 = hours2 + ':' + minutes2.substr(-2);
                  setSunset(sunset => "Sunset: " + formatedTime2)
                  setBadCity(badCity => false);
                })
              }
              else {
                setBadCity(badCity => true);
                setCoord(coord => false);
                setWeather(weather => false);
                setImage(image => false);
                setTemp(temp => false);
                setRessenti(ressenti => false);
                setHumidity(humidity => false);
                setSunrise(sunrise => false);
                setSunset(sunset => false);
              }
              (props.item !== undefined) && setTimeout(() => { fetchData(city) }, refresh_rate)
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
    <div className="weatherFirst">
      <div className="top">
        <img alt={title} src={icon} />
        <h1>Actual weather</h1>
        <div className="butt">
          <button onClick={onClickRemove} className="btn btn-warning" ><i className="fas fa-trash-alt"></i></button>
        </div>
      </div>
      <div className="input-group">
        <div className="input-group-prepend">
          <span className="input-group-text">City</span>
        </div>
        <input defaultValue={(props.item !== undefined) ? props.item.preference : ""} placeholder="Choose a city" onKeyDown={onSubmit} type="text" aria-label="City" className={"form-control " + classNames({ badCity: badCity })} />
      </div>
      <p>{coord}</p>
      <div className="body">
        {image ? (<img alt="IconWeather" src={image} />) : null}
        <p>{weather}</p>
      </div>
      <div className="bot">
        <div>
          <p>{sunrise}</p>
          <p>{sunset}</p>
        </div>
        <div>
          <p>{temp}</p>
          <p>{ressenti}</p>
        </div>
        <p>{humidity}</p>
      </div>
    </div>
  );
};
