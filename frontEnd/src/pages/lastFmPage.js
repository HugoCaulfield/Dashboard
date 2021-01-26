import React from 'react';

import { LastFmFirst } from '../components/lastFm/lastFmFirstW';
import { LastFmSecond } from '../components/lastFm/lastFmSecondW';
import { LastFmThird } from '../components/lastFm/lastFmThirdW';

export const LastFm = () => {
  return (
    <div className="lastFm">
      <div className="container-fluid">
        <div className="row">
          <div className="col">
            <LastFmFirst />
          </div>
          <div className="col">
            <LastFmSecond />
          </div>
          <div className="col">
            <LastFmThird />
          </div>
        </div>
      </div>
    </div>
  );
};
