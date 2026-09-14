import React, { Fragment } from 'react';

import { ffTest } from '@atlassian/feature-flags-test-utils';
import { act, fireEvent, render, screen, userEvent } from '@atlassian/testing-library';

import Tooltip from '../../tooltip';

const createUser = () => userEvent.setup({ advanceTimers: jest.advanceTimersByTime });

function runAllTimers() {
	act(() => {
		jest.runAllTimers();
	});
}

/**
 * The trigger has an element child, like real triggers do (`@atlaskit/button/new`
 * renders a `<span>` for its label). That child is what makes a second
 * `mouseover` possible while the pointer stays inside the trigger. The `after`
 * button gives keyboard tests somewhere to Tab to.
 */
function renderTooltip(props: { hideTooltipOnMouseDown?: boolean } = {}) {
	return render(
		<Fragment>
			<Tooltip testId="tooltip" content="hello world" {...props}>
				<button data-testid="trigger" type="button">
					<span data-testid="trigger-label">focus me</span>
				</button>
			</Tooltip>
			<button data-testid="after" type="button">
				after
			</button>
		</Fragment>,
	);
}

// Light dismiss records the press here but does not act on it yet.
function pressTrigger() {
	const trigger = screen.getByTestId('trigger');
	fireEvent.pointerDown(trigger);
	fireEvent.mouseDown(trigger);
}

// The release, where native light dismiss hides the popover.
function releaseTrigger() {
	const trigger = screen.getByTestId('trigger');
	fireEvent.pointerUp(trigger);
	fireEvent.mouseUp(trigger);
	fireEvent.click(trigger);
}

// Pointer crosses from the trigger's own box onto the label inside it, without
// ever leaving the trigger.
function crossBoundaryInsideTrigger() {
	fireEvent.mouseOver(screen.getByTestId('trigger-label'), {
		relatedTarget: screen.getByTestId('trigger'),
	});
}

// Pointer leaves the trigger entirely, then comes back.
function leaveAndReEnterTrigger() {
	const outside = screen.getByTestId('after');
	fireEvent.mouseOut(screen.getByTestId('trigger'), { relatedTarget: outside });
	fireEvent.mouseOver(screen.getByTestId('trigger-label'), { relatedTarget: outside });
}

