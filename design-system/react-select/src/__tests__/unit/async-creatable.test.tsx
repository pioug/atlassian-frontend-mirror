import React from 'react';

import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import AsyncCreatable from '../../async-creatable';

import { type Option, OPTIONS } from './constants.mock';

const testId = 'react-select';

test('creates an inner Select', () => {
	render(<AsyncCreatable testId="react-select" />);
	expect(screen.getByTestId(`${testId}-select--container`)).toBeInTheDocument();
});

test('render decorated select with props passed', () => {
	render(<AsyncCreatable testId="foo" />);
	expect(screen.getByTestId('foo-select--container')).toBeInTheDocument();
});

test('to show the create option in menu', async () => {
	const { rerender } = render(<AsyncCreatable testId={testId} />);
	const input = screen.getByTestId(`${testId}-select--input`);
	rerender(<AsyncCreatable testId={testId} inputValue="a" />);
	await userEvent.type(input!, 'a');
	expect(screen.getByRole('option', { name: 'Create "a"' })).toBeInTheDocument();
});

test('to show loading and then create option in menu', async () => {
	const loadOptionsSpy = jest.fn(
		(_inputValue: string, callback: (options: readonly Option[]) => void) => {
			setTimeout(() => callback(OPTIONS), 200);
		},
	);
	render(<AsyncCreatable testId={testId} loadOptions={loadOptionsSpy} />);
	const input = screen.getByTestId(`${testId}-select--input`);
	await userEvent.type(input!, 'a');

	// to show a loading message while loading options
	expect(screen.getByTestId(`${testId}-select--listbox-container`)!).toHaveTextContent(
		'Loading...',
	);
	await waitFor(() => {
		// show create options once options are loaded
		expect(screen.getByRole('option', { name: 'Create "a"' })).toBeInTheDocument();
	});
});
