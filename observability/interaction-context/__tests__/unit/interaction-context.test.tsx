import React, { useContext, useLayoutEffect } from 'react';

import { fireEvent, render, screen } from '@testing-library/react';

import InteractionContext, { type InteractionContextType } from '../../src';

describe('InteractionContext', () => {
	let contextValue: InteractionContextType;

	beforeEach(() => {
		contextValue = {
			hold: jest.fn(),
			tracePress: jest.fn(),
		};
	});

	it('should provide hold and tracePress functions', async () => {
		const TestComponent = () => {
			const context = useContext(InteractionContext);
			expect(context).toBeDefined();
			expect(typeof context?.hold).toBe('function');
			expect(typeof context?.tracePress).toBe('function');
			return null;
		};

		render(
			<InteractionContext.Provider value={contextValue}>
				<TestComponent />
			</InteractionContext.Provider>,
		);

		await expect(document.body).toBeAccessible();
	});

	it('should call hold function with correct name', async () => {
		const testName = 'testHold';
		const TestComponent = () => {
			const context = useContext(InteractionContext);
			useLayoutEffect(() => {
				context?.hold(testName);
			}, [context]);
			return null;
		};

		render(
			<InteractionContext.Provider value={contextValue}>
				<TestComponent />
			</InteractionContext.Provider>,
		);

		expect(contextValue.hold).toHaveBeenCalledWith(testName);

		await expect(document.body).toBeAccessible();
	});

	it('should call tracePress function with correct name and timestamp', async () => {
		const testName = 'testPress';
		const timestamp = Date.now();
		const TestComponent = () => {
			const context = useContext(InteractionContext);
			const handleClick = () => {
				context?.tracePress(testName, timestamp);
			};
			return <button onClick={handleClick}>Click me</button>;
		};

		render(
			<InteractionContext.Provider value={contextValue}>
				<TestComponent />
			</InteractionContext.Provider>,
		);

		fireEvent.click(screen.getByText('Click me'));

		expect(contextValue.tracePress).toHaveBeenCalledWith(testName, timestamp);

		await expect(document.body).toBeAccessible();
	});
});
