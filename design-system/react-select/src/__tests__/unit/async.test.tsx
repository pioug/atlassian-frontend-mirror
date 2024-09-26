/* eslint-disable @atlaskit/ui-styling-standard/no-classname-prop */
/* eslint-disable testing-library/no-container,testing-library/no-node-access */
import React from 'react';

import { act, fireEvent, render, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import cases from 'jest-in-case';

import Async from '../../async';

import { type Option, OPTIONS } from './constants.mock';

test('defaults - snapshot', () => {
	const { container } = render(<Async />);
	expect(container).toMatchSnapshot();
});

/**
 * loadOptions with promise is not resolved and it renders loading options
 * confirmed by logging in component that loadOptions is resolved and options are available
 * but still loading options is rendered
 */
cases(
	'load option prop with defaultOptions true',
	async ({ props, expectOptionLength }: any) => {
		const { container } = render(<Async classNamePrefix="react-select" menuIsOpen {...props} />);

		await waitFor(() => {
			expect(container.querySelectorAll('.react-select__option').length).toBe(expectOptionLength);
		});
	},
	{
		'with callback  > should resolve options': {
			props: {
				defaultOptions: true,
				loadOptions: (inputValue: string, callBack: (options: readonly Option[]) => void) =>
					callBack([OPTIONS[0]]),
			},
			expectOptionLength: 1,
		},
		'with promise  > should resolve options': {
			props: {
				defaultOptions: true,
				loadOptions: () => Promise.resolve([OPTIONS[0]]),
			},
			expectOptionLength: 1,
		},
	},
);

test('load options prop with defaultOptions true and inputValue prop', () => {
	const loadOptionsSpy = jest.fn((value) => value);
	const searchString = 'hello world';
	render(<Async loadOptions={loadOptionsSpy} defaultOptions inputValue={searchString} />);
	expect(loadOptionsSpy).toHaveReturnedWith(searchString);
});

/**
 * loadOptions with promise is not resolved and it renders loading options
 * confirmed by logging in component that loadOptions is resolved and options are available
 * but still loading options is rendered
 */
cases(
	'load options props with no default options',
	async ({ props, expectloadOptionsLength }: any) => {
		let { container } = render(<Async classNamePrefix="react-select" {...props} />);
		let input = container.querySelector('input.react-select__input');
		await userEvent.type(input!, 'a');
		await waitFor(() => {
			expect(container.querySelectorAll('.react-select__option').length).toBe(
				expectloadOptionsLength,
			);
		});
	},
	{
		'with callback > should resolve the options': {
			props: {
				loadOptions: (inputValue: string, callBack: (options: readonly Option[]) => void) =>
					callBack(OPTIONS),
			},
			expectloadOptionsLength: 17,
		},
		'with promise > should resolve the options': {
			props: {
				loadOptions: () => Promise.resolve(OPTIONS),
			},
			expectloadOptionsLength: 17,
		},
	},
);

test('to not call loadOptions again for same value when cacheOptions is true', () => {
	let loadOptionsSpy = jest.fn((_, callback) => callback([]));
	let { container } = render(
		<Async
			className="react-select"
			classNamePrefix="react-select"
			loadOptions={loadOptionsSpy}
			cacheOptions
		/>,
	);
	let input = container.querySelector('input.react-select__input');

	fireEvent.input(input!, {
		target: {
			value: 'foo',
		},
		bubbles: true,
		cancelable: true,
	});
	fireEvent.input(input!, {
		target: {
			value: 'bar',
		},
		bubbles: true,
		cancelable: true,
	});
	fireEvent.input(input!, {
		target: {
			value: 'foo',
		},
		bubbles: true,
		cancelable: true,
	});
	expect(loadOptionsSpy).toHaveBeenCalledTimes(2);
});

test('to create new cache for each instance', async () => {
	let loadOptionsOne = jest.fn();
	let { container: containerOne } = render(
		<Async classNamePrefix="react-select" cacheOptions menuIsOpen loadOptions={loadOptionsOne} />,
	);
	await userEvent.type(containerOne.querySelector('input.react-select__input')!, 'a');

	let loadOptionsTwo = jest.fn();
	let { container: containerTwo } = render(
		<Async classNamePrefix="react-select" cacheOptions menuIsOpen loadOptions={loadOptionsTwo} />,
	);

	await userEvent.type(containerTwo.querySelector('input.react-select__input')!, 'a');

	expect(loadOptionsOne).toHaveBeenCalled();
	expect(loadOptionsTwo).toHaveBeenCalled();
});

test('in case of callbacks display the most recently-requested loaded options (if results are returned out of order)', () => {
	let callbacks: ((options: readonly Option[]) => void)[] = [];
	const loadOptions = (inputValue: string, callback: (options: readonly Option[]) => void) => {
		callbacks.push(callback);
	};
	let { container } = render(
		<Async className="react-select" classNamePrefix="react-select" loadOptions={loadOptions} />,
	);

	let input = container.querySelector('input.react-select__input');
	fireEvent.input(input!, {
		target: {
			value: 'foo',
		},
		bubbles: true,
		cancelable: true,
	});
	fireEvent.input(input!, {
		target: {
			value: 'bar',
		},
		bubbles: true,
		cancelable: true,
	});
	expect(container.querySelector('.react-select__option')).toBeFalsy();
	act(() => {
		callbacks[1]([{ value: 'bar', label: 'bar' }]);
	});
	act(() => {
		callbacks[0]([{ value: 'foo', label: 'foo' }]);
	});
	expect(container.querySelector('.react-select__option')!).toHaveTextContent('bar');
});

// QUESTION: we currently do not do this, do we want to?
test.skip('in case of callbacks should handle an error by setting options to an empty array', () => {
	const loadOptions = (inputValue: string, callback: (options: readonly Option[]) => void) => {
		// @ts-ignore
		callback(new Error('error'));
	};
	let { container } = render(
		<Async
			className="react-select"
			classNamePrefix="react-select"
			loadOptions={loadOptions}
			options={OPTIONS}
		/>,
	);
	let input = container.querySelector('input.react-select__input');
	fireEvent.input(input!, {
		target: {
			value: 'foo',
		},
		bubbles: true,
		cancelable: true,
	});
	expect(container.querySelectorAll('.react-select__option').length).toBe(0);
});
