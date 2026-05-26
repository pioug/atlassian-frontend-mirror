import React, { useState } from 'react';

import { act, render, screen, userEvent } from '@atlassian/testing-library';

import { slideAndFade } from '../../src/entry-points/animations';
import { Popup } from '../../src/entry-points/popup';
import * as reducedMotion from '../../src/internal/reduced-motion';

const animation = slideAndFade();

function TestPopupTriggerFunction({
	isDefaultOpen,
	shouldAnimate = true,
}: {
	isDefaultOpen: boolean;
	shouldAnimate?: boolean;
}) {
	const [isOpen, setIsOpen] = useState(isDefaultOpen);
	return (
		<Popup
			placement={{ axis: 'block', edge: 'end', align: 'center' }}
			onClose={() => setIsOpen(false)}
		>
			<Popup.TriggerFunction>
				{({ ref, ariaAttributes }) => (
					<button
						ref={ref}
						{...ariaAttributes}
						type="button"
						data-testid="trigger"
						onClick={() => setIsOpen((val) => !val)}
					>
						Toggle
					</button>
				)}
			</Popup.TriggerFunction>
			<Popup.Content
				isOpen={isOpen}
				animate={shouldAnimate ? animation : undefined}
				role="dialog"
				label="content"
			>
				<div>Popup content</div>
			</Popup.Content>
		</Popup>
	);
}

function TestPopupTriggerRegular({
	isDefaultOpen,
	shouldAnimate = true,
}: {
	isDefaultOpen: boolean;
	shouldAnimate?: boolean;
}) {
	const [isOpen, setIsOpen] = useState(isDefaultOpen);
	return (
		<Popup
			placement={{ axis: 'block', edge: 'end', align: 'center' }}
			onClose={() => setIsOpen(false)}
		>
			<Popup.Trigger>
				<button type="button" data-testid="trigger" onClick={() => setIsOpen((val) => !val)}>
					Toggle
				</button>
			</Popup.Trigger>
			<Popup.Content
				isOpen={isOpen}
				animate={shouldAnimate ? animation : undefined}
				role="dialog"
				label="content"
			>
				<div>Popup content</div>
			</Popup.Content>
		</Popup>
	);
}

const triggerVariants: Array<
	[string, typeof TestPopupTriggerFunction | typeof TestPopupTriggerRegular]
> = [
	['Popup.TriggerFunction', TestPopupTriggerFunction],
	['Popup.Trigger', TestPopupTriggerRegular],
];

