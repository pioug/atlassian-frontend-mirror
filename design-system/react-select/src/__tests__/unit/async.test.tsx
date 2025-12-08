/* eslint-disable testing-library/prefer-user-event */
import React from 'react';

import { act, fireEvent, render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import cases from 'jest-in-case';

import Async from '../../async';

import { type Option, OPTIONS } from './constants.mock';

const testId = 'react-select';

/**
 * loadOptions with promise is not resolved and it renders loading options
 * confirmed by logging in component that loadOptions is resolved and options are available
 * but still loading options is rendered
 */
cases(
	'load option prop with defaultOptions true',
	async ({ props, expectOptionLength }: any) => {
		render(<Async menuIsOpen {...props} />);

		await waitFor(() => {
			expect(screen.getAllByRole('option').length).toBe(expectOptionLength);
		});
	},
	{
		'with callback  > should resolve options': {
			props: {
				defaultOptions: true,
				loadOptions: (_inputValue: string, callBack: (options: readonly Option[]) => void) =>
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
		render(<Async {...props} />);
		let input = screen.getByTestId(`${testId}-select--input`);
		const user = userEvent.setup();
		await user.type(input!, 'a');
		await waitFor(() => {
			expect(screen.getAllByRole('option').length).toBe(expectloadOptionsLength);
		});
	},
	{
		'with callback > should resolve the options': {
			props: {
				loadOptions: (_inputValue: string, callBack: (options: readonly Option[]) => void) =>
					callBack(OPTIONS),
				testId: testId,
			},
			expectloadOptionsLength: 17,
		},
		'with promise > should resolve the options': {
			props: {
				loadOptions: () => Promise.resolve(OPTIONS),
				testId: testId,
			},
			expectloadOptionsLength: 17,
		},
	},
);

test('to not call loadOptions again for same value when cacheOptions is true', () => {
	let loadOptionsSpy = jest.fn((_, callback) => callback([]));
	render(<Async loadOptions={loadOptionsSpy} cacheOptions testId={testId} />);
	let input = screen.getByTestId(`${testId}-select--input`);

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
	render(<Async cacheOptions menuIsOpen loadOptions={loadOptionsOne} testId={`${testId}-1`} />);
	const user = userEvent.setup();
	await user.type(screen.getByTestId(`${testId}-1-select--input`)!, 'a');

	let loadOptionsTwo = jest.fn();
	render(<Async cacheOptions menuIsOpen loadOptions={loadOptionsTwo} testId={`${testId}-2`} />);

	await user.type(screen.getByTestId(`${testId}-2-select--input`)!, 'a');

	expect(loadOptionsOne).toHaveBeenCalled();
	expect(loadOptionsTwo).toHaveBeenCalled();
});

test('in case of callbacks display the most recently-requested loaded options (if results are returned out of order)', () => {
	let callbacks: ((options: readonly Option[]) => void)[] = [];
	const loadOptions = (_inputValue: string, callback: (options: readonly Option[]) => void) => {
		callbacks.push(callback);
	};
	render(<Async loadOptions={loadOptions} testId={testId} />);

	let input = screen.getByTestId(`${testId}-select--input`)!;
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
	expect(screen.queryByTestId(`${testId}-select--option-0`)).not.toBeInTheDocument();
	act(() => {
		callbacks[1]([{ value: 'bar', label: 'bar' }]);
	});
	act(() => {
		callbacks[0]([{ value: 'foo', label: 'foo' }]);
	});

	expect(screen.getByTestId(`${testId}-select--option-0`)).toHaveTextContent('bar');
});

// QUESTION: we currently do not do this, do we want to?
test.skip('in case of callbacks should handle an error by setting options to an empty array', () => {
	const loadOptions = (_inputValue: string, callback: (options: readonly Option[]) => void) => {
		// @ts-ignore
		callback(new Error('error'));
	};
	render(<Async loadOptions={loadOptions} options={OPTIONS} testId={testId} />);
	let input = screen.getByTestId(`${testId}-select--input`);
	fireEvent.input(input!, {
		target: {
			value: 'foo',
		},
		bubbles: true,
		cancelable: true,
	});
	expect(screen.getAllByRole('option').length).toBe(0);
});

test('should announce NoOptionsMessage', async () => {
	const loadOptions = (_inputValue: string, callBack: (options: readonly Option[]) => void) => {
		setTimeout(() => {
			callBack([]);
		}, 50);
	};
	const baseProps = {
		loadOptions,
		testId,
		menuIsOpen: true,
	};
	const noOptionsMessage = 'No options';
	const setupAndTypeSearch = async () => {
		const user = userEvent.setup();
		const input = screen.getByTestId(`${testId}-select--input`);
		await user.type(input, 'dddddddddd');
	};

	render(<Async {...baseProps} />);

	await setupAndTypeSearch();
	await waitFor(() => {
		expect(screen.getByRole('option', { name: noOptionsMessage })).toBeInTheDocument();
	});
	await waitFor(() => {
		expect(screen.getByRole('status')).toHaveTextContent(noOptionsMessage);
	});
});
