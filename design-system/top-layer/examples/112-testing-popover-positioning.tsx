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
	center: {
		display: 'flex',
		alignItems: 'center',
		justifyContent: 'center',
		height: '100vh',
	},
	content: {
		paddingBlock: token('space.200'),
		paddingInline: token('space.200'),
	},
});

/**
 * Test fixture for positioning verification.
 * Trigger is centered in the viewport so there is space in all directions.
 * Query `?axis=inline&edge=start` to change the placement at runtime.
 */
export default function TestingPopoverPositioning(): ReactNode {
	const params = new URLSearchParams(window.location.search);
	const axis = (params.get('axis') ?? 'block') as 'block' | 'inline';
	const edge = (params.get('edge') ?? 'end') as 'start' | 'end';

	const [isOpen, setIsOpen] = useState(false);
	const triggerRef = useRef<HTMLButtonElement>(null);
	const popoverRef = useRef<HTMLDivElement>(null);
	const popoverId = usePopoverId();
	const toggle = useCallback(() => setIsOpen((previous) => !previous), []);
	const close = useCallback(() => setIsOpen(false), []);

	useAnchorPosition({
		anchorRef: triggerRef,
		popoverRef,
		placement: { axis, edge },
		isOpen,
	});

	return (
		<div css={styles.center}>
			<button ref={triggerRef} onClick={toggle} {...getAriaForTrigger({ role: 'dialog', isOpen, popoverId: popoverId })} type="button" data-testid="popover-trigger">
				Open
			</button>
			<Popover ref={popoverRef} id={popoverId} isOpen={isOpen} onClose={close} role="dialog" label="Positioned popover">
				<div data-testid="popover-content" css={styles.content}>
					Positioned content
				</div>
			</Popover>
		</div>
	);
}
