import React, { Suspense, lazy } from 'react';
import moment from 'moment';
import { BrowserRouter, Route } from 'react-router-dom';

const Wassup = lazy(() =>
	import(/* webpackChunkName: "wassup" */ '../pages/Wassup/Wassup')
);

const App = () => {
	return (
		<>
			<h1 data-test="app">This is just the beginning: {moment.now()}</h1>
			<BrowserRouter>
				<Suspense
					fallback={<p>Make me a real loading animation please!</p>}
				>
					<Route exact path="/wassup">
						<Wassup />
					</Route>
				</Suspense>
			</BrowserRouter>
		</>
	);
};

export default App;
