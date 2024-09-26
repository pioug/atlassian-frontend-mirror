/* eslint-disable testing-library/no-container,testing-library/no-node-access */
import React from 'react';

import { render, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import AsyncCreatable from '../../async-creatable';

import { type Option, OPTIONS } from './constants.mock';

test('defaults - snapshot', () => {
	const { container } = render(<AsyncCreatable />);
	expect(container).toMatchSnapshot();
});

test('creates an inner Select', () => {
	const { container } = render(
		// eslint-disable-next-line @atlaskit/ui-styling-standard/no-classname-prop
		<AsyncCreatable className="react-select" classNamePrefix="react-select" />,
	);
	expect(container.querySelector('.react-select')).toBeInTheDocument();
});

test('render decorated select with props passed', () => {
	const { container } = render(
		// eslint-disable-next-line @atlaskit/ui-styling-standard/no-classname-prop
		<AsyncCreatable className="foo" classNamePrefix="foo" />,
	);
	expect(container.querySelector('.foo')).toBeInTheDocument();
});

test('to show the create option in menu', async () => {
	let { container, rerender } = render(<AsyncCreatable classNamePrefix="react-select" />);
	let input = container.querySelector('input.react-select__input');
	rerender(<AsyncCreatable classNamePrefix="react-select" inputValue="a" />);
	await userEvent.type(input!, 'a');
	expect(container.querySelector('.react-select__option')!).toHaveTextContent('Create "a"');
});

test('to show loading and then create option in menu', async () => {
	let loadOptionsSpy = jest.fn(
		(inputValue: string, callback: (options: readonly Option[]) => void) => {
			setTimeout(() => callback(OPTIONS), 200);
		},
	);
	let { container } = render(
		<AsyncCreatable classNamePrefix="react-select" loadOptions={loadOptionsSpy} />,
	);
	let input = container.querySelector('input.react-select__input');
	await userEvent.type(input!, 'a');

	// to show a loading message while loading options
	expect(container.querySelector('.react-select__menu')!).toHaveTextContent('Loading...');
	await waitFor(() => {
		// show create options once options are loaded
		let options = container.querySelectorAll('.react-select__option');
		expect(options[options.length - 1]).toHaveTextContent('Create "a"');
	});
});
