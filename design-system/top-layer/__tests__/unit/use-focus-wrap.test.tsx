import React, { useRef } from 'react';

import { render, screen } from '@atlassian/testing-library';

import { useFocusWrap } from '../../src/internal/use-focus-wrap';

/**
 * Smoke tests for `useFocusWrap`. The wrap-forward / wrap-back Tab cycling
 * is covered in the Playwright suite where a real browser implements
 * `:focus` correctly.
 */
function FocusWrapHarness({ children }: { children: React.ReactNode }) {
	const ref = useRef<HTMLDivElement>(null);
	// `useFocusWrap` only attaches its listener when the role requires
	// wrapping - `dialog` is the canonical case.
	useFocusWrap({ elementRef: ref, role: 'dialog' });

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
});
