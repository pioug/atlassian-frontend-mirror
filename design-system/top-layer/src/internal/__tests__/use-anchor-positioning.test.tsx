import React, { useRef } from 'react';

import { render, screen } from '@atlassian/testing-library';

import { useAnchorPosition } from '../use-anchor-positioning';

/**
 * Test harness that renders a trigger + popover and wires them through useAnchorPosition.
 */
function Harness({
	placement = {},
}: {
	placement?: Parameters<typeof useAnchorPosition>[0]['placement'];
}) {
	const anchorRef = useRef<HTMLButtonElement | null>(null);
	const popoverRef = useRef<HTMLDivElement | null>(null);

	useAnchorPosition({
		anchorRef,
		popoverRef,
		placement,
		// Force JS fallback so the test doesn't depend on CSS.supports
		forceFallbackPositioning: true,
	});

	return (
		<>
			<button ref={anchorRef} data-testid="trigger">
				trigger
			</button>
			<div ref={popoverRef} data-testid="popover">
				popover
			</div>
		</>
	);
}

describe('useAnchorPosition', () => {
	it('should be accessible', async () => {
		const { container } = render(<Harness />);
		await expect(container).toBeAccessible();
	});

	describe('cleanup', () => {
		it('should remove positioning styles synchronously on unmount', () => {
			const { unmount } = render(<Harness />);

			const popover = screen.getByTestId('popover');

			// The fallback path sets margin and inset styles.
			// JSDOM normalizes '0' → '0px' for shorthand properties like margin.
			expect(popover.style.getPropertyValue('margin')).toBe('0px');
			expect(popover.style.getPropertyValue('inset')).toBe('auto');

			// Unmount — cleanup runs synchronously
			unmount();

			// Styles should be removed immediately after unmount
			expect(popover.style.getPropertyValue('margin')).toBe('');
			expect(popover.style.getPropertyValue('inset')).toBe('');
		});
	});
});
