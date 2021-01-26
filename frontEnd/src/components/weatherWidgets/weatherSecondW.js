import React, { useEffect, useState, useCallback } from 'react'
import { myCookies } from '../../App'

const classNames = require("classnames");

export const WeatherSecond = props => {
  const [badCity, setBadCity] = useState(false);

  const icon = 'https://www.gotenzo.com/wp-content/uploads/2018/05/icon-openweathermap-1.png';
  const title = 'Open Weather Map';
  const API_KEY = 'cd7c19ab6f0c9824806598c0ea9ddd5f';
  const iconW = 'http://openweathermap.org/img/w/'

  const [hour, setHour] = useState(false);
  const [image, setImage] = useState(false);
  const [temperature, setTemperature] = useState(false);

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
          fetch('http://api.openweathermap.org/data/2.5/forecast?q=' + city + '&units=metric&appid=' + API_KEY, {
            method: "GET",
            headers: {
              'Accept': 'application/json'
            },
          })
            .then((res) => {
              if (res.status === 200) {
                res.json().then((data) => {
                  let tab1 = [];
                  let tab2 = [];
                  let tab3 = [];
                  for (let i = 0; i < 8; i++) {
                    tab1.push(data.list[i].dt_txt.slice(11, 16))
                    tab2.push(String(data.list[i].main.temp).split('.')[0] + "°");
                    tab3.push(iconW + data.list[i].weather[0].icon + ".png")
                  }
                  setHour(hour => tab1);
                  setTemperature(temperature => tab2);
                  setImage(image => tab3);
                  setBadCity(badCity => false);
                })
              }
              else {
                setBadCity(badCity => true);
                setHour(hour => false);
                setTemperature(temperature => false);
                setImage(image => false);
              }
              (props.item !== undefined) && setTimeout(() => { fetchData(city) }, refresh_rate)
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
    <div className="weatherSecond">
      <div className="top">
        <img alt={title} src={icon} />
        <h1>Hours forecast</h1>
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
      <div className="hours">
        {hour ? hour.map((el, index) => { return <p key={index}>{el}</p> }) : null}
      </div>
      <div className="images">
        {image ? image.map((el, index) => { return <img src={el} key={index} alt="IconWeather" /> }) : null}
      </div>
      <div className="temperature">
        {temperature ? temperature.map((el, index) => { return <p key={index}>{el}</p> }) : null}
      </div>
    </div>
  );
};
