import React, { Fragment } from 'react';

import { act, fireEvent, render } from '@testing-library/react';

import Tooltip from '../../Tooltip';

describe('Multiple tooltips', () => {
	beforeEach(() => {
		jest.useFakeTimers();
	});

	afterEach(() => {
		jest.useRealTimers();
	});

	it('should show and hide immediately once one has opened', () => {
		const { queryByTestId, getByTestId } = render(
			<Fragment>
				<Tooltip testId="tooltip-A" content="First tooltip">
					<button data-testid="trigger-A">focus me</button>
				</Tooltip>
				<Tooltip testId="tooltip-B" content="Second tooltip">
					<button data-testid="trigger-B">focus me</button>
				</Tooltip>
			</Fragment>,
		);

		const triggerA = getByTestId('trigger-A');
		const triggerB = getByTestId('trigger-B');

		act(() => {
			fireEvent.mouseOver(triggerA);
			jest.runAllTimers();
		});

		expect(queryByTestId('tooltip-A')).toBeInTheDocument();
		expect(queryByTestId('tooltip-B')).not.toBeInTheDocument();

		fireEvent.mouseOver(triggerB);

		expect(queryByTestId('tooltip-A')).not.toBeInTheDocument();
		expect(queryByTestId('tooltip-B')).toBeInTheDocument();
	});

	it(`should not show tooltip (A) if it is waiting to be shown and another tooltip (B)
  tries to show itself`, () => {
		const { queryByTestId, getByTestId } = render(
			<Fragment>
				<Tooltip testId="tooltip-A" content="First tooltip">
					<button data-testid="trigger-A">focus me</button>
				</Tooltip>
				<Tooltip testId="tooltip-B" content="Second tooltip">
					<button data-testid="trigger-B">focus me</button>
				</Tooltip>
			</Fragment>,
		);

		const triggerA = getByTestId('trigger-A');
		const triggerB = getByTestId('trigger-B');

		act(() => {
			fireEvent.mouseOver(triggerA);
			// Takes 300ms to change to 'shown' from 'waiting-to-show'
			jest.runTimersToTime(290);
		});
		expect(queryByTestId('tooltip-A')).not.toBeInTheDocument();

		fireEvent.mouseOver(triggerB);
		expect(queryByTestId('tooltip-A')).not.toBeInTheDocument();
		expect(queryByTestId('tooltip-B')).not.toBeInTheDocument();
	});

	it(`should immediately hide a tooltip (A) and show a second tooltip (B) if
  the second tooltip (B) is opened while the first tooltip (A) is visible`, () => {
		const { queryByTestId, getByTestId } = render(
			<Fragment>
				<Tooltip testId="tooltip-A" content="First tooltip">
					<button data-testid="trigger-A">focus me</button>
				</Tooltip>
				<Tooltip testId="tooltip-B" content="Second tooltip">
					<button data-testid="trigger-B">focus me</button>
				</Tooltip>
			</Fragment>,
		);

		const triggerA = getByTestId('trigger-A');
		const triggerB = getByTestId('trigger-B');

		act(() => {
			fireEvent.mouseOver(triggerA);
			// Takes 300ms to change to 'shown' from 'waiting-to-show'
			jest.runTimersToTime(400);
		});
		expect(queryByTestId('tooltip-A')).toBeInTheDocument();

		act(() => {
			fireEvent.mouseOver(triggerB);
		});
		expect(queryByTestId('tooltip-A')).not.toBeInTheDocument();
		expect(queryByTestId('tooltip-B')).toBeInTheDocument();
	});

	it(`should immediately hide a tooltip (A) and show a second tooltip (B) if the
  second tooltip (B) is opened while the first tooltip (A) is waiting to hide`, () => {
		const { queryByTestId, getByTestId } = render(
			<Fragment>
				<Tooltip testId="tooltip-A" content="First tooltip">
					<button data-testid="trigger-A">focus me</button>
				</Tooltip>
				<Tooltip testId="tooltip-B" content="Second tooltip">
					<button data-testid="trigger-B">focus me</button>
				</Tooltip>
			</Fragment>,
		);

		const triggerA = getByTestId('trigger-A');
		const triggerB = getByTestId('trigger-B');

		// Show tooltip-A
		fireEvent.mouseOver(triggerA);
		act(() => {
			// Takes 300ms to change to 'shown' from 'waiting-to-show'
			jest.runAllTimers();
		});
		expect(queryByTestId('tooltip-A')).toBeInTheDocument();

		// Now start the delay to close tooltip-A
		fireEvent.mouseOut(triggerA);
		// Takes 300ms to change to 'waiting-to-hide' from 'hide-animating'
		act(() => {
			jest.runTimersToTime(290);
		});
		expect(queryByTestId('tooltip-A')).toBeInTheDocument();

		// Show tooltip-B
		fireEvent.mouseOver(triggerB);
		// A immediately gone
		expect(queryByTestId('tooltip-A')).not.toBeInTheDocument();
		// B immediately shown
		expect(queryByTestId('tooltip-B')).toBeInTheDocument();
	});

	it(`should immediately hide a tooltip (A) and show a second tooltip (B) if
  the second tooltip (B) is opened while the first tooltip (A) is hiding`, () => {
		const { queryByTestId, getByTestId } = render(
			<Fragment>
				<Tooltip testId="tooltip-A" content="First tooltip">
					<button data-testid="trigger-A">focus me</button>
				</Tooltip>
				<Tooltip testId="tooltip-B" content="Second tooltip">
					<button data-testid="trigger-B">focus me</button>
				</Tooltip>
			</Fragment>,
		);

		const triggerA = getByTestId('trigger-A');
		const triggerB = getByTestId('trigger-B');

		// Show tooltip-A
		act(() => {
			fireEvent.mouseOver(triggerA);
			// Takes 300ms to change to 'shown' from 'waiting-to-show'
			jest.runAllTimers();
		});
		expect(queryByTestId('tooltip-A')).toBeInTheDocument();

		// tooltip-A will be fading out
		act(() => {
			fireEvent.mouseOut(triggerA);
			// Takes 300ms to change to 'waiting-to-hide' from 'hide-animating'
			// 10ms is not enough to finish the fadeout
			jest.runTimersToTime(310);
		});
		expect(queryByTestId('tooltip-A')).toBeInTheDocument();

		// Start showing tooltip-B: A hides straight away, B shows straight away
		fireEvent.mouseOver(triggerB);
		expect(queryByTestId('tooltip-A')).not.toBeInTheDocument();
		expect(queryByTestId('tooltip-B')).toBeInTheDocument();
	});
});
