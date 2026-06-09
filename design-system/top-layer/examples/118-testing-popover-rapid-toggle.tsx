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
	wrapper: {
		paddingBlock: token('space.400'),
		paddingInline: token('space.400'),
	},
	content: {
		paddingBlock: token('space.200'),
		paddingInline: token('space.200'),
	},
});

/**
 * Test fixture for rapid toggle behavior.
 * The click-count indicator tracks how many times the trigger has been clicked.
 * After rapid toggling, there should be at most one visible popover (or zero).
 */
export default function TestingPopoverRapidToggle(): ReactNode {
	const [clickCount, setClickCount] = useState(0);
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
		<div css={styles.wrapper}>
			<div data-testid="click-count">{clickCount}</div>
			<button
				ref={triggerRef}
				type="button"
				data-testid="popover-trigger"
				onClick={() => {
					setClickCount((previous) => previous + 1);
					toggle();
				}}
				{...getAriaForTrigger({ role: 'dialog', isOpen, popoverId: popoverId })}
			>
				Toggle
			</button>
			<Popover
				ref={popoverRef}
				id={popoverId}
				role="dialog"
				label="Rapid toggle test"
				isOpen={isOpen}
				onClose={close}
			>
				<div data-testid="popover-content" css={styles.content}>
					Popover content
				</div>
			</Popover>
		</div>
	);
}
