/**
 * @jsxRuntime classic
 * @jsx jsx
 */
/**
 * VR fixtures for what a CAPPED popover looks like, which is the rendering
 * `__tests__/playwright/fit-available-space.spec.tsx` measures but cannot review.
 * One photographs a fitting popover scrolling inside its cell cap, the other
 * Rule 3's unconditional viewport backstop on an axis where both capped edges
 * land on screen.
 *
 * The anchor is centred in the viewport, so on the 720px-tall default device the
 * cell below it is about 341px and the cap about 328px. The default floor is
 * 150px, well under that, so nothing flips and the cap is the only thing on show.
 * Centring also puts the backstop fixture's popover symmetrically about the
 * viewport centre, which is what brings both of its block edges into frame.
 *
 * Neither fixture relies on a scrollbar being painted: the runner's Chromium
 * draws overlay scrollbars, so a scrolled surface looks identical to an
 * unscrolled one except for the position of its content. Both therefore pin a
 * SOLID marker instead, whose presence in the frame is the cap's signature, and
 * and the fitting one sits on a non-white page so that the 5px
 * `VIEWPORT_PADDING` reserves at the viewport edge is a visible band.
 *
 * Not covered here, deliberately: the host's `min-*-size: 0` child reset. The
 * automatic minimum size it neutralises applies only to the flex MAIN axis, which
 * is inline, and an inline cap is bounded by the viewport edge, so a child that
 * refuses to shrink leaves the frame instead of growing inside it. Both states
 * differ by a 5px strip at the viewport edge, which is not a rendering a
 * screenshot can review. `fit-available-space.spec.tsx`'s "the cap reaches a
 * child that does NOT scroll" measures it at a 290px delta in a 320px viewport,
 * which no fixed VR device can reproduce.
 *
 * See `notes/decisions/fit-available-space.md`.
 */
import { type ReactNode, useRef, useState } from 'react';

import { jsx } from '@compiled/react';

import { cssMap } from '@atlaskit/css';
import { Pressable, Text } from '@atlaskit/primitives/compiled';
import { token } from '@atlaskit/tokens';
import { PopoverSurface } from '@atlaskit/top-layer/popover-surface';
import { Popover } from '@atlaskit/top-layer/popover/popover';
import { type TPlacementOptions } from '@atlaskit/top-layer/resolve-placement';
import { useAnchoredPopover } from '@atlaskit/top-layer/use-anchored-popover';

const styles = cssMap({
	// Centres the anchor in the viewport, so the cell below it is half the device
	// height less half the anchor: roomy enough that the 150px floor cannot flip
	// the popover, small enough that the cap sits well inside the frame.
	container: {
		width: '100%',
		height: '100vh',
		display: 'flex',
		alignItems: 'center',
		justifyContent: 'center',
	},
	// NOT white, for the fitting fixture: `VIEWPORT_PADDING` keeps the popover 5px
	// clear of the viewport edge, and against a white page that gap is white on
	// white, at the one boundary the padding governs. On this background it reads
	// as a 5px band. The analogue of the 2px ruler in
	// `84-vr-popover-fit-alignment.vr.ap.tsx`.
	//
	// The backstop fixture below keeps a white page, and does not need this: its
	// guard for the same constant is the solid marker bar, which moves with the
	// padding. Measured, `VIEWPORT_PADDING` 5px to 0px: 1,770 pixels here and 2,428
	// pixels there.
	fittingPage: {
		backgroundColor: token('color.background.accent.gray.subtler'),
	},
	trigger: {
		width: '120px',
		paddingBlock: token('space.100'),
		backgroundColor: token('color.background.neutral.bold'),
		color: token('color.text.inverse'),
	},
	// Six 100px bands plus the footer, so the content is 640px against a cap of
	// about 333px.
	scrollingContent: {
		inlineSize: '200px',
		display: 'flex',
		flexDirection: 'column',
	},
	// One 100px band, labelled with the offset of its END. Alternating tints make
	// the boundaries countable, so the frame shows WHICH hundred the cap cuts at
	// and that the rest of the content continues past it. Without them the box is a
	// white void and only the caption claims there is more content: a cap that
	// drifted from 333px to 400px would look equally plausible.
	band: {
		blockSize: '100px',
		flexShrink: 0,
		paddingBlock: token('space.050'),
		paddingInline: token('space.100'),
		backgroundColor: token('color.background.accent.blue.subtler'),
	},
	bandAlt: {
		backgroundColor: token('color.background.accent.blue.subtlest'),
	},
	// Pinned to the bottom of the scrollport rather than to the end of the
	// content, so what it photographs is the SIZE of the scrollport and not a
	// scroll position. This is the shape of the control the ticket was raised
	// about: uncapped, the popover is 600px tall, so this bar is at the far end of
	// it, below the viewport and out of reach.
	stickyFooter: {
		position: 'sticky',
		insetBlockEnd: '0',
		backgroundColor: token('color.background.brand.bold'),
		color: token('color.text.inverse'),
		paddingBlock: token('space.100'),
		paddingInline: token('space.100'),
		textAlign: 'center',
	},
	// Nearly three times the 710px block backstop on a 720px-tall device, so the
	// cap is what decides the popover's height.
	backstopContent: {
		blockSize: '2000px',
		inlineSize: '220px',
	},
	// A solid bar at the top of that content, which is what the backstop decides
	// the visibility of: capped, the popover is centred on the anchor at 710px and
	// the bar is at the top of the frame. Uncapped it is 2000px tall, so the bar is
	// 600px above the frame and the visible band is blank surface. Solid, so the
	// difference is a filled block rather than a hairline edge.
	backstopMarker: {
		backgroundColor: token('color.background.brand.bold'),
		color: token('color.text.inverse'),
		paddingBlock: token('space.150'),
		paddingInline: token('space.100'),
	},
});

