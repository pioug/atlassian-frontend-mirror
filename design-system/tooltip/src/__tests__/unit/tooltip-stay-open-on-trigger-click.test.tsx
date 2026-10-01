import React, { Fragment, useState } from 'react';

import { flushPopoverExit } from '@atlaskit/top-layer/testing/flush-popover-exit';
import { ffTest } from '@atlassian/feature-flags-test-utils/test-runner';
import { act } from '@atlassian/testing-library/act';
import { fireEvent } from '@atlassian/testing-library/fire-event';
import { render } from '@atlassian/testing-library/render';
import { screen } from '@atlassian/testing-library/screen';
import { userEvent } from '@atlassian/testing-library/user-event';

import Tooltip from '../../tooltip';

const createUser = () => userEvent.setup({ advanceTimers: jest.advanceTimersByTime });

function runAllTimers() {
	act(() => {
		jest.runAllTimers();
	});
}

function CopyButton({
	hasNewContentOnTriggerClick,
	hideTooltipOnMouseDown,
	hideTooltipOnClick,
}: {
	hasNewContentOnTriggerClick?: boolean;
	hideTooltipOnMouseDown?: boolean;
	hideTooltipOnClick?: boolean;
}) {
	const [isCopied, setIsCopied] = useState(false);
	return (
		<Fragment>
			<Tooltip
				testId="tooltip"
				content={isCopied ? 'Copied!' : 'Copy'}
				hasNewContentOnTriggerClick={hasNewContentOnTriggerClick}
				hideTooltipOnMouseDown={hideTooltipOnMouseDown}
				hideTooltipOnClick={hideTooltipOnClick}
			>
				<button data-testid="trigger" type="button" onClick={() => setIsCopied(true)}>
					<span data-testid="trigger-label">copy</span>
				</button>
			</Tooltip>
			<button data-testid="after" type="button">
				after
			</button>
		</Fragment>
	);
}

// A full pointer press on the trigger: native light dismiss acts on the release.
function pressAndReleaseTrigger() {
	const trigger = screen.getByTestId('trigger');
	fireEvent.pointerDown(trigger);
	fireEvent.mouseDown(trigger);
	fireEvent.pointerUp(trigger);
	fireEvent.mouseUp(trigger);
	fireEvent.click(trigger);
}

function leaveTrigger() {
	fireEvent.mouseOut(screen.getByTestId('trigger'), {
		relatedTarget: screen.getByTestId('after'),
	});
}

// eslint-disable-next-line @atlassian/a11y/require-jest-coverage
ffTest.on('platform-dst-top-layer-tooltip', 'hasNewContentOnTriggerClick (top-layer)', () => {
	beforeEach(() => {
		jest.useFakeTimers();
	});

	afterEach(() => {
		fireEvent.dragEnd(window);
		jest.useRealTimers();
	});

	it('should close on a press without the prop', async () => {
		const user = createUser();
		render(<CopyButton />);

		await user.hover(screen.getByTestId('trigger'));
		runAllTimers();
		expect(screen.getByTestId('tooltip')).toHaveTextContent('Copy');

		pressAndReleaseTrigger();
		runAllTimers();

		expect(screen.queryByTestId('tooltip')).not.toBeInTheDocument();
	});

	it('should keep a hint popover', async () => {
		const user = createUser();
		render(<CopyButton hasNewContentOnTriggerClick />);

		await user.hover(screen.getByTestId('trigger'));
		runAllTimers();

		expect(screen.getByTestId('tooltip--popover')).toHaveAttribute('popover', 'hint');
	});

	it('should stay open on a press and show the new content', async () => {
		const user = createUser();
		render(<CopyButton hasNewContentOnTriggerClick />);

		await user.hover(screen.getByTestId('trigger'));
		runAllTimers();
		expect(screen.getByTestId('tooltip')).toHaveTextContent('Copy');

		pressAndReleaseTrigger();
		runAllTimers();

		expect(screen.getByTestId('tooltip')).toHaveTextContent('Copied!');
	});

	it('should show the new content when the press lands inside the show delay', async () => {
		const user = createUser();
		render(<CopyButton hasNewContentOnTriggerClick />);

		await user.hover(screen.getByTestId('trigger'));
		pressAndReleaseTrigger();
		runAllTimers();

		expect(screen.getByTestId('tooltip')).toHaveTextContent('Copied!');
	});

	it('should still close when the pointer leaves the trigger', async () => {
		const user = createUser();
		render(<CopyButton hasNewContentOnTriggerClick />);

		await user.hover(screen.getByTestId('trigger'));
		runAllTimers();
		pressAndReleaseTrigger();
		runAllTimers();

		leaveTrigger();
		runAllTimers();
		await flushPopoverExit();

		expect(screen.queryByTestId('tooltip')).not.toBeInTheDocument();
	});

	it('should still close on Escape', async () => {
		const user = createUser();
		render(<CopyButton hasNewContentOnTriggerClick />);

		await user.hover(screen.getByTestId('trigger'));
		runAllTimers();
		pressAndReleaseTrigger();
		runAllTimers();

		await user.keyboard('{Escape}');
		runAllTimers();
		await flushPopoverExit();

		expect(screen.queryByTestId('tooltip')).not.toBeInTheDocument();
	});

	it('should still close on blur', async () => {
		render(<CopyButton hasNewContentOnTriggerClick />);
		const trigger = screen.getByTestId('trigger');

		act(() => {
			trigger.focus();
		});
		fireEvent.focus(trigger);
		runAllTimers();
		expect(screen.getByTestId('tooltip')).toBeInTheDocument();

		act(() => {
			trigger.blur();
		});
		fireEvent.blur(trigger);
		runAllTimers();
		await flushPopoverExit();

		expect(screen.queryByTestId('tooltip')).not.toBeInTheDocument();
	});

	it('should let hideTooltipOnMouseDown win', async () => {
		const user = createUser();
		render(<CopyButton hasNewContentOnTriggerClick hideTooltipOnMouseDown />);

		await user.hover(screen.getByTestId('trigger'));
		runAllTimers();
		pressAndReleaseTrigger();
		runAllTimers();

		expect(screen.queryByTestId('tooltip')).not.toBeInTheDocument();
	});

	it('should let hideTooltipOnClick win', async () => {
		const user = createUser();
		render(<CopyButton hasNewContentOnTriggerClick hideTooltipOnClick />);

		await user.hover(screen.getByTestId('trigger'));
		runAllTimers();
		pressAndReleaseTrigger();
		runAllTimers();
		await flushPopoverExit();

		expect(screen.queryByTestId('tooltip')).not.toBeInTheDocument();
	});
});

// eslint-disable-next-line @atlassian/a11y/require-jest-coverage
ffTest.off('platform-dst-top-layer-tooltip', 'hasNewContentOnTriggerClick (legacy)', () => {
	beforeEach(() => {
		jest.useFakeTimers();
	});

	afterEach(() => {
		fireEvent.dragEnd(window);
		jest.useRealTimers();
	});

	it.each([false, true])(
		'should stay open on a press and show the new content (prop: %s)',
		async (hasNewContentOnTriggerClick) => {
			const user = createUser();
			render(<CopyButton hasNewContentOnTriggerClick={hasNewContentOnTriggerClick} />);

			await user.hover(screen.getByTestId('trigger'));
			runAllTimers();
			pressAndReleaseTrigger();
			runAllTimers();

			expect(screen.getByTestId('tooltip')).toHaveTextContent('Copied!');
		},
	);
});
