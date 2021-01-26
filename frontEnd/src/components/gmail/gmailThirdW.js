import React, { useState, useEffect, useCallback } from 'react';
import { myCookies } from '../../App'

export const GmailThird = props => {
  const APIicon = "https://www.flaticon.com/svg/static/icons/svg/281/281769.svg";
  const title = "Gmail";
  const APIroot = "http://localhost:5000/api/gmailWidget";

  const [message, setMessage] = useState(false);

  const fetchData = (to, subject, content) => {
    fetch(APIroot + "/sendEmail", {
      method: "POST",
      headers: {
        'Content-Type': 'application/json',
        'jwt': myCookies.cookies.get('jwt')
      },
      body: JSON.stringify({
        to: to,
        subject: subject,
        content: content
      })
    })
  };

  const fetchDatas = useCallback(
    (nb) => {
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
          fetch(APIroot + "/emailCATEGORY", {
            method: "POST",
            headers: {
              'Content-Type': 'application/json',
              'jwt': myCookies.cookies.get('jwt')
            },
            body: JSON.stringify({
              from: "SENT"
            })
          })
          .then((res) => {
            if (res.status === 200) {
              res.json().then((data) => {
                if (data.message.length > 0) {
                  let tab = [];
                    if (nb <= 0)
                      nb = 1;
                    for (let i = 0; i < nb; i++) {
                      if (i >= 10)
                        break
                      tab.push(data.message[i]);
                    }
                    setMessage(message => tab);
                  (props.item !== undefined) && setTimeout(() => { fetchDatas(nb) }, refresh_rate)
                }
              })
            }
          }).catch((err) => console.error(err));
        })
      }).catch((err) => console.error(err));
    },
    [props.item],
  );

  const onSubmit = (event) => {
    event.preventDefault();
    if (event.target.to.value.length !== 0 && event.target.subject.value.length !== 0
        && event.target.content.value.length !== 0) {
      fetchData(event.target.to.value, event.target.subject.value, event.target.content.value);
      alert("Succesfully sent !");
    } else {
      alert("You must fill all the text fields !");
    }
  };

  useEffect(() => {
    (props.item !== undefined) && fetchDatas(props.item.preference);
  }, [props.item, fetchDatas]);

  const onEnter = (event) => {
    if (event.key === 'Enter') {
      fetchDatas(event.target.value);
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
    <div className="gmailThird">
      <div className="top">
        <img alt={title} src={APIicon} />
        <h1>Send mails</h1>
        <div className="butt">
          <button onClick={onClickRemove} className="btn btn-warning" ><i className="fas fa-trash-alt"></i></button>
        </div>
      </div>
      <div className="auth-inner">
        <form onSubmit={onSubmit}>
          <div className="form-group">
            <label>Email address</label>
            <input className="form-control" placeholder="Email" name="to" type="email" />
          </div>
          <div className="form-group">
            <label>Subject</label>
            <input className="form-control" placeholder="Subject" name="subject" type="text" />
          </div>
          <div className="form-group">
            <label>Message</label>
            <input className="form-control message" name="content" type="text" />
          </div>
          <button type="submit" className="btn btn-primary btn-block">Send</button>
        </form>
      </div>
      <div className="input-group">
        <div className="input-group-prepend">
          <span className="input-group-text">Number</span>
        </div>
        <input defaultValue={(props.item !== undefined) ? props.item.preference : ""}
          placeholder="Choose a number 1 - 10" onKeyDown={onEnter} type="text" aria-label="text"
          className="form-control" />
      </div>
      <div className="body">
        {message && message.map((el, index) => { return <p key={index}>{el}</p> })}
      </div>
    </div>
  );
};