const FITTING_PLACEMENT: TPlacementOptions = { axis: 'block', edge: 'end', align: 'center' };

/**
 * The block offset at the END of each 100px band, which is what each band is
 * labelled with.
 */
const CONTENT_BANDS = ['100px', '200px', '300px', '400px', '500px', '600px'];

/**
 * An auto-opened popover fitting the available block space below a centred
 * anchor, whose single child is supplied by the fixture.
 */
function VrFitScroll({ label, children }: { label: string; children: ReactNode }) {
	const anchorRef = useRef<HTMLButtonElement>(null);
	const popoverRef = useRef<HTMLDivElement>(null);
	const [isOpen, setIsOpen] = useState(true);

	useAnchoredPopover({
		anchorRef,
		popoverRef,
		placement: FITTING_PLACEMENT,
		isOpen,
		blockSize: 'max-available',
	});

	return (
		<div css={[styles.container, styles.fittingPage]}>
			<Pressable
				ref={anchorRef}
				xcss={styles.trigger}
				onClick={() => setIsOpen((previous) => !previous)}
			>
				{label}
			</Pressable>
			<Popover
				ref={popoverRef}
				isOpen={isOpen}
				role="dialog"
				label={label}
				onClose={() => setIsOpen(false)}
				placement={FITTING_PLACEMENT}
			>
				{children}
			</Popover>
		</div>
	);
}

/**
 * The cap REACHING the surface: 640px of content in a cap of about 333px, so
 * `PopoverSurface` scrolls and its sticky footer is pinned to the bottom of the
 * scrollport, 5px clear of the viewport bottom, with the surface's rounded edge
 * and shadow around it.
 *
 * The content is six labelled 100px bands, so the picture states its own
 * geometry: the frame holds bands up to 300px and part of the fourth, and the
 * rest is plainly cut off. Uncapped, the popover is 640px tall, so every band is
 * in frame and the footer is more than 250px below the viewport, which is the
 * reported symptom: the controls at the bottom cannot be reached.
 */
export function VrFitScrollCappedSurface(): ReactNode {
	return (
		<VrFitScroll label="capped surface">
			<PopoverSurface>
				<div css={styles.scrollingContent}>
					{CONTENT_BANDS.map((offset, index) => (
						<div key={offset} css={[styles.band, index % 2 === 1 && styles.bandAlt]}>
							<Text>{offset}</Text>
						</div>
					))}
					<div css={styles.stickyFooter}>
						<Text color="inherit">Footer</Text>
					</div>
				</div>
			</PopoverSurface>
		</VrFitScroll>
	);
}

/**
 * Rule 3's UNCONDITIONAL viewport backstop, on a popover where nothing is
 * fitting: both axes are left on `'content'`, so there is no cell cap and no flip
 * floor, and `max-block-size: calc(100dvh - 10px)` is the only thing standing
 * between 2000px of content and the viewport.
 *
 * The placement is inline so the cross axis is block, and `anchor-center` on a
 * centred anchor puts BOTH capped block edges on screen: the surface spans about
 * 8px to 716px of a 720px device, with the solid bar at the top of its content
 * just inside the upper edge. Without the backstop it is 2000px tall, centred, so both edges and that bar are all more than 600px
 * outside the frame, which holds a blank band of surface instead.
 *
 * Its only picture before this fixture was
 * `informational-vr-tests/.../safari-flex-collapse-max-height-popover--desktop-webkit.png`,
 * which is one engine, inside a fixture about a different bug.
 */
export function VrFitBackstopTallerThanViewport(): ReactNode {
	const anchorRef = useRef<HTMLButtonElement>(null);
	const popoverRef = useRef<HTMLDivElement>(null);
	const [isOpen, setIsOpen] = useState(true);

	const placement: TPlacementOptions = { axis: 'inline', edge: 'end', align: 'center' };

	useAnchoredPopover({
		anchorRef,
		popoverRef,
		placement,
		isOpen,
	});

	return (
		<div css={styles.container}>
			<Pressable
				ref={anchorRef}
				xcss={styles.trigger}
				onClick={() => setIsOpen((previous) => !previous)}
			>
				backstop
			</Pressable>
			<Popover
				ref={popoverRef}
				isOpen={isOpen}
				role="dialog"
				label="viewport backstop"
				onClose={() => setIsOpen(false)}
				placement={placement}
			>
				<PopoverSurface>
					<div css={styles.backstopContent}>
						<div css={styles.backstopMarker}>
							<Text color="inherit">Top of 2000px of content</Text>
						</div>
					</div>
				</PopoverSurface>
			</Popover>
		</div>
	);
}

export default VrFitScrollCappedSurface;
