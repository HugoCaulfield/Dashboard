import React from 'react';

import { Link } from "react-router-dom";

export const mail_sent = () => {
  return (
	<div id="notfound">
		<div className="notfound">
			<div className="notfound-404">
				<h1>📧</h1>
				<h2>Email successfully sent</h2>
			</div>
			<Link to={"/login"}>Login</Link>
		</div>
	</div>
  );
};
