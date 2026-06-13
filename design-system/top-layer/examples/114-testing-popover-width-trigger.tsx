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
import { useWidthFromAnchor } from '@atlaskit/top-layer/use-width-from-anchor';

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
 * Test fixture for `useWidthFromAnchor` with mode `'match-anchor'`.
 * The trigger is an element with a known width so we can verify the
 * popover matches it.
 */
export default function TestingPopoverWidthTrigger(): ReactNode {
	const [isOpen, setIsOpen] = useState(false);
	const triggerRef = useRef<HTMLDivElement>(null);
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

	useWidthFromAnchor({
		anchorRef: triggerRef,
		popoverRef,
		mode: 'match-anchor',
		isOpen,
	});

	return (
		<div css={styles.wrapper}>
			<div
				ref={triggerRef}
				onClick={toggle}
				{...getAriaForTrigger({ role: 'dialog', isOpen, popoverId: popoverId })}
				role="button"
				tabIndex={0}
				data-testid="popover-trigger"
				onKeyDown={(event) => {
					if (event.key === 'Enter' || event.key === ' ') {
						event.preventDefault();
						toggle();
					}
				}}
			>
				Wide trigger element
			</div>
			<Popover
				ref={popoverRef}
				id={popoverId}
				isOpen={isOpen}
				onClose={close}
				role="dialog"
				label="Width test"
			>
				<div data-testid="popover-content" css={styles.content}>
					This popover should match the trigger width
				</div>
			</Popover>
		</div>
	);
}
