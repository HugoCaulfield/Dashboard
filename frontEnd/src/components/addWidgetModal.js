import Modal from 'react-bootstrap/Modal'
import React from 'react';
import { myCookies } from '../App'

export const AddWidgetM = props => {
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
          Add a new widget to you're Dashboard !
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <h4>Widgets available:</h4>
        <div className="listWidgets">
          { (props.subservices === false || props.subservices.length === 0 ||
            (props.subservices.length === 1 && props.subservices[0] === null)) && <p>You are subscribed to 0 services</p> }
          { (props.subservices !== false && props.subservices.includes("Weather")) && <WWAvailable close={props.onHide} setsubservices={props.setsubservices}  setWidgets={props.setWidgets} /> }
          { (props.subservices !== false && props.subservices.includes("LastFm")) && <LWAvailable close={props.onHide} setsubservices={props.setsubservices}  setWidgets={props.setWidgets} /> }
          { (props.subservices !== false && props.subservices.includes("Nasa")) && <NWAvailable close={props.onHide} setsubservices={props.setsubservices}  setWidgets={props.setWidgets} /> }
          { (props.subservices !== false && props.subservices.includes("Gmail")) && <GWAvailable close={props.onHide} setsubservices={props.setsubservices}  setWidgets={props.setWidgets} /> }
        </div>
      </Modal.Body>
      <Modal.Footer className="greyBg">
        <button className="btn btn-success" onClick={props.onHide}>Close</button>
      </Modal.Footer>
    </Modal>
  );
};

const WWAvailable = props => {
  const [input1, setInput1] = React.useState(false);
  const [input2, setInput2] = React.useState(false);
  const [input3, setInput3] = React.useState(false);
  const [input4, setInput4] = React.useState(false);
  const [input5, setInput5] = React.useState(false);
  const [input6, setInput6] = React.useState(false);

  const onChange1 = e => setInput1(input1 => e.target.value)
  const onChange2 = e => setInput2(input2 => e.target.value)
  const onChange3 = e => setInput3(input3 => e.target.value)
  const onChange4 = e => setInput4(input4 => e.target.value)
  const onChange5 = e => setInput5(input5 => e.target.value)
  const onChange6 = e => setInput6(input6 => e.target.value)

  const onClick = (name, input1, input2) => {
    fetch("http://localhost:5000/api/subscribe/addWidget", {
      method: "POST",
      headers : { 
        "Content-Type": "application/json",
        'jwt': myCookies.cookies.get('jwt')
      },
      body: JSON.stringify({
        "Widgets": [{
          "title": name,
          "preference": input1,
          "refreshRate": input2
        }]
      })
    }).then((res) => {
      if (res.status === 200)
        fetch("http://localhost:5000/api/subscribe/subscribe_list", {
          method: "GET",
          headers : { 
            'Accept': 'application/json',
            'jwt': myCookies.cookies.get('jwt')
          },
        }).then((res) => {
            res.json().then((data) => {
              props.setsubservices(data.list_service);
              props.setWidgets(data.Widgets);
              props.close();
            })
        }).catch((err) => console.error(err));
    }).catch((err) => { console.error(err) })
  };

  return (
    <>
      <>
        <div className="Weatherbg">
          <h4>Actual weather</h4>
          <img alt="Weather" src="https://www.gotenzo.com/wp-content/uploads/2018/05/icon-openweathermap-1.png" />
          <input onChange={onChange1} placeholder="Choose a city" type="text" aria-label="City" />
          <input onChange={onChange4} placeholder="Choose a Refresh rate" type="text" aria-label="Refresh" />
          <button onClick={() => onClick("1W", input1, input4)} className="btn btn-primary">+ Add</button>
        </div>
      </>
      <>
        <div className="Weatherbg">
          <h4>Hours forecast</h4>
          <img alt="Weather" src="https://www.gotenzo.com/wp-content/uploads/2018/05/icon-openweathermap-1.png" />
          <input onChange={onChange2} placeholder="Choose a city" type="text" aria-label="City" />
          <input onChange={onChange5} placeholder="Choose a Refresh rate" type="text" aria-label="Refresh" />
          <button onClick={() => onClick("2W", input2, input5)} className="btn btn-primary">+ Add</button>
        </div>
      </>
      <>
        <div className="Weatherbg">
          <h4>Days forecast</h4>
          <img alt="Weather" src="https://www.gotenzo.com/wp-content/uploads/2018/05/icon-openweathermap-1.png" />
          <input onChange={onChange3} placeholder="Choose a city" type="text" aria-label="City" />
          <input onChange={onChange6} placeholder="Choose a Refresh rate" type="text" aria-label="Refresh" />
          <button onClick={() => onClick("3W", input3, input6)} className="btn btn-primary">+ Add</button>
        </div>
      </>
    </>
  );
};

