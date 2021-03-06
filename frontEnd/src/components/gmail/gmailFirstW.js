import React, { useEffect, useState, useCallback } from 'react';
import { myCookies } from '../../App'

export const GmailFirst = props => {
  const APIicon = "https://www.flaticon.com/svg/static/icons/svg/281/281769.svg";
  const title = "Gmail";
  const APIroot = "http://localhost:5000/api/gmailWidget";

  const [message, setMessage] = useState(false);

  const fetchData = useCallback(
    (from) => {
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
          fetch(APIroot + "/emailFROM", {
            method: "POST",
            headers: {
              'Content-Type': 'application/json',
              'jwt': myCookies.cookies.get('jwt')
            },
            body: JSON.stringify({
              from: from
            })
          })
            .then((res) => {
              if (res.status === 200) {
                res.json().then((data) => {
                  if (data.message.length > 0) {
                    let tab = [];
                    for (let i = 0; i < data.message.length; i++) {
                      tab.push(data.message[i]);
                    }
                    setMessage(message => tab);
                    (props.item !== undefined) && setTimeout(() => { fetchData(from) }, refresh_rate)
                  }
                })
              }
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
    <div className="gmailFirst">
      <div className="top">
        <img alt={title} src={APIicon} />
        <h1>Find mails</h1>
        <div className="butt">
          <button onClick={onClickRemove} className="btn btn-warning" ><i className="fas fa-trash-alt"></i></button>
        </div>
      </div>
      <div className="input-group">
        <div className="input-group-prepend">
          <span className="input-group-text">Email</span>
        </div>
        <input defaultValue={(props.item !== undefined) ? props.item.preference : ""}
          placeholder="Choose an email adress" onKeyDown={onSubmit} type="email" aria-label="email"
          className="form-control" />
      </div>
      <div className="body">
        {message && message.map((el, index) => { return <p key={index}>{el}</p> })}
      </div>
    </div>
  );
};
