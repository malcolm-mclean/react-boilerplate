import { render, screen } from '@testing-library/react';
import { App } from './App';

it('should render something', () => {
	render(<App />);

	expect(screen.getByTestId('app')).toBeInTheDocument();
});