// eslint-disable-next-line @atlassian/a11y/require-jest-coverage
ffTest.on('platform-dst-top-layer-tooltip', 'Tooltip pointer dismissal (top-layer)', () => {
	beforeEach(() => {
		jest.useFakeTimers();
	});

	afterEach(() => {
		// Ensure any ongoing drag is finished
		fireEvent.dragEnd(window);
		jest.useRealTimers();
	});

	it('should stay visible while the press is held, and be dismissed on release', async () => {
		const user = createUser();
		renderTooltip();

		await user.hover(screen.getByTestId('trigger'));
		runAllTimers();
		expect(screen.getByTestId('tooltip')).toBeInTheDocument();

		pressTrigger();
		runAllTimers();

		// Light dismiss hides on pointerup, so a held press stays visible.
		expect(screen.getByTestId('tooltip')).toBeInTheDocument();

		releaseTrigger();
		runAllTimers();

		expect(screen.queryByTestId('tooltip')).not.toBeInTheDocument();
	});

	it('should not re-show when the pointer moves inside the trigger after a dismissal', async () => {
		const user = createUser();
		renderTooltip();

		await user.hover(screen.getByTestId('trigger'));
		runAllTimers();
		expect(screen.getByTestId('tooltip')).toBeInTheDocument();

		pressTrigger();
		releaseTrigger();
		runAllTimers();
		expect(screen.queryByTestId('tooltip')).not.toBeInTheDocument();

		crossBoundaryInsideTrigger();
		runAllTimers();

		expect(screen.queryByTestId('tooltip')).not.toBeInTheDocument();
	});

	it('should show again once the pointer leaves the trigger and comes back', async () => {
		const user = createUser();
		renderTooltip();

		await user.hover(screen.getByTestId('trigger'));
		runAllTimers();

		pressTrigger();
		releaseTrigger();
		runAllTimers();
		expect(screen.queryByTestId('tooltip')).not.toBeInTheDocument();

		crossBoundaryInsideTrigger();
		runAllTimers();
		expect(screen.queryByTestId('tooltip')).not.toBeInTheDocument();

		leaveAndReEnterTrigger();
		runAllTimers();

		expect(screen.getByTestId('tooltip')).toHaveTextContent('hello world');
	});

	it('should not show a tooltip when the press lands before the show delay has elapsed', async () => {
		const user = createUser();
		renderTooltip();

		await user.hover(screen.getByTestId('trigger'));
		act(() => {
			jest.advanceTimersByTime(100);
		});
		// Show is scheduled but has not landed, so there is no popover to dismiss.
		expect(screen.queryByTestId('tooltip')).not.toBeInTheDocument();

		pressTrigger();
		releaseTrigger();
		runAllTimers();

		expect(screen.queryByTestId('tooltip')).not.toBeInTheDocument();
	});

	it('should still show on keyboard focus after a press dismissal', async () => {
		const user = createUser();
		renderTooltip();

		await user.hover(screen.getByTestId('trigger'));
		runAllTimers();

		pressTrigger();
		releaseTrigger();
		runAllTimers();
		expect(screen.queryByTestId('tooltip')).not.toBeInTheDocument();

		// `fireEvent` does not move focus like a real `mousedown`, so put focus where
		// the browser would have. Programmatic focus is not `:focus-visible`, so this
		// does not show the tooltip on its own.
		act(() => {
			screen.getByTestId('trigger').focus();
		});
		expect(screen.getByTestId('trigger')).toHaveFocus();
		runAllTimers();
		expect(screen.queryByTestId('tooltip')).not.toBeInTheDocument();

		// Focus leaving and returning ends the dismissal, pointer never moved.
		await user.tab();
		expect(screen.getByTestId('after')).toHaveFocus();

		await user.tab({ shift: true });
		expect(screen.getByTestId('trigger')).toHaveFocus();
		runAllTimers();

		expect(screen.getByTestId('tooltip')).toHaveTextContent('hello world');
	});

	it('should keep honouring hideTooltipOnMouseDown by hiding before the release', async () => {
		const user = createUser();
		renderTooltip({ hideTooltipOnMouseDown: true });

		await user.hover(screen.getByTestId('trigger'));
		runAllTimers();
		expect(screen.getByTestId('tooltip')).toBeInTheDocument();

		pressTrigger();
		runAllTimers();

		expect(screen.queryByTestId('tooltip')).not.toBeInTheDocument();

		releaseTrigger();
		crossBoundaryInsideTrigger();
		runAllTimers();

		expect(screen.queryByTestId('tooltip')).not.toBeInTheDocument();
	});
});

// eslint-disable-next-line @atlassian/a11y/require-jest-coverage
ffTest.off('platform-dst-top-layer-tooltip', 'Tooltip pointer dismissal (legacy)', () => {
	beforeEach(() => {
		jest.useFakeTimers();
	});

	afterEach(() => {
		// Ensure any ongoing drag is finished
		fireEvent.dragEnd(window);
		jest.useRealTimers();
	});

	// No native dismissal on the legacy path, so a press must leave the tooltip
	// alone unless the `hideTooltipOn*` props say otherwise.
	it('should remain visible through a press and release', async () => {
		const user = createUser();
		renderTooltip();

		await user.hover(screen.getByTestId('trigger'));
		runAllTimers();
		expect(screen.getByTestId('tooltip')).toBeInTheDocument();

		pressTrigger();
		releaseTrigger();
		runAllTimers();

		expect(screen.getByTestId('tooltip')).toHaveTextContent('hello world');

		crossBoundaryInsideTrigger();
		runAllTimers();

		expect(screen.getByTestId('tooltip')).toHaveTextContent('hello world');
	});
});
