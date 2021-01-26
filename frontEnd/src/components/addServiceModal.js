import React, { useEffect, useState } from 'react';
import Modal from 'react-bootstrap/Modal'
import { IsSub, IsNotSub } from './SubButtons';
import { myCookies } from '../App'

export const AddServiceM = props => {
  const [gmail, setGmail] = useState(false);

  useEffect(() => {
    fetch("http://localhost:5000/api/gmailWidget/compatible", {
      method: "GET",
      headers: {
        'Accept': 'application/json',
        'jwt': myCookies.cookies.get('jwt')
      }
    }).then((res) => {
      if (res.status === 200) setGmail(gmail => true)
    }).catch((err) => console.error(err));
  }, []);

  return (
    <Modal
      show={props.show}
      onHide={props.onHide}
      size="lg"
      aria-labelledby="contained-modal-title-vcenter"
      centered
    >
      <Modal.Header className="greyBg">
        <Modal.Title id="contained-modal-title-vcenter">
          Add a new service to you're Dashboard !
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <h4>Services available:</h4>
        <div className="listW">
          <div>
            <img alt="Weather" src="https://www.gotenzo.com/wp-content/uploads/2018/05/icon-openweathermap-1.png" />
            { (props.subservices !== false) && (props.subservices.includes("Weather")) ?
                <IsSub name="Weather" setList={props.setsubservices} /> :
                <IsNotSub name="Weather" setList={props.setsubservices} /> }
          </div>
          <div>
            <img alt="Nasa" src="https://api.nasa.gov/assets/img/favicons/favicon-192.png" />
            { (props.subservices !== false) && (props.subservices.includes("Nasa")) ?
                <IsSub name="Nasa" setList={props.setsubservices} /> :
                <IsNotSub name="Nasa" setList={props.setsubservices} /> }
          </div>
          <div>
            <img alt="LastFm" src="https://cdn3.iconfinder.com/data/icons/popular-services-brands/512/last-fm-512.png" />
            { (props.subservices !== false) && (props.subservices.includes("LastFm")) ?
                <IsSub name="LastFm" setList={props.setsubservices} /> :
                <IsNotSub name="LastFm" setList={props.setsubservices} /> }
          </div>
          { (gmail === true) && <div>
            <img alt="Gmail" src="https://www.flaticon.com/svg/static/icons/svg/281/281769.svg" />
            { (props.subservices !== false) && (props.subservices.includes("Gmail")) ?
                <IsSub name="Gmail" setList={props.setsubservices} /> :
                <IsNotSub name="Gmail" setList={props.setsubservices} /> }
          </div> }
        </div>
      </Modal.Body>
      <Modal.Footer className="greyBg">
        <button className="btn btn-success" onClick={props.onHide}>Close</button>
      </Modal.Footer>
    </Modal>
  );
};
