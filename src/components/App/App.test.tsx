import React from 'react';
import { render } from '@testing-library/react';
import App from '.';

describe('App', () => {
	it('should render something', () => {
		const { getByTestId } = render(<App />);

		expect(getByTestId('app')).toBeTruthy();
	});
});