const LWAvailable = props => {
  const [input1, setInput1] = React.useState(false);
  const [input2, setInput2] = React.useState(false);
  const [input3, setInput3] = React.useState(false);
  const [input4, setInput4] = React.useState(false);
  const [input5, setInput5] = React.useState(false);
  const [input6, setInput6] = React.useState(false);

  const onChange1 = e => setInput1(input1 => e.target.value)
  const onChange2 = e => setInput2(input2 => e.target.value)
  const onChange3 = e => setInput3(input3 => e.target.value)
  const onChange4 = e => setInput4(input4 => e.target.value)
  const onChange5 = e => setInput5(input5 => e.target.value)
  const onChange6 = e => setInput6(input6 => e.target.value)

  const onClick = (name, input1, input2) => {
    fetch("http://localhost:5000/api/subscribe/addWidget", {
      method: "POST",
      headers : { 
        "Content-Type": "application/json",
        'jwt': myCookies.cookies.get('jwt')
      },
      body: JSON.stringify({
        "Widgets": [{
          "title": name,
          "preference": input1,
          "refreshRate": input2
        }]
      })
    }).then((res) => {
      if (res.status === 200)
        fetch("http://localhost:5000/api/subscribe/subscribe_list", {
          method: "GET",
          headers : { 
            'Accept': 'application/json',
            'jwt': myCookies.cookies.get('jwt')
          },
        }).then((res) => {
            res.json().then((data) => {
              props.setsubservices(data.list_service);
              props.setWidgets(data.Widgets);
              props.close();
            })
        }).catch((err) => console.error(err));
    }).catch((err) => { console.error(err) })
  };

  return (
    <>
      <>
        <div className="LastFmbg">
          <h4>Artist Info</h4>
          <img alt="LastFm" src="https://cdn3.iconfinder.com/data/icons/popular-services-brands/512/last-fm-512.png" />
          <input onChange={onChange1} placeholder="Choose an artist" type="text" aria-label="Artist" />
          <input onChange={onChange4} placeholder="Choose a Refresh rate" type="text" aria-label="Refresh" />
          <button onClick={() => onClick("1L", input1, input4)} className="btn btn-primary">+ Add</button>
        </div>
      </>
      <>
        <div className="LastFmbg">
          <h4>Top 10 / country</h4>
          <img alt="LastFm" src="https://cdn3.iconfinder.com/data/icons/popular-services-brands/512/last-fm-512.png" />
          <input onChange={onChange2} placeholder="Choose a country" type="text" aria-label="Country" />
          <input onChange={onChange5} placeholder="Choose a Refresh rate" type="text" aria-label="Refresh" />
          <button onClick={() => onClick("2L", input2, input5)} className="btn btn-primary">+ Add</button>
        </div>
      </>
      <>
        <div className="LastFmbg">
          <h4>Top 10 / tags</h4>
          <img alt="LastFm" src="https://cdn3.iconfinder.com/data/icons/popular-services-brands/512/last-fm-512.png" />
          <input onChange={onChange3} placeholder="Choose a tag" type="text" aria-label="Tag" />
          <input onChange={onChange6} placeholder="Choose a Refresh rate" type="text" aria-label="Refresh" />
          <button onClick={() => onClick("3L", input3, input6)} className="btn btn-primary">+ Add</button>
        </div>
      </>
    </>
  );
};

