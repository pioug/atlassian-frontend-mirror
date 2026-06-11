import React, { useRef } from 'react';

import { render, screen } from '@atlassian/testing-library';

import { type TPhase } from '../../src/internal/use-animated-visibility';
import { useFocusWrap } from '../../src/internal/use-focus-wrap';

/**
 * Smoke tests for `useFocusWrap`. The wrap-forward / wrap-back Tab cycling
 * is covered in the Playwright suite where a real browser implements
 * `:focus` correctly.
 */
function FocusWrapHarness({
	children,
	phase = 'open',
}: {
	children: React.ReactNode;
	phase?: TPhase;
}) {
	const ref = useRef<HTMLDivElement>(null);
	// `useFocusWrap` only attaches its listener when the role requires
	// wrapping (`dialog` is the canonical case) AND `phase !== 'closed'`.
	useFocusWrap({
		elementRef: ref,
		role: 'dialog',
		phase,
	});

	return (
		<div>
			<button type="button" data-testid="outside-before">
				outside before
			</button>
			<div ref={ref} data-testid="container">
				{children}
			</div>
			<button type="button" data-testid="outside-after">
				outside after
			</button>
		</div>
	);
}

describe('useFocusWrap', () => {
	it('should be accessible', async () => {
		const { container } = render(
			<FocusWrapHarness>
				<button type="button">inner</button>
			</FocusWrapHarness>,
		);
		await expect(container).toBeAccessible();
	});

	it('does NOT intercept non-Tab keys', () => {
		render(
			<FocusWrapHarness>
				<button type="button" data-testid="inner-a">
					A
				</button>
			</FocusWrapHarness>,
		);

		const event = new KeyboardEvent('keydown', {
			key: 'Enter',
			bubbles: true,
			cancelable: true,
		});
		screen.getByTestId('container').dispatchEvent(event);

		expect(event.defaultPrevented).toBe(false);
	});

	it('does NOT attach the Tab listener when phase is closed', () => {
		render(
			<FocusWrapHarness phase="closed">
				<button type="button" data-testid="inner-a">
					A
				</button>
			</FocusWrapHarness>,
		);

		const event = new KeyboardEvent('keydown', {
			key: 'Tab',
			bubbles: true,
			cancelable: true,
		});
		screen.getByTestId('container').dispatchEvent(event);

		// No listener bound, so `preventDefault` is never called.
		expect(event.defaultPrevented).toBe(false);
	});

	it('attaches the Tab listener during exiting phase (regression guard)', () => {
		// WCAG 2.4.3 regression: during animated exit, `isOpen` flips to
		// `false` while the dialog is still on screen. Tab must still be
		// trapped. `phase === 'exiting'` represents this window.
		render(
			<FocusWrapHarness phase="exiting">
				<button type="button" data-testid="inner-a">
					A
				</button>
			</FocusWrapHarness>,
		);

		const event = new KeyboardEvent('keydown', {
			key: 'Tab',
			bubbles: true,
			cancelable: true,
		});
		screen.getByTestId('container').dispatchEvent(event);

		// Listener IS bound during exiting, so the Tab keydown is intercepted.
		expect(event.defaultPrevented).toBe(true);
	});
});
