import React, { Fragment } from 'react';
import { Helmet } from 'react-helmet';

const NotFound = () => {
	return (
		<Fragment>
			<Helmet>
				<title>{`Page Not Found | ${process.env.REACT_APP_TITLE}`}</title>
			</Helmet>
			<div className='col-12 text-center my-4'>
				<h1 className='largest fancy mb-3'>404</h1>
				<p>Page Not Found</p>
			</div>
		</Fragment>
	);
};

export default NotFound;
