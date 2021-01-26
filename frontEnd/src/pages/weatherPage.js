import React from 'react';

import { WeatherFirst } from '../components/weatherWidgets/weatherFirstW';
import { WeatherSecond } from '../components/weatherWidgets/weatherSecondW';
import { WeatherThird } from '../components/weatherWidgets/weatherThirdW';

export const Weather = () => {
  return (
    <div className="weather">
      <div className="container-fluid">
        <div className="row weatherW">
          <div className="col">
            <WeatherFirst />
          </div>
          <div className="col">
            <WeatherSecond />
          </div>
          <div className="col">
            <WeatherThird />
          </div>
        </div>
      </div>
    </div>
  );
};
