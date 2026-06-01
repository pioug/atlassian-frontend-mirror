/**
 * @jsxRuntime classic
 * @jsx jsx
 * @jsxFrag
 */
import React, { useEffect, useRef, useState } from 'react';

import { jsx } from '@compiled/react';

import { cssMap } from '@atlaskit/css';
import { Pressable, Text } from '@atlaskit/primitives/compiled';
import { token } from '@atlaskit/tokens';
import { Popover } from '@atlaskit/top-layer/popover';
import { PopupSurface } from '@atlaskit/top-layer/popup-surface';
import { useAnchorPosition } from '@atlaskit/top-layer/use-anchor-position';
import { useWidthFromAnchor } from '@atlaskit/top-layer/use-width-from-anchor';

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
 * `useAnchorPosition` + `useWidthFromAnchor`. Auto-opens on mount so the VR
 * snapshot captures the open popover in each width mode.
 */
function PopoverWidthFromAnchor({ mode }: { mode: 'none' | 'match-anchor' | 'min-anchor' }) {
	const anchorRef = useRef<HTMLButtonElement>(null);
	const popoverRef = useRef<HTMLDivElement>(null);
	const [isOpen, setIsOpen] = useState(false);

	// Position the popover below the anchor (block-end).
	useAnchorPosition({
		anchorRef,
		popoverRef,
		placement: { edge: 'end' },
	});

	// Apply the width mode relative to the anchor.
	useWidthFromAnchor({ mode, popoverRef, anchorRef });

	// Auto-open on mount so the VR snapshot captures the open state.
	useEffect(() => {
		setIsOpen(true);
	}, []);

	return (
		<>
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
				<PopupSurface>
					<div css={styles.popupContentWrapper}>
						<Text>widthFromAnchor=&quot;{mode}&quot;</Text>
					</div>
				</PopupSurface>
			</Popover>
		</>
	);
}

/**
 * `widthFromAnchor="none"` - popover sizes to its own content, ignoring anchor width.
 */
export function VrPopoverWidthFromAnchorNone(): JSX.Element {
	return <PopoverWidthFromAnchor mode="none" />;
}

/**
 * `widthFromAnchor="match-anchor"` - popover width exactly matches the anchor width.
 */
export function VrPopoverWidthFromAnchorMatchAnchor(): JSX.Element {
	return <PopoverWidthFromAnchor mode="match-anchor" />;
}

/**
 * `widthFromAnchor="min-anchor"` - popover is at least as wide as the anchor, but
 * can grow wider if its content requires it.
 */
export function VrPopoverWidthFromAnchorMinAnchor(): JSX.Element {
	return <PopoverWidthFromAnchor mode="min-anchor" />;
}

export default VrPopoverWidthFromAnchorMatchAnchor;