const NWAvailable = props => {
  const [input1, setInput1] = React.useState(false);
  const [input2, setInput2] = React.useState(false);
  const [input3, setInput3] = React.useState(false);
  const [input4, setInput4] = React.useState(false);
  const [input5, setInput5] = React.useState(false);
  const [input6, setInput6] = React.useState(false);

  const onChange1 = e => setInput1(input1 => e.target.value)
  const onChange2 = e => setInput2(input2 => e.target.value)
  const onChange3 = e => setInput3(input3 => e.target.value)
  const onChange4 = e => setInput4(input4 => e.target.value)
  const onChange5 = e => setInput5(input5 => e.target.value)
  const onChange6 = e => setInput6(input6 => e.target.value)

  const onClick = (name, input1, input2) => {
    fetch("http://localhost:5000/api/subscribe/addWidget", {
      method: "POST",
      headers : { 
        "Content-Type": "application/json",
        'jwt': myCookies.cookies.get('jwt')
      },
      body: JSON.stringify({
        "Widgets": [{
          "title": name,
          "preference": input1,
          "refreshRate": input2,
        }]
      })
    }).then((res) => {
      if (res.status === 200)
        fetch("http://localhost:5000/api/subscribe/subscribe_list", {
          method: "GET",
          headers : { 
            'Accept': 'application/json',
            'jwt': myCookies.cookies.get('jwt')
          },
        }).then((res) => {
            res.json().then((data) => {
              props.setsubservices(data.list_service);
              props.setWidgets(data.Widgets);
              props.close();
            })
        }).catch((err) => console.error(err));
    }).catch((err) => { console.error(err) })
  };

  return (
    <>
      <>
        <div className="Nasabg">
          <h4>Astronomy</h4>
          <img alt="Nasa" src="https://api.nasa.gov/assets/img/favicons/favicon-192.png" />
          <input onChange={onChange1} placeholder="Choose a date" type="date" aria-label="Date" />
          <input onChange={onChange4} placeholder="Choose a Refresh rate" type="text" aria-label="Refresh" />
          <button onClick={() => onClick("1N", input1, input4)} className="btn btn-primary">+ Add</button>
        </div>
      </>
      <>
        <div className="Nasabg">
          <h4>Curiosity</h4>
          <img alt="Nasa" src="https://api.nasa.gov/assets/img/favicons/favicon-192.png" />
          <input onChange={onChange2} placeholder="Choose a tag" type="date" aria-label="Date" />
          <input onChange={onChange5} placeholder="Choose a Refresh rate" type="text" aria-label="Refresh" />
          <button onClick={() => onClick("2N", input2, input5)} className="btn btn-primary">+ Add</button>
        </div>
      </>
      <>
        <div className="Nasabg">
          <h4>Opportunity</h4>
          <img alt="Nasa" src="https://api.nasa.gov/assets/img/favicons/favicon-192.png" />
          <input onChange={onChange3} placeholder="Choose a tag" type="date" aria-label="date" />
          <input onChange={onChange6} placeholder="Choose a Refresh rate" type="text" aria-label="Refresh" />
          <button onClick={() => onClick("3N", input3, input6)} className="btn btn-primary">+ Add</button>
        </div>
      </>
    </>
  );
};

const GWAvailable = props => {
  const [input1, setInput1] = React.useState(false);
  const [input2, setInput2] = React.useState(false);
  const [input3, setInput3] = React.useState(false);
  const [input4, setInput4] = React.useState(false);
  const [input5, setInput5] = React.useState(false);
  const [input6, setInput6] = React.useState(false);

  const onChange1 = e => setInput1(input1 => e.target.value)
  const onChange2 = e => setInput2(input2 => e.target.value)
  const onChange3 = e => setInput3(input3 => e.target.value)
  const onChange4 = e => setInput4(input4 => e.target.value)
  const onChange5 = e => setInput5(input5 => e.target.value)
  const onChange6 = e => setInput6(input6 => e.target.value)

  const onClick = (name, input1, input2) => {
    fetch("http://localhost:5000/api/subscribe/addWidget", {
      method: "POST",
      headers : { 
        "Content-Type": "application/json",
        'jwt': myCookies.cookies.get('jwt')
      },
      body: JSON.stringify({
        "Widgets": [{
          "title": name,
          "preference": input1,
          "refreshRate": input2,
        }]
      })
    }).then((res) => {
      if (res.status === 200)
        fetch("http://localhost:5000/api/subscribe/subscribe_list", {
          method: "GET",
          headers : { 
            'Accept': 'application/json',
            'jwt': myCookies.cookies.get('jwt')
          },
        }).then((res) => {
            res.json().then((data) => {
              props.setsubservices(data.list_service);
              props.setWidgets(data.Widgets);
              props.close();
            })
        }).catch((err) => console.error(err));
    }).catch((err) => { console.error(err) })
  };

  return (
    <>
      <>
        <div className="Gmailbg">
          <h4>Mails from</h4>
          <img alt="Gmail" src="https://www.flaticon.com/svg/static/icons/svg/281/281769.svg" />
          <input onChange={onChange1} placeholder="Choose an email" type="email" aria-label="email" />
          <input onChange={onChange4} placeholder="Choose a Refresh rate" type="text" aria-label="Refresh" />
          <button onClick={() => onClick("1G", input1, input4)} className="btn btn-primary">+ Add</button>
        </div>
      </>
      <>
        <div className="Gmailbg">
          <h4>Mails / Category</h4>
          <img alt="Gmail" src="https://www.flaticon.com/svg/static/icons/svg/281/281769.svg" />
          <input onChange={onChange2} placeholder="Choose a category" type="text" aria-label="text" />
          <input onChange={onChange5} placeholder="Choose a Refresh rate" type="text" aria-label="Refresh" />
          <button onClick={() => onClick("2G", input2, input5)} className="btn btn-primary">+ Add</button>
        </div>
      </>
      <>
        <div className="Gmailbg">
          <h4>Send mails</h4>
          <img alt="Gmail" src="https://www.flaticon.com/svg/static/icons/svg/281/281769.svg" />
          <input onChange={onChange3} placeholder="Choose a number 1 - 10" type="text" aria-label="text" />
          <input onChange={onChange6} placeholder="Choose a Refresh rate" type="text" aria-label="Refresh" />
          <button onClick={() => onClick("3G", input3, input6)} className="btn btn-primary">+ Add</button>
        </div>
      </>
    </>
  );
};