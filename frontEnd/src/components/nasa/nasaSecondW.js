import React, { useState, useEffect, useCallback } from 'react';
import ImageGallery from 'react-image-gallery';
import { myCookies } from '../../App'

const classNames = require("classnames");

export const NasaSecond = props => {
  const [badDate, setBadDate] = useState(false);

  const APIicon = "https://api.nasa.gov/assets/img/favicons/favicon-192.png";
  const title = "Nasa";
  const API_KEY = "tmvssA9eR4O8VX2RdrOTdiDP0MoG7nPCGIHMIYCF";

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
          fetch("https://api.nasa.gov/mars-photos/api/v1/rovers/curiosity/photos?earth_date=" + date + "&page=1&api_key=" + API_KEY, {
            method: "GET",
            headers: {
              'Accept': 'application/json'
            },
          }).then((res) => {
            res.json().then((data) => {
              if (data.photos.length !== 0) {
                let tab = [];
                tab.push({
                  original: data.photos[0].img_src,
                  thumbnail: data.photos[0].img_src
                });
                tab.push({
                  original: data.photos[Math.round(data.photos.length / 4)].img_src,
                  thumbnail: data.photos[Math.round(data.photos.length / 4)].img_src
                });
                tab.push({
                  original: data.photos[Math.round(data.photos.length / 2)].img_src,
                  thumbnail: data.photos[Math.round(data.photos.length / 2)].img_src,
                });
                tab.push({
                  original: data.photos[Math.round(data.photos.length * 0.75)].img_src,
                  thumbnail: data.photos[Math.round(data.photos.length * 0.75)].img_src,
                });
                tab.push({
                  original: data.photos[data.photos.length - 1].img_src,
                  thumbnail: data.photos[data.photos.length - 1].img_src,
                });
                setImage(image => tab);
                setBadDate(badDate => false);
              } else {
                setBadDate(badDate => true);
                setImage(image => false);
              }
              (props.item !== undefined) && setTimeout(() => { fetchData(date) }, refresh_rate)
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

  const onChange = (event) => {
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
    <div className="nasaSecond">
      <div className="top">
        <img alt={title} src={APIicon} />
        <h1>Curiosity Photos</h1>
        <div className="butt">
          <button onClick={onClick} className="btn btn-warning" ><i className="fas fa-trash-alt"></i></button>
        </div>
      </div>
      <div className="date">
        <input defaultValue={(props.item !== undefined) ? props.item.preference : ""} className={classNames({ badDate: badDate })} onKeyDown={onChange} placeholder="Choose a date" type="date" aria-label="Date" />
      </div>
      <div className="body">
        {image && <ImageGallery showFullscreenButton={false} autoPlay={true} items={image} />}
      </div>
    </div>
  );
};
