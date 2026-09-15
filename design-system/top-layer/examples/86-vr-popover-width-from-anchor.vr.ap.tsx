/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import React, { useRef, useState } from 'react';

import { jsx } from '@compiled/react';

import { cssMap } from '@atlaskit/css';
import { Pressable, Text } from '@atlaskit/primitives/compiled';
import { token } from '@atlaskit/tokens';
import { Popover } from '@atlaskit/top-layer/popover/popover';
import { PopoverSurface } from '@atlaskit/top-layer/popover-surface';
import { useAnchoredPopover } from '@atlaskit/top-layer/use-anchored-popover';

const styles = cssMap({
	buttonWrapper: {
		display: 'flex',
		justifyContent: 'center',
		alignItems: 'center',
		minHeight: '200px',
		paddingBlock: token('space.800'),
		paddingInline: token('space.800'),
	},
	// Fixed width so VR snapshots can verify popover width relative to anchor.
	anchor: {
		width: '200px',
	},
	popupContentWrapper: {
		paddingInline: token('space.100'),
		paddingBlock: token('space.100'),
	},
});

/**
 * Renders a native-popover fixture composed from `<Popover>` +
 * `useAnchoredPopover`. Auto-opens on mount so the VR snapshot captures the open
 * popover in each width mode.
 */
function PopoverWidthFromAnchor({ mode }: { mode: 'none' | 'match-anchor' | 'min-anchor' }) {
	const anchorRef = useRef<HTMLButtonElement>(null);
	const popoverRef = useRef<HTMLDivElement>(null);
	const [isOpen, setIsOpen] = useState(true);

	// `mode` is rendered as label text in these snapshots, so it keeps the width
	// modes' original spelling. `'none'` is now `inlineSize: 'content'`.
	const inlineSize = mode === 'none' ? 'content' : mode;

	// Position the popover below the anchor (block-end), sized from the anchor.
	useAnchoredPopover({
		anchorRef: anchorRef,
		popoverRef,
		placement: { edge: 'end' },
		isOpen,
		inlineSize,
	});

	// Auto-open on mount so the VR snapshot captures the open state.
	return (
		<React.Fragment>
			<div css={styles.buttonWrapper}>
				<Pressable ref={anchorRef} xcss={styles.anchor} onClick={() => setIsOpen((prev) => !prev)}>
					{mode} anchor
				</Pressable>
			</div>

			<Popover
				ref={popoverRef}
				isOpen={isOpen}
				role="dialog"
				label={`widthFromAnchor="${mode}"`}
				onClose={() => setIsOpen(false)}
			>
				<PopoverSurface>
					<div css={styles.popupContentWrapper}>
						<Text>widthFromAnchor=&quot;{mode}&quot;</Text>
					</div>
				</PopoverSurface>
			</Popover>
		</React.Fragment>
	);
}

/**
 * `widthFromAnchor="none"` - popover sizes to its own content, ignoring anchor width.
 */
export function VrPopoverWidthFromAnchorNone(): React.ReactNode {
	return <PopoverWidthFromAnchor mode="none" />;
}

/**
 * `widthFromAnchor="match-anchor"` - popover width exactly matches the anchor width.
 */
export function VrPopoverWidthFromAnchorMatchAnchor(): React.ReactNode {
	return <PopoverWidthFromAnchor mode="match-anchor" />;
}

/**
 * `widthFromAnchor="min-anchor"` - popover is at least as wide as the anchor, but
 * can grow wider if its content requires it.
 */
export function VrPopoverWidthFromAnchorMinAnchor(): React.ReactNode {
	return <PopoverWidthFromAnchor mode="min-anchor" />;
}

export default VrPopoverWidthFromAnchorMatchAnchor;
