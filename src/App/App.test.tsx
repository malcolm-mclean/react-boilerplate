import React from 'react';
import { render } from '@testing-library/react';
import App from './App';

describe('App', () => {
	it('should render something', () => {
		const { getByTestId } = render(<App />);

		expect(getByTestId('app')).toBeInTheDocument();
	});
});
