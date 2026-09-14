import { fireEvent, render } from '@testing-library/react';
import React from 'react';
import ResultBase from '../../ResultBase';
import { type ResultContextType } from '../../../context';

const createContext = (overrides: Partial<ResultContextType> = {}): ResultContextType => ({
	registerResult: jest.fn(),
	unregisterResult: jest.fn(),
	onMouseEnter: jest.fn(),
	onMouseLeave: jest.fn(),
	sendAnalytics: jest.fn(),
	getIndex: jest.fn(() => null),
	...overrides,
});

describe('Result Base', () => {
	it('should capture and report a11y violations', async () => {
		const { container } = render(
			<ResultBase text="Result" resultId="testResult" type="base" context={createContext()} />,
		);
		await expect(container).toBeAccessible();
	});

	it('should pass { `resultId`,  `type` } to onClick handler', () => {
		const spy = jest.fn();
		const context = createContext();
		const { getByText } = render(
			<ResultBase
				text="Result"
				resultId="testResult"
				type="base"
				onClick={spy}
				context={context}
			/>,
		);
		fireEvent.click(getByText('Result'));
		expect(spy).toHaveBeenCalledWith(
			expect.objectContaining({ resultId: 'testResult', type: 'base' }),
		);
	});

	it('should unregister itself on unmount event', () => {
		const unregisterResult = jest.fn();
		const { unmount } = render(
			<ResultBase
				text="Result"
				resultId="testResult"
				type="base"
				context={createContext({ unregisterResult })}
			/>,
		);
		unmount();

		expect(unregisterResult).toHaveBeenCalledTimes(1);
	});

	it('should register itself on mount event', () => {
		const registerResult = jest.fn();
		render(
			<ResultBase
				text="Result"
				resultId="testResult"
				type="base"
				context={createContext({ registerResult })}
			/>,
		);
		expect(registerResult).toHaveBeenCalledTimes(1);
	});
});
