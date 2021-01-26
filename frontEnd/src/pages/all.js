import React from 'react';
import { AddWidgetM } from '../components/addWidgetModal';

import { WeatherFirst } from '../components/weatherWidgets/weatherFirstW';
import { WeatherSecond } from '../components/weatherWidgets/weatherSecondW';
import { WeatherThird } from '../components/weatherWidgets/weatherThirdW';
import { NasaFirst } from '../components/nasa/nasaFirstW';
import { NasaSecond } from '../components/nasa/nasaSecondW';
import { NasaThird } from '../components/nasa/nasaThirdW';
import { LastFmFirst } from '../components/lastFm/lastFmFirstW';
import { LastFmSecond } from '../components/lastFm/lastFmSecondW';
import { LastFmThird } from '../components/lastFm/lastFmThirdW';
import { GmailFirst } from '../components/gmail/gmailFirstW';
import { GmailSecond } from '../components/gmail/gmail.SecondW';
import { GmailThird } from '../components/gmail/gmailThirdW';

export const All = props => {
  const [modalShow, setModalShow] = React.useState(false);

  return (
    <div className="all">
      <div className="contain">
        { (props.subServices === false || props.subServices.length === 0 ||
          (props.subServices.length === 1 && props.subServices[0] === null)) && <NoServices /> }
        { ((props.subServices !== false || props.subServices.length !== 0 ||
          (props.subServices.length !== 1 && props.subServices[0] !== null)) &&
          (props.widgets === false || props.widgets.length === 0 ||
          (props.widgets.length === 1 && props.widgets[0] === null))) ?
          <NoWidgets /> :
          props.widgets.map((item, index) => {
            if (item.title === '1W') return ( <div key={index} className="weatherW"><WeatherFirst widgets={props.widgets} setsubservices={props.setSubServices} setWidgets={props.setWidgets} item={item} /></div> );
            if (item.title === '2W') return ( <div key={index} className="weatherW"><WeatherSecond widgets={props.widgets} setsubservices={props.setSubServices} setWidgets={props.setWidgets} item={item} /></div> );
            if (item.title === '3W') return ( <div key={index} className="weatherW"><WeatherThird widgets={props.widgets} setsubservices={props.setSubServices} setWidgets={props.setWidgets} item={item} /></div> );
            if (item.title === '1L') return ( <div key={index} className="lastFmW"><LastFmFirst widgets={props.widgets} setsubservices={props.setSubServices} setWidgets={props.setWidgets} item={item} /></div> );
            if (item.title === '2L') return ( <div key={index} className="lastFmW"><LastFmSecond widgets={props.widgets} setsubservices={props.setSubServices} setWidgets={props.setWidgets} item={item} /></div> );
            if (item.title === '3L') return ( <div key={index} className="lastFmW"><LastFmThird widgets={props.widgets} setsubservices={props.setSubServices} setWidgets={props.setWidgets} item={item} /></div> );
            if (item.title === '1N') return ( <div key={index} className="nasaW"><NasaFirst widgets={props.widgets} setsubservices={props.setSubServices} setWidgets={props.setWidgets} item={item} /></div> );
            if (item.title === '2N') return ( <div key={index} className="nasaW"><NasaSecond widgets={props.widgets} setsubservices={props.setSubServices} setWidgets={props.setWidgets} item={item} /></div> );
            if (item.title === '3N') return ( <div key={index} className="nasaW"><NasaThird widgets={props.widgets} setsubservices={props.setSubServices} setWidgets={props.setWidgets} item={item} /></div> );
            if (item.title === '1G') return ( <div key={index} className="gmailW"><GmailFirst widgets={props.widgets} setsubservices={props.setSubServices} setWidgets={props.setWidgets} item={item} /></div> );
            if (item.title === '2G') return ( <div key={index} className="gmailW"><GmailSecond widgets={props.widgets} setsubservices={props.setSubServices} setWidgets={props.setWidgets} item={item} /></div> );
            if (item.title === '3G') return ( <div key={index} className="gmailW"><GmailThird widgets={props.widgets} setsubservices={props.setSubServices} setWidgets={props.setWidgets} item={item} /></div> );
            return null;
        })}
      </div>
      <div className="addB">
        <button onClick={() => setModalShow(true)} className="btn btn-success" ><i className="fas fa-plus"></i></button>
      </div>
      <AddWidgetM widgets={props.widgets} setWidgets={props.setWidgets} setsubservices={props.setSubServices} subservices={props.subServices}
        show={modalShow} onHide={() => setModalShow(false)} />
    </div>
  );
};

const NoServices = () => {
  return (
    <div className="noServices">
      <h4>You are subscribed to 0 services !</h4>
    </div>
  );
};

const NoWidgets = () => {
  return (
    <div className="noServices">
      <h4>You added 0 widgets here !</h4>
    </div>
  );
};