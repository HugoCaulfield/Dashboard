import React from 'react';

import { Link } from "react-router-dom";

export const validate_account = () => {
  return (
	<div id="notfound">
		<div className="notfound">
			<div className="notfound-404">
				<h1>📧</h1>
				<h2>Check your email and validate your account</h2>
			</div>
			<Link to={"/login"}>Login</Link>
		</div>
	</div>
  );
};
