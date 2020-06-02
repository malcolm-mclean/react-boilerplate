import React from 'react';
import moment from 'moment';

const App = () => {
	return <h1 data-test="app">This is just the beginning: {moment.now()}</h1>;
};

export default App;
