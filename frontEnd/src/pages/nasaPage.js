import React from 'react';

import { NasaFirst } from '../components/nasa/nasaFirstW';
import { NasaSecond } from '../components/nasa/nasaSecondW';
import { NasaThird } from '../components/nasa/nasaThirdW';

export const Nasa = () => {
  return (
    <div className="nasa">
      <div className="container-fluid">
        <div className="row">
          <div className="col">
            <NasaFirst />
          </div>
          <div className="col">
            <NasaSecond />
          </div>
          <div className="col">
            <NasaThird />
          </div>
        </div>
      </div>
    </div>
  );
};
