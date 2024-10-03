import React from 'react';

import { act, fireEvent, render, screen } from '@testing-library/react';

import Tooltip from '../../tooltip';

describe('test nested tooltip', () => {
	beforeEach(() => {
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
		// Flushing delay
		act(() => {
			jest.runOnlyPendingTimers();
		});
		// Flushing motion
		act(() => {
			jest.runOnlyPendingTimers();
		});
		expect(screen.queryByTestId('tooltip--inner')).not.toBeInTheDocument();
		expect(screen.queryByTestId('tooltip--outer')).not.toBeInTheDocument();
	});
});
