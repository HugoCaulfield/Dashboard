import React from 'react';

import { GmailFirst } from '../components/gmail/gmailFirstW';
import { GmailSecond } from '../components/gmail/gmail.SecondW';
import { GmailThird } from '../components/gmail/gmailThirdW';

export const Gmail = () => {
  return (
    <div className="gmail">
      <div className="container-fluid">
        <div className="row gmailW">
          <div className="col">
            <GmailFirst />
          </div>
          <div className="col">
            <GmailSecond />
          </div>
          <div className="col">
            <GmailThird />
          </div>
        </div>
      </div>
    </div>
  );
};
