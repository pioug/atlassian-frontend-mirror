/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import { useRef } from 'react';

import { jsx } from '@compiled/react';

import { cssMap } from '@atlaskit/css';
import { token } from '@atlaskit/tokens';
import { Popover } from '@atlaskit/top-layer/popover';
import { useAnchorPosition } from '@atlaskit/top-layer/use-anchor-position';

const styles = cssMap({
	// Center the trigger horizontally and vertically so the four popovers
	// (above, below, left, right) all have room to render and the snapshot
	// reads clearly without flipping.
	page: {
		display: 'flex',
		justifyContent: 'center',
		alignItems: 'center',
		width: '100vw',
		height: '100vh',
		minHeight: '100vh',
	},
	trigger: {
		paddingBlock: token('space.100'),
		paddingInline: token('space.200'),
	},
	popoverContent: {
		paddingBlock: token('space.150'),
		paddingInline: token('space.200'),
		backgroundColor: token('color.background.neutral.bold'),
		color: token('color.text.inverse'),
		borderRadius: token('radius.small', '3px'),
	},
});

/**
 * Four manual `Popover`s anchored to the same trigger element, one on
 * each edge (block-start, block-end, inline-start, inline-end). All
 * four are open at the same time so the VR snapshot proves anchor
 * positioning resolves correctly for every popover sharing the trigger.
 *
 * Regression coverage for the bug where the second `useAnchorPosition`
 * call on the same trigger would overwrite the first call's
 * `anchor-name` style, leaving subsequent popovers unpositioned.
 */
export default function VrMultiplePopoversOnSameAnchor(): JSX.Element {
	const triggerRef = useRef<HTMLButtonElement | null>(null);
	const popoverAboveRef = useRef<HTMLDivElement | null>(null);
	const popoverBelowRef = useRef<HTMLDivElement | null>(null);
	const popoverLeftRef = useRef<HTMLDivElement | null>(null);
	const popoverRightRef = useRef<HTMLDivElement | null>(null);

	useAnchorPosition({
		anchorRef: triggerRef,
		popoverRef: popoverAboveRef,
		placement: { axis: 'block', edge: 'start' },
	});

	useAnchorPosition({
		anchorRef: triggerRef,
		popoverRef: popoverBelowRef,
		placement: { axis: 'block', edge: 'end' },
	});

	useAnchorPosition({
		anchorRef: triggerRef,
		popoverRef: popoverLeftRef,
		placement: { axis: 'inline', edge: 'start' },
	});

	useAnchorPosition({
		anchorRef: triggerRef,
		popoverRef: popoverRightRef,
		placement: { axis: 'inline', edge: 'end' },
	});

	return (
		<div css={styles.page}>
			<button ref={triggerRef} type="button" css={styles.trigger} data-testid="shared-trigger">
				Shared trigger
			</button>
			<Popover ref={popoverAboveRef} role="note" mode="manual" isOpen={true}>
				<div css={styles.popoverContent} data-testid="popover-above">
					Above
				</div>
			</Popover>
			<Popover ref={popoverBelowRef} role="note" mode="manual" isOpen={true}>
				<div css={styles.popoverContent} data-testid="popover-below">
					Below
				</div>
			</Popover>
			<Popover ref={popoverLeftRef} role="note" mode="manual" isOpen={true}>
				<div css={styles.popoverContent} data-testid="popover-left">
					Left
				</div>
			</Popover>
			<Popover ref={popoverRightRef} role="note" mode="manual" isOpen={true}>
				<div css={styles.popoverContent} data-testid="popover-right">
					Right
				</div>
			</Popover>
		</div>
	);
}
