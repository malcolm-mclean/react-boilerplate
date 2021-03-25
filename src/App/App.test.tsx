import { render, screen } from '@testing-library/react';
import App from './App';

describe('App', () => {
	it('should render something', () => {
		render(<App />);

		expect(screen.getByTestId('app')).toBeTruthy();
	});
});
