import React, { Fragment } from 'react';

import { act, fireEvent, render, screen } from '@testing-library/react';

import Tooltip from '../../tooltip';

// eslint-disable-next-line @atlassian/a11y/require-jest-coverage
describe('Multiple tooltips', () => {
	beforeEach(() => {
		HTMLElement.prototype.matches = jest.fn().mockReturnValue(true);

		jest.useFakeTimers();
	});

	afterEach(() => {
		jest.useRealTimers();
	});

	it('should show and hide immediately once one has opened', () => {
		render(
			<Fragment>
				<Tooltip testId="tooltip-A" content="First tooltip">
					<button data-testid="trigger-A" type="button">
						focus me
					</button>
				</Tooltip>
				<Tooltip testId="tooltip-B" content="Second tooltip">
					<button data-testid="trigger-B" type="button">
						focus me
					</button>
				</Tooltip>
			</Fragment>,
		);

		const triggerA = screen.getByTestId('trigger-A');
		const triggerB = screen.getByTestId('trigger-B');
		fireEvent.mouseOver(triggerA);

		act(() => {
			jest.runAllTimers();
		});

		expect(screen.getByTestId('tooltip-A')).toBeInTheDocument();
		expect(screen.queryByTestId('tooltip-B')).not.toBeInTheDocument();

		fireEvent.mouseOver(triggerB);

		expect(screen.queryByTestId('tooltip-A')).not.toBeInTheDocument();
		expect(screen.getByTestId('tooltip-B')).toBeInTheDocument();
	});

	it(`should not show tooltip (A) if it is waiting to be shown and another tooltip (B)
  tries to show itself`, () => {
		render(
			<Fragment>
				<Tooltip testId="tooltip-A" content="First tooltip">
					<button data-testid="trigger-A" type="button">
						focus me
					</button>
				</Tooltip>
				<Tooltip testId="tooltip-B" content="Second tooltip">
					<button data-testid="trigger-B" type="button">
						focus me
					</button>
				</Tooltip>
			</Fragment>,
		);

		const triggerA = screen.getByTestId('trigger-A');
		const triggerB = screen.getByTestId('trigger-B');

		fireEvent.mouseOver(triggerA);
		act(() => {
			// Takes 300ms to change to 'shown' from 'waiting-to-show'
			jest.advanceTimersByTime(290);
		});
		expect(screen.queryByTestId('tooltip-A')).not.toBeInTheDocument();

		fireEvent.mouseOver(triggerB);
		expect(screen.queryByTestId('tooltip-A')).not.toBeInTheDocument();
		expect(screen.queryByTestId('tooltip-B')).not.toBeInTheDocument();
	});

	it(`should immediately hide a tooltip (A) and show a second tooltip (B) if
  the second tooltip (B) is opened while the first tooltip (A) is visible`, () => {
		render(
			<Fragment>
				<Tooltip testId="tooltip-A" content="First tooltip">
					<button data-testid="trigger-A" type="button">
						focus me
					</button>
				</Tooltip>
				<Tooltip testId="tooltip-B" content="Second tooltip">
					<button data-testid="trigger-B" type="button">
						focus me
					</button>
				</Tooltip>
			</Fragment>,
		);

		const triggerA = screen.getByTestId('trigger-A');
		const triggerB = screen.getByTestId('trigger-B');
		fireEvent.mouseOver(triggerA);

		act(() => {
			// Takes 300ms to change to 'shown' from 'waiting-to-show'
			jest.advanceTimersByTime(400);
		});
		expect(screen.getByTestId('tooltip-A')).toBeInTheDocument();

		fireEvent.mouseOver(triggerB);
		expect(screen.queryByTestId('tooltip-A')).not.toBeInTheDocument();
		expect(screen.getByTestId('tooltip-B')).toBeInTheDocument();
	});

	it(`should immediately hide a tooltip (A) and show a second tooltip (B) if the
  second tooltip (B) is opened while the first tooltip (A) is waiting to hide`, () => {
		render(
			<Fragment>
				<Tooltip testId="tooltip-A" content="First tooltip">
					<button data-testid="trigger-A" type="button">
						focus me
					</button>
				</Tooltip>
				<Tooltip testId="tooltip-B" content="Second tooltip">
					<button data-testid="trigger-B" type="button">
						focus me
					</button>
				</Tooltip>
			</Fragment>,
		);

		const triggerA = screen.getByTestId('trigger-A');
		const triggerB = screen.getByTestId('trigger-B');

		// Show tooltip-A
		fireEvent.mouseOver(triggerA);
		act(() => {
			// Takes 300ms to change to 'shown' from 'waiting-to-show'
			jest.runAllTimers();
		});
		expect(screen.getByTestId('tooltip-A')).toBeInTheDocument();

		// Now start the delay to close tooltip-A
		fireEvent.mouseOut(triggerA);
		// Takes 300ms to change to 'waiting-to-hide' from 'hide-animating'
		act(() => {
			jest.advanceTimersByTime(290);
		});
		expect(screen.getByTestId('tooltip-A')).toBeInTheDocument();

		// Show tooltip-B
		fireEvent.mouseOver(triggerB);
		// A immediately gone
		expect(screen.queryByTestId('tooltip-A')).not.toBeInTheDocument();
		// B immediately shown
		expect(screen.getByTestId('tooltip-B')).toBeInTheDocument();
	});

	it(`should immediately hide a tooltip (A) and show a second tooltip (B) if
  the second tooltip (B) is opened while the first tooltip (A) is hiding`, () => {
		render(
			<Fragment>
				<Tooltip testId="tooltip-A" content="First tooltip">
					<button data-testid="trigger-A" type="button">
						focus me
					</button>
				</Tooltip>
				<Tooltip testId="tooltip-B" content="Second tooltip">
					<button data-testid="trigger-B" type="button">
						focus me
					</button>
				</Tooltip>
			</Fragment>,
		);

		const triggerA = screen.getByTestId('trigger-A');
		const triggerB = screen.getByTestId('trigger-B');
		fireEvent.mouseOver(triggerA);

		// Show tooltip-A
		act(() => {
			// Takes 300ms to change to 'shown' from 'waiting-to-show'
			jest.runAllTimers();
		});
		expect(screen.getByTestId('tooltip-A')).toBeInTheDocument();
		fireEvent.mouseOut(triggerA);

		// tooltip-A will be fading out
		act(() => {
			// Takes 300ms to change to 'waiting-to-hide' from 'hide-animating'
			// 10ms is not enough to finish the fadeout
			jest.advanceTimersByTime(310);
		});
		expect(screen.getByTestId('tooltip-A')).toBeInTheDocument();

		// Start showing tooltip-B: A hides straight away, B shows straight away
		fireEvent.mouseOver(triggerB);
		expect(screen.queryByTestId('tooltip-A')).not.toBeInTheDocument();
		expect(screen.getByTestId('tooltip-B')).toBeInTheDocument();
	});
});
