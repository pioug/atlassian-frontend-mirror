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
	tall: {
		height: '200vh',
		display: 'flex',
		flexDirection: 'column',
	},
	spacer: {
		flex: 1,
	},
	triggerWrapper: {
		display: 'flex',
		justifyContent: 'center',
		paddingBlockEnd: token('space.100'),
	},
	content: {
		paddingBlock: token('space.200'),
		paddingInline: token('space.200'),
		minHeight: '60px',
	},
});

/**
 * Test fixture for flip behavior.
 * The trigger is placed near the bottom of a tall container.
 * When the viewport is scrolled so the trigger is near the bottom edge,
 * the popover should flip to appear above the trigger.
 */
export default function TestingPopoverFlip(): ReactNode {
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
		isOpen,
	});

	return (
		<div css={styles.tall}>
			<div css={styles.spacer} />
			<div data-testid="trigger-wrapper" css={styles.triggerWrapper}>
				<button ref={triggerRef} onClick={toggle} {...getAriaForTrigger({ role: 'dialog', isOpen, popoverId: popoverId })} type="button" data-testid="popover-trigger">
					Open
				</button>
				<Popover ref={popoverRef} id={popoverId} isOpen={isOpen} onClose={close} role="dialog" label="Flip test">
					<div data-testid="popover-content" css={styles.content}>
						Should flip above trigger when near bottom
					</div>
				</Popover>
			</div>
		</div>
	);
}
