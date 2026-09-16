/**
 * @jsxRuntime classic
 * @jsx jsx
 */
/**
 * An anchored popover keeps PAINTING where the browser would otherwise strongly
 * hide it. Strong hiding changes nothing but whether the surface is painted — not
 * `:popover-open`, not `opacity`, not the rect — so a screenshot is the only
 * direct assertion on it. See `notes/decisions/position-visibility-always.md`.
 *
 * Two fixtures because there are exactly two triggers, measured in Chromium 143:
 * full clipping by an `overflow` ancestor, and `visibility: hidden` on the anchor.
 * Occlusion, `opacity: 0`, partial clipping and zero-area anchors are not
 * triggers, so a third fixture would photograph nothing.
 *
 * No JavaScript-fallback twin: that path writes no `position-anchor`, so the
 * browser never acquires a vote there and both states paint identically. The
 * parity it would document is the absence of a behaviour, which a screenshot
 * cannot distinguish from the fixture being broken.
 */
import { type ReactNode, type RefObject, useRef, useState } from 'react';

import { jsx } from '@compiled/react';

import { cssMap } from '@atlaskit/css';
import { Text } from '@atlaskit/primitives/compiled';
import { token } from '@atlaskit/tokens';
import { Popover } from '@atlaskit/top-layer/popover/popover';
import { type TPlacementOptions } from '@atlaskit/top-layer/resolve-placement';
import { useAnchoredPopover } from '@atlaskit/top-layer/use-anchored-popover';

const styles = cssMap({
	page: {
		paddingBlock: token('space.300'),
		paddingInline: token('space.300'),
	},
	caption: {
		marginBlockEnd: token('space.200'),
	},
	// 80px tall against an anchor 240px down its 500px of content, so the anchor is
	// 160px clear of the clip edge: fully clipped on the block axis, with no scroll
	// needed to get there. A `prepare` action would move this to the informational
	// suite for no gain.
	scroller: {
		inlineSize: '320px',
		blockSize: '80px',
		overflow: 'auto',
		borderColor: token('color.border'),
		borderStyle: 'solid',
		borderWidth: token('border.width'),
	},
	scrollerContent: {
		blockSize: '500px',
	},
	// A spacer rather than a margin on the anchor: `marginBlockStart` only accepts
	// space tokens, and none of them is 240px.
	scrollerSpacer: {
		blockSize: '240px',
	},
	clippedAnchor: {
		inlineSize: '180px',
	},
	// Occupies layout, paints nothing. The shape Confluence `space-shortcuts` ships:
	// a trigger deliberately made invisible, whose popover must still show.
	hiddenAnchor: {
		visibility: 'hidden',
		inlineSize: '180px',
	},
	// The ink. Solid and inverse-on-brand so that painted vs not painted is 260x140
	// of changed pixels rather than a shadow.
	surface: {
		inlineSize: '260px',
		blockSize: '140px',
		display: 'flex',
		alignItems: 'center',
		justifyContent: 'center',
		paddingBlock: token('space.100'),
		paddingInline: token('space.100'),
		backgroundColor: token('color.background.brand.bold'),
		color: token('color.text.inverse'),
		textAlign: 'center',
	},
});

/**
 * An auto-opened popover rendered as a solid block, anchored to whatever the
 * fixture puts in `anchor`.
 *
 * The `<Popover>` is deliberately a SIBLING of `anchor`, not a descendant: the
 * clipped fixture's anchor lives in a scroll container, and a popover inside that
 * container is one `scrollIntoView` away from scrolling the anchor back into view
 * and making the fixture vacuous. `role="note"` moves no focus, which removes the
 * other half of that hazard.
 */
function VrPositionVisibility({
	placement,
	caption,
	label,
	anchor,
}: {
	placement: TPlacementOptions;
	caption: string;
	label: string;
	anchor: (ref: RefObject<HTMLButtonElement>) => ReactNode;
}) {
	const anchorRef = useRef<HTMLButtonElement>(null);
	const popoverRef = useRef<HTMLDivElement>(null);
	// Open from the first render: `Popover` renders no host while closed, so an
	// effect-based open would race the snapshot and photograph a popover at (0, 0).
	const [isOpen, setIsOpen] = useState(true);

	useAnchoredPopover({ anchorRef, popoverRef, placement, isOpen });

	return (
		<div css={styles.page}>
			<div css={styles.caption}>
				<Text>{caption}</Text>
			</div>
			{anchor(anchorRef)}
			<Popover
				ref={popoverRef}
				isOpen={isOpen}
				role="note"
				label={label}
				onClose={() => setIsOpen(false)}
				placement={placement}
			>
				<div css={styles.surface}>
					<Text color="inherit">{label}</Text>
				</div>
			</Popover>
		</div>
	);
}

/**
 * The anchor FULLY CLIPPED out of a scroll container, which is the geometry
 * `__tests__/playwright/popover.spec.tsx` "scroll does not close or hide popover"
 * hit-tests. Because the popover is in the top layer its containing block is the
 * initial containing block, so the scroller clips the anchor and not the popover:
 * the surface paints where the anchor actually is, 160px below the clip edge, on
 * blank page.
 *
 * An inline placement keeps it clear of the scroller so the block is unambiguously
 * the popover. Strongly hidden, that whole block is absent and the frame holds the
 * caption and an empty scroller.
 */
export function VrPositionVisibilityClippedAnchor(): ReactNode {
	return (
		<VrPositionVisibility
			placement={{ axis: 'inline', edge: 'end', align: 'center' }}
			caption="Anchor is clipped fully out of the container below. Its popover still paints."
			label="Clipped anchor"
			anchor={(ref) => (
				<div css={styles.scroller}>
					<div css={styles.scrollerContent}>
						<div css={styles.scrollerSpacer} />
						<button ref={ref} type="button" css={styles.clippedAnchor}>
							clipped anchor
						</button>
					</div>
				</div>
			)}
		/>
	);
}

/**
 * The anchor `visibility: hidden`, the other trigger. It still generates a box, so
 * the popover is positioned exactly as it would be on a visible anchor — the
 * picture is a solid block below a gap where the anchor is, and nothing at all
 * without the declaration.
 */
export function VrPositionVisibilityHiddenAnchor(): ReactNode {
	return (
		<VrPositionVisibility
			placement={{ axis: 'block', edge: 'end', align: 'start' }}
			caption="Anchor below is visibility:hidden. Its popover still paints."
			label="Hidden anchor"
			anchor={(ref) => (
				<button ref={ref} type="button" css={styles.hiddenAnchor}>
					hidden anchor
				</button>
			)}
		/>
	);
}

export default VrPositionVisibilityClippedAnchor;