describe.each(triggerVariants)('%s aria-expanded', (_name, TestComponent) => {
	beforeEach(() => {
		// In JSDOM there are no CSS transitions, so onExitFinish is driven by a
		// fallback timeout. We use fake timers to control when it fires.
		jest.useFakeTimers();
	});

	afterEach(() => {
		jest.useRealTimers();
		jest.restoreAllMocks();
	});

	it('should capture and report a11y violations', async () => {
		jest.useRealTimers(); // toBeAccessible requires real timers
		const { container } = render(<TestComponent isDefaultOpen={false} />);
		await expect(container).toBeAccessible();
	});

	it('aria-expanded should be false when popup is closed', () => {
		render(<TestComponent isDefaultOpen={false} />);

		expect(screen.getByTestId('trigger')).toHaveAttribute('aria-expanded', 'false');
	});

	it('aria-expanded should be true when popup is open', () => {
		render(<TestComponent isDefaultOpen={true} />);

		expect(screen.getByTestId('trigger')).toHaveAttribute('aria-expanded', 'true');
	});

	it('aria-expanded should be true during entry animation and remain true once open', async () => {
		// aria-expanded should be true as soon as the popup begins opening
		// (popupState: 'animating-open') and stay true once fully open ('open').
		const user = userEvent.setup({ advanceTimers: jest.advanceTimersByTime });
		render(<TestComponent isDefaultOpen={false} />);

		const trigger = screen.getByTestId('trigger');
		expect(trigger).toHaveAttribute('aria-expanded', 'false');

		// Open the popup.
		// With fake timers, the React scheduler is timer-based, so state updates from
		// native DOM events (toggle) are only flushed when timers advance.
		// Running timers also triggers onEnterFinish (popupState → 'open').
		// aria-expanded should be true in both 'animating-open' and 'open' states.
		await user.click(trigger);
		act(() => jest.runAllTimers());

		// aria-expanded is true once the popup is open (covers both 'animating-open' and 'open')
		expect(trigger).toHaveAttribute('aria-expanded', 'true');
	});

	it('aria-expanded should stay true during exit animation and go false only after animation completes', async () => {
		// aria-expanded should only go false after the exit animation completes.
		// Updating it immediately when the popup begins closing would cause screen
		// readers to announce the popup as closed while it is still visually
		// present on screen.
		const user = userEvent.setup({ advanceTimers: jest.advanceTimersByTime });
		render(<TestComponent isDefaultOpen={true} />);

		const trigger = screen.getByTestId('trigger');
		expect(trigger).toHaveAttribute('aria-expanded', 'true');

		// Close the popup
		await user.click(trigger);

		// aria-expanded stays true during the exit animation
		expect(trigger).toHaveAttribute('aria-expanded', 'true');

		// Run all pending timers to trigger onExitFinish
		act(() => jest.runAllTimers());

		// Now onExitFinish has fired and aria-expanded should be false
		expect(trigger).toHaveAttribute('aria-expanded', 'false');
	});

	it('aria-expanded completes a full open+close cycle correctly without animation', async () => {
		const user = userEvent.setup({ advanceTimers: jest.advanceTimersByTime });
		render(<TestComponent isDefaultOpen={false} shouldAnimate={false} />);

		const trigger = screen.getByTestId('trigger');

		// Initial state
		expect(trigger).toHaveAttribute('aria-expanded', 'false');

		// Open — non-animated: onEnterFinish fires immediately, popupState → 'open'
		await user.click(trigger);
		expect(trigger).toHaveAttribute('aria-expanded', 'true');

		// Close — non-animated: onExitFinish fires immediately, popupState → 'closed'
		await user.click(trigger);
		expect(trigger).toHaveAttribute('aria-expanded', 'false');

		// Second open — verify the cycle repeats correctly
		await user.click(trigger);
		expect(trigger).toHaveAttribute('aria-expanded', 'true');
	});

	it('aria-expanded completes a full open+close cycle correctly with animation', async () => {
		const user = userEvent.setup({ advanceTimers: jest.advanceTimersByTime });
		render(<TestComponent isDefaultOpen={false} shouldAnimate />);

		const trigger = screen.getByTestId('trigger');

		// Initial state
		expect(trigger).toHaveAttribute('aria-expanded', 'false');

		// Open
		await user.click(trigger);
		act(() => jest.runAllTimers());
		expect(trigger).toHaveAttribute('aria-expanded', 'true');

		// Close
		await user.click(trigger);
		act(() => jest.runAllTimers());
		expect(trigger).toHaveAttribute('aria-expanded', 'false');

		// Second open — verify the cycle repeats correctly
		await user.click(trigger);
		act(() => jest.runAllTimers());
		expect(trigger).toHaveAttribute('aria-expanded', 'true');
	});

	it('aria-expanded goes false immediately on close with reduced motion (no timer needed)', async () => {
		// popupState goes directly to 'closed' on close, so aria-expanded goes false immediately — no jest.runAllTimers() needed.
		jest.spyOn(reducedMotion, 'prefersReducedMotion').mockReturnValue(true);

		// Use real userEvent (no advanceTimers) to prove no timers are needed
		const user = userEvent.setup();
		jest.useRealTimers();
		render(<TestComponent isDefaultOpen={false} shouldAnimate />);

		const trigger = screen.getByTestId('trigger');

		await user.click(trigger);
		expect(trigger).toHaveAttribute('aria-expanded', 'true');

		// Close — should go false immediately without advancing any timers
		await user.click(trigger);
		expect(trigger).toHaveAttribute('aria-expanded', 'false');
	});
});
