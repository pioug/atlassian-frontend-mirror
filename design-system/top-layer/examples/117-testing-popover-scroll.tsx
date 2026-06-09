/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import { type ReactNode, useCallback, useRef, useState } from 'react';

import { jsx } from '@compiled/react';

import { cssMap } from '@atlaskit/css';
import { token } from '@atlaskit/tokens';
import { getAriaForTrigger } from '@atlaskit/top-layer/get-aria-for-trigger';
import { Popover } from '@atlaskit/top-layer/popover';
import { useAnchorPosition } from '@atlaskit/top-layer/use-anchor-position';
import { usePopoverId } from '@atlaskit/top-layer/use-popover-id';

const styles = cssMap({
	scrollContainer: {
		height: '300px',
		overflow: 'auto',
		borderWidth: token('border.width'),
		borderStyle: 'solid',
		borderColor: token('color.border'),
	},
	spacerSmall: {
		height: '100px',
	},
	spacerLarge: {
		height: '600px',
	},
	content: {
		paddingBlock: token('space.200'),
		paddingInline: token('space.200'),
	},
});

/**
 * Test fixture for scroll behavior.
 * The popover is inside a scrollable container.
 * Scrolling should NOT close the popover.
 */
export default function TestingPopoverScroll(): ReactNode {
	const [isOpen, setIsOpen] = useState(false);
	const triggerRef = useRef<HTMLButtonElement>(null);
	const popoverRef = useRef<HTMLDivElement>(null);
	const popoverId = usePopoverId();
	const toggle = useCallback(() => setIsOpen((previous) => !previous), []);
	const close = useCallback(() => setIsOpen(false), []);

	useAnchorPosition({
		anchorRef: triggerRef,
		popoverRef,
		placement: { edge: 'end' },
	});

	return (
		<div data-testid="scroll-container" css={styles.scrollContainer}>
			<div css={styles.spacerSmall} />
			<button
				ref={triggerRef}
				type="button"
				data-testid="popover-trigger"
				onClick={toggle}
				{...getAriaForTrigger({ role: 'dialog', isOpen, popoverId: popoverId })}
			>
				Open
			</button>
			<Popover
				ref={popoverRef}
				id={popoverId}
				role="dialog"
				label="Scroll test"
				isOpen={isOpen}
				onClose={close}
			>
				<div data-testid="popover-content" css={styles.content}>
					Popover content in scrollable container
				</div>
			</Popover>
			<div css={styles.spacerLarge} />
		</div>
	);
}
