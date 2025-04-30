import React from 'react';

import { act, fireEvent, render, screen } from '@testing-library/react';

import { fg } from '@atlaskit/platform-feature-flags';

import Tooltip from '../../tooltip';

jest.mock('@atlaskit/platform-feature-flags');
const mockGetBooleanFF = fg as jest.MockedFunction<typeof fg>;

describe('test nested tooltip', () => {
	beforeEach(() => {
		mockGetBooleanFF.mockImplementation((key) => key === 'platform-tooltip-focus-visible');
		HTMLElement.prototype.matches = jest.fn().mockReturnValue(true);

		jest.useFakeTimers();
	});

	afterEach(() => {
		jest.useRealTimers();
	});

	it('should allow tooltips to be nested', () => {
		render(
			<Tooltip content="outer" testId="tooltip--outer">
				<div data-testid="outer">
					<h4>Hi there, I am the outer content</h4>
					<Tooltip content="inner" testId="tooltip--inner">
						<div data-testid="inner">inner</div>
					</Tooltip>
				</div>
			</Tooltip>,
		);

		const outerTrigger = screen.getByTestId('outer');
		const innerTrigger = screen.getByTestId('inner');

		// Trigger showing outer tooltip
		fireEvent.mouseOver(outerTrigger);
		act(() => {
			jest.runAllTimers();
		});
		expect(screen.getByTestId('tooltip--outer')).toBeInTheDocument();
		expect(screen.queryByTestId('tooltip--inner')).not.toBeInTheDocument();

		// Trigger showing inner tooltip
		fireEvent.mouseOver(innerTrigger);
		act(() => {
			jest.runAllTimers();
		});
		expect(screen.getByTestId('tooltip--inner')).toBeInTheDocument();
		expect(screen.queryByTestId('tooltip--outer')).not.toBeInTheDocument();

		// Leave both triggers causes both tooltips to not be visible
		fireEvent.mouseOut(innerTrigger);

		// Note: `jest.advanceAllTimers()` not working for react@18.
		// `jest.advanceAllTimers()` is not flushing the timeout
		// scheduled in an effect inside `Motion`.
		// Seems to be an interplay
		// between`act` + nested effects + microtasks (which setState uses in react@18)
		act(() => {
			jest.runOnlyPendingTimers();
		});
		// flush motion timeout
		act(() => {
			jest.runOnlyPendingTimers();
		});

		expect(screen.queryByTestId('tooltip--inner')).not.toBeInTheDocument();
		expect(screen.queryByTestId('tooltip--outer')).not.toBeInTheDocument();
	});

	it('the outer tooltip should not close if the inner tooltip has canAppear: false', () => {
		render(
			<Tooltip content="outer" testId="tooltip--outer">
				<div data-testid="outer">
					<h4>Hi there, I am the outer content</h4>
					<Tooltip content="inner" testId="tooltip--inner" canAppear={() => false}>
						<div data-testid="inner">inner</div>
					</Tooltip>
				</div>
			</Tooltip>,
		);

		const outerTrigger = screen.getByTestId('outer');
		const innerTrigger = screen.getByTestId('inner');

		// Trigger showing outer tooltip
		fireEvent.mouseOver(outerTrigger);
		act(() => {
			jest.runAllTimers();
		});
		expect(screen.getByTestId('tooltip--outer')).toBeInTheDocument();
		expect(screen.queryByTestId('tooltip--inner')).not.toBeInTheDocument();

		// Trigger showing inner tooltip
		fireEvent.mouseOver(innerTrigger);
		act(() => {
			jest.runAllTimers();
		});
		// Outer tooltip still being displayed
		expect(screen.getByTestId('tooltip--outer')).toBeInTheDocument();
		expect(screen.queryByTestId('tooltip--inner')).not.toBeInTheDocument();

		// Leave inner trigger - outer tooltip should still be open
		fireEvent.mouseOut(innerTrigger);
		act(() => {
			jest.runAllTimers();
		});
		expect(screen.getByTestId('tooltip--outer')).toBeInTheDocument();
		expect(screen.queryByTestId('tooltip--inner')).not.toBeInTheDocument();

		// Leave outer trigger - outer tooltip will be gone now too
		fireEvent.mouseOut(outerTrigger);

		// Note: `jest.advanceAllTimers()` not working for react@18.
		// `jest.advanceAllTimers()` is not flushing the timeout
		// scheduled in an effect inside `Motion`.
		// Seems to be an interplay
		// between`act` + nested effects + microtasks (which setState uses in react@18)
		act(() => {
			jest.runOnlyPendingTimers();
		});
		// flush motion timeout
		act(() => {
			jest.runOnlyPendingTimers();
		});

		expect(screen.queryByTestId('tooltip--inner')).not.toBeInTheDocument();
		expect(screen.queryByTestId('tooltip--outer')).not.toBeInTheDocument();
	});
});
