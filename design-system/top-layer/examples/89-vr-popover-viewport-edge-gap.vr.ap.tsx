/**
 * @jsxRuntime classic
 * @jsx jsx
 */
/**
 * VR fixtures for the viewport edge gap of `useAnchoredPopover`. Every anchored
 * popover keeps `5px` to the viewport edge, but the gap never moves a popover
 * off its trigger.
 *
 * See `notes/decisions/viewport-edge-gap.md`.
 */
import { type ReactNode, useRef, useState } from 'react';

import { jsx } from '@compiled/react';

import { cssMap } from '@atlaskit/css';
import { Pressable } from '@atlaskit/primitives/compiled/pressable';
import { Text } from '@atlaskit/primitives/compiled/text';
import { token } from '@atlaskit/tokens';
import { PopoverSurface } from '@atlaskit/top-layer/popover-surface';
import { Popover } from '@atlaskit/top-layer/popover/popover';
import type { TPlacementOptions } from '@atlaskit/top-layer/resolve-placement';
import { useAnchoredPopover } from '@atlaskit/top-layer/use-anchored-popover';

const styles = cssMap({
	container: {
		position: 'relative',
		width: '100%',
		height: '100vh',
	},
	inner: {
		position: 'absolute',
	},
	// 16px from the inline-start edge: a centred popover wider than the trigger
	// has to slide toward the inline end.
	nearInlineStart: {
		insetInlineStart: token('space.200'),
		insetBlockStart: '50%',
	},
	// Touching the inline-start edge.
	atInlineStart: {
		insetInlineStart: token('space.0'),
		insetBlockStart: '50%',
	},
	trigger: {
		width: '80px',
	},
	content: {
		paddingInline: token('space.100'),
		paddingBlock: token('space.100'),
	},
	mediumContent: {
		width: '300px',
	},
});

function VrEdgeGap({
	position,
	placement,
	inlineSize = 'content',
	hasMediumContent = false,
	children,
}: {
	position: 'nearInlineStart' | 'atInlineStart';
	placement: TPlacementOptions;
	inlineSize?: 'content' | 'match-anchor' | 'min-anchor';
	/**
	 * A fixed 300px content width. Without it the content is as wide as its text.
	 */
	hasMediumContent?: boolean;
	children: string;
}) {
	const anchorRef = useRef<HTMLButtonElement>(null);
	const popoverRef = useRef<HTMLDivElement>(null);
	const [isOpen, setIsOpen] = useState(true);

	useAnchoredPopover({ anchorRef, popoverRef, placement, isOpen, inlineSize });

	return (
		<div css={styles.container}>
			<div css={[styles.inner, styles[position]]}>
				<Pressable
					ref={anchorRef}
					xcss={styles.trigger}
					onClick={() => setIsOpen((previous) => !previous)}
				>
					Trigger
				</Pressable>
			</div>
			<Popover
				ref={popoverRef}
				isOpen={isOpen}
				role="dialog"
				label="Viewport edge gap"
				onClose={() => setIsOpen(false)}
			>
				<PopoverSurface>
					<div css={[styles.content, hasMediumContent && styles.mediumContent]}>
						<Text>{children}</Text>
					</div>
				</PopoverSurface>
			</Popover>
		</div>
	);
}

/**
 * A centred popover that is wider than its trigger, 16px from the viewport
 * edge. It slides toward the inline end and stops 5px from the edge.
 */
export function VrEdgeGapSlides(): ReactNode {
	return (
		<VrEdgeGap position="nearInlineStart" placement={{ align: 'center' }} hasMediumContent>
			Slides and keeps 5px to the edge
		</VrEdgeGap>
	);
}

/**
 * A start aligned popover on a trigger that touches the viewport edge. It lines
 * up with the trigger and touches the edge too: the gap does not push it off
 * its trigger.
 */
export function VrEdgeGapTriggerAtEdge(): ReactNode {
	return (
		<VrEdgeGap position="atInlineStart" placement={{ align: 'start' }} hasMediumContent>
			Lines up with the trigger at the edge
		</VrEdgeGap>
	);
}

/**
 * `'match-anchor'` on a trigger that touches the viewport edge. The popover is
 * as wide as the trigger and stays on it.
 */
export function VrEdgeGapMatchAnchorAtEdge(): ReactNode {
	return (
		<VrEdgeGap position="atInlineStart" placement={{ align: 'center' }} inlineSize="match-anchor">
			On it
		</VrEdgeGap>
	);
}

/**
 * `'min-anchor'` with short content on a trigger that touches the viewport
 * edge. The popover is as wide as the trigger and stays on it.
 */
export function VrEdgeGapMinAnchorAtEdge(): ReactNode {
	return (
		<VrEdgeGap position="atInlineStart" placement={{ align: 'center' }} inlineSize="min-anchor">
			On it
		</VrEdgeGap>
	);
}

export default VrEdgeGapSlides;
