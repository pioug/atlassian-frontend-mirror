/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import { type ReactNode, useCallback, useRef, useState } from 'react';

import { jsx } from '@compiled/react';

import { cssMap } from '@atlaskit/css';
import { token } from '@atlaskit/tokens';
import { slideAndFade } from '@atlaskit/top-layer/animations';
import { getAriaForTrigger } from '@atlaskit/top-layer/get-aria-for-trigger';
import { Popover } from '@atlaskit/top-layer/popover';
import { useAnchorPosition } from '@atlaskit/top-layer/use-anchor-position';
import { usePopoverId } from '@atlaskit/top-layer/use-popover-id';

const animation = slideAndFade();

const styles = cssMap({
	wrapper: {
		paddingBlock: token('space.800'),
		paddingInline: token('space.800'),
	},
	content: {
		paddingBlock: token('space.200'),
		paddingInline: token('space.200'),
	},
});

/**
 * Test fixture for animation exit lifecycle.
 * Verifies that exit animation completes before the element is hidden from the DOM.
 * Includes a status indicator that reflects whether the popover is open or closed.
 */
export default function TestingAnimationExit(): ReactNode {
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
		<div css={styles.wrapper}>
			<div data-testid="status">{isOpen ? 'open' : 'closed'}</div>
			<button ref={triggerRef} onClick={toggle} {...getAriaForTrigger({ role: 'dialog', isOpen, popoverId: popoverId })} type="button" data-testid="popover-trigger">
				Toggle
			</button>
			<Popover
				ref={popoverRef} id={popoverId} isOpen={isOpen} onClose={close}
				role="dialog"
				label="Animation exit test"
				animate={animation}
				placement={{ edge: 'end' }}
			>
				<div data-testid="popover-content" css={styles.content}>
					Animated content
				</div>
			</Popover>
		</div>
	);
}
