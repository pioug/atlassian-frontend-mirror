/**
 * @jsxRuntime classic
 * @jsx jsx
 */
/**
 * VR fixtures for the flip FLOOR that `useAnchoredPopover` turns on whenever
 * EITHER axis asks to fit, and for `placement.minSize: 0` opting out of it.
 *
 * A 2x2 of `{roomy, cramped} x {default floor, minSize: 0}`, so any difference
 * between the columns is the floor and nothing else. `insetBlockEnd` on the
 * cramped anchor leaves a fixed 40px cell below it whatever the VR viewport
 * height is, well under a floored popover's 163px margin box.
 *
 * `VrAnchorFloor` covers WHICH value the floor takes, and
 * `VrFitFloorShortViewport` the default floor YIELDING. The two
 * `VrJsFallbackFitFloor*` fixtures are the JavaScript-fallback twins of the roomy
 * column, where no floor is written at all.
 *
 * Every fixture renders a solid block rather than a `PopoverSurface`, so that a
 * change of size or side is ink rather than white on white. See
 * `styles.solidSurface` and `notes/rules/testing.md`.
 *
 * See `notes/decisions/fit-available-space.md`.
 */
import { type ReactNode, useRef, useState } from 'react';

import { jsx } from '@compiled/react';

import { cssMap } from '@atlaskit/css';
import { Pressable, Text } from '@atlaskit/primitives/compiled';
import { token } from '@atlaskit/tokens';
import { Popover } from '@atlaskit/top-layer/popover/popover';
import { type TPlacementOptions } from '@atlaskit/top-layer/resolve-placement';
import { useAnchoredPopover } from '@atlaskit/top-layer/use-anchored-popover';

const styles = cssMap({
	container: {
		position: 'relative',
		width: '100%',
		height: '100vh',
	},
	inner: {
		position: 'absolute',
		insetInlineStart: '50%',
	},
	// A roomy cell below the anchor, so the popover stays put and only its size is
	// on show.
	roomy: {
		insetBlockStart: token('space.500'),
	},
	// A 40px cell below the anchor: far too small for a floored popover's margin
	// box, which is the point of the floor.
	cramped: {
		insetBlockEnd: token('space.500'),
	},
	// An 80px cell: room for the 56px content the fallback fixtures use (`8 + 56 +
	// 5 = 69`), and none for a 150px floor (`8 + 150 + 5 = 163`). The one geometry
	// where writing the floor on the JavaScript fallback changes which side the
	// popover lands on.
	modest: {
		insetBlockEnd: token('space.1000'),
	},
	// Deliberately SHORTER than the 150px floor, so the stretch shows.
	shortContent: {
		blockSize: '40px',
		paddingInline: token('space.100'),
		paddingBlock: token('space.100'),
	},
	// Taller than the cramped cell, so the popover has to either move or letterbox.
	tallContent: {
		blockSize: '220px',
		paddingInline: token('space.100'),
		paddingBlock: token('space.100'),
	},
	// Every fixture here renders a SOLID block standing in for `PopoverSurface`,
	// because every one of them is about a size or a side. A white surface on a
	// white page makes such a change white-on-white: measured under a mutation that
	// drops the caps, three of the four original `fit-floor-*` baselines did not
	// move at all and a fourth moved 250 pixels, while the same fixtures rendered
	// solid register thousands. Same trick as
	// `84-vr-popover-fit-alignment.vr.ap.tsx`, and it keeps the JavaScript-fallback
	// twins rendering exactly what their CSS counterparts do.
	solidSurface: {
		backgroundColor: token('color.background.brand.bold'),
		color: token('color.text.inverse'),
		borderRadius: token('radius.small', '3px'),
		overflow: 'auto',
	},
	// The `VrAnchorFloor` fixtures place on the INLINE axis, so their anchor is
	// positioned along that axis instead.
	anchorFloorInner: {
		position: 'absolute',
		insetBlockStart: '50%',
	},
	// Room to spare toward the inline end, so the popover stays put and only its
	// WIDTH is on show.
	anchorFloorRoomy: {
		insetInlineStart: '50%',
	},
	// Far less room toward the inline end than the 93px margin box an 80px anchor
	// floor occupies, so the popover has to move.
	anchorFloorCramped: {
		insetInlineEnd: token('space.050'),
	},
	// An icon-button-sized trigger, which is where the anchor floor and the 150px
	// default are furthest apart.
	smallAnchor: {
		width: '80px',
	},
	anchorFloorContent: {
		paddingInline: token('space.100'),
		paddingBlock: token('space.100'),
	},
	// A 257px box with the 100px anchor at its end, so the anchor starts 157px in.
	// Off centre on purpose: a centred anchor leaves two equal cells that the
	// clamped floor fits with nothing to spare. This leaves 157px and 136px in a
	// 393px viewport, both under 163px.
	shortViewportInner: {
		position: 'absolute',
		insetInlineStart: '0',
		insetBlockStart: '50%',
		inlineSize: '257px',
		display: 'flex',
		justifyContent: 'flex-end',
	},
	// Wide enough that neither cell can hold the unclamped 163px margin box:
	// `393 - 100 < 2 * 163`.
	shortViewportAnchor: {
		width: '100px',
	},
});

/**
 * An auto-opened popover fitting the available block space, with the anchor either
 * well clear of the viewport edge or hard against it. `minSize` is passed straight
 * through, so one column is exactly the other plus `minSize: 0`.
 */
function VrFitFloor({
	label,
	space,
	content,
	minSize,
	forceFallbackPositioning = false,
}: {
	label: string;
	space: 'roomy' | 'cramped' | 'modest';
	content: 'shortContent' | 'tallContent';
	minSize?: 0;
	forceFallbackPositioning?: boolean;
}) {
	const anchorRef = useRef<HTMLButtonElement>(null);
	const popoverRef = useRef<HTMLDivElement>(null);
	const [isOpen, setIsOpen] = useState(true);

	const placement: TPlacementOptions = {
		axis: 'block',
		edge: 'end',
		align: 'center',
		// Absent means "not specified", which is what lets the default floor apply,
		// so it is spread rather than passed as `undefined`.
		...(minSize === undefined ? {} : { minSize }),
	};

	useAnchoredPopover({
		anchorRef: anchorRef,
		popoverRef,
		placement,
		isOpen,
		blockSize: 'max-available',
		forceFallbackPositioning,
	});

	return (
		<div css={styles.container}>
			<div css={[styles.inner, styles[space]]}>
				<Pressable ref={anchorRef} onClick={() => setIsOpen((previous) => !previous)}>
					{label}
				</Pressable>
			</div>
			<Popover
				ref={popoverRef}
				isOpen={isOpen}
				role="dialog"
				label={label}
				onClose={() => setIsOpen(false)}
				placement={placement}
			>
				<div css={styles.solidSurface}>
					<div css={styles[content]}>
						<Text color="inherit">{label}</Text>
					</div>
				</div>
			</Popover>
		</div>
	);
}

/**
 * The floor's COST: with a roomy cell and content shorter than the floor, the
 * surface is stretched to 150px and carries empty space below its content.
 */
export function VrFitFloorRoomyDefault(): ReactNode {
	return <VrFitFloor label="default floor" space="roomy" content="shortContent" />;
}

/**
 * The same roomy cell with `minSize: 0`, so the popover hugs its content. The
 * height difference against the fixture above is the floor.
 */
export function VrFitFloorRoomyMinSizeZero(): ReactNode {
	return <VrFitFloor label="minSize 0" space="roomy" content="shortContent" minSize={0} />;
}

/**
 * The floor's BENEFIT: with only 40px of room below the anchor, the floored margin
 * box overflows that cell and the popover moves above it at full size.
 */
export function VrFitFloorCrampedDefault(): ReactNode {
	return <VrFitFloor label="default floor" space="cramped" content="tallContent" />;
}

/**
 * The same cramped cell with `minSize: 0`: with no floor the popover never
 * overflows, so it stays below the anchor and letterboxes.
 */
export function VrFitFloorCrampedMinSizeZero(): ReactNode {
	return <VrFitFloor label="minSize 0" space="cramped" content="tallContent" minSize={0} />;
}

/**
 * The JavaScript fallback's twin of `VrFitFloorRoomyDefault`, on the same
 * geometry: fitting emits only the viewport backstop there, and NO floor, so the
 * popover hugs its 56px content where the CSS path stretches it to 150px. The
 * cell cap is meaningless without a `position-area`, and the floor is actively
 * harmful, because `computeFallbackPosition` picks a side from the popover's
 * MEASURED size and a floor only inflates the measurement it reads.
 *
 * The convention this restores: `popover-cross-axis-shift.vr.tsx` and
 * `placement-offset.vr.tsx` both carry `js-fallback-*` twins so the two
 * positioning paths cannot drift visually. Fitting had none.
 */
export function VrJsFallbackFitFloorRoomy(): ReactNode {
	return (
		<VrFitFloor
			label="fallback, roomy"
			space="roomy"
			content="shortContent"
			forceFallbackPositioning
		/>
	);
}

/**
 * The floor's ABSENCE on the fallback, in the one geometry that shows it as a
 * side rather than a size: 56px of content with 80px of room below it fits, and
 * fitted before this recipe existed, so the popover stays below the anchor.
 * Write the floor on this path and the measured size no longer fits below, so it
 * flips above the anchor instead. The `roomy` twin above cannot show that, having
 * room on both sides.
 */
export function VrJsFallbackFitFloorModestCell(): ReactNode {
	return (
		<VrFitFloor
			label="fallback, 80px cell"
			space="modest"
			content="shortContent"
			forceFallbackPositioning
		/>
	);
}

/**
 * An auto-opened popover in the shape `<Popup shouldFitContainer shouldFitViewport>`
 * maps to, on an INLINE placement so the anchor-relative axis is the floored
 * placement axis.
 */
function VrAnchorFloor({
	label,
	space,
}: {
	label: string;
	space: 'anchorFloorRoomy' | 'anchorFloorCramped';
}) {
	const anchorRef = useRef<HTMLButtonElement>(null);
	const popoverRef = useRef<HTMLDivElement>(null);
	const [isOpen, setIsOpen] = useState(true);

	const placement: TPlacementOptions = { axis: 'inline', edge: 'end', align: 'start' };

	useAnchoredPopover({
		anchorRef: anchorRef,
		popoverRef,
		placement,
		isOpen,
		inlineSize: 'match-anchor',
		blockSize: 'max-available',
	});

	return (
		<div css={styles.container}>
			<div css={[styles.anchorFloorInner, styles[space]]}>
				<Pressable
					ref={anchorRef}
					xcss={styles.smallAnchor}
					onClick={() => setIsOpen((previous) => !previous)}
				>
					{label}
				</Pressable>
			</div>
			<Popover
				ref={popoverRef}
				isOpen={isOpen}
				role="dialog"
				label={label}
				onClose={() => setIsOpen(false)}
				placement={placement}
			>
				<div css={styles.solidSurface}>
					<div css={styles.anchorFloorContent}>
						<Text color="inherit">Anchor width</Text>
					</div>
				</div>
			</Popover>
		</div>
	);
}

/**
 * The anchor floor's SIZE. Room to spare toward the inline end, so nothing moves
 * the popover and its width is the only thing under review: the 80px trigger's
 * width, not 150px.
 */
export function VrAnchorFloorRoomy(): ReactNode {
	return <VrAnchorFloor label="80px" space="anchorFloorRoomy" />;
}

/**
 * The anchor floor still FLIPS, which is what makes sizing to the anchor rather
 * than to 150px safe. Almost no room toward the inline end, so the popover's 93px
 * margin box overflows that cell and it moves to the inline-start side.
 */
export function VrAnchorFloorCramped(): ReactNode {
	return <VrAnchorFloor label="80px" space="anchorFloorCramped" />;
}

/**
 * The default floor YIELDING, on the 393px-wide mobile viewport: the one VR device
 * where neither cell beside the anchor holds the unclamped floor's 163px margin
 * box. Unclamped, every try-fallback overflows, the browser reverts to the base
 * position and the floor pushes the popover past the inline-end edge. Clamped it
 * is `(393 - 100) / 2 - 13` ≈ 133px, whose margin box overflows the ~136px
 * inline-end cell and fits the ~157px inline-start one.
 *
 * The block-axis twin has no VR device short enough, and is pinned by case E in
 * `__tests__/playwright/fit-available-space.spec.tsx`.
 */
export function VrFitFloorShortViewport(): ReactNode {
	const anchorRef = useRef<HTMLButtonElement>(null);
	const popoverRef = useRef<HTMLDivElement>(null);
	const [isOpen, setIsOpen] = useState(true);

	const placement: TPlacementOptions = { axis: 'inline', edge: 'end', align: 'start' };

	useAnchoredPopover({
		anchorRef: anchorRef,
		popoverRef,
		placement,
		isOpen,
		inlineSize: 'max-available',
	});

	return (
		<div css={styles.container}>
			<div css={styles.shortViewportInner}>
				<Pressable
					ref={anchorRef}
					xcss={styles.shortViewportAnchor}
					onClick={() => setIsOpen((previous) => !previous)}
				>
					100px
				</Pressable>
			</div>
			<Popover
				ref={popoverRef}
				isOpen={isOpen}
				role="dialog"
				label="short viewport"
				onClose={() => setIsOpen(false)}
				placement={placement}
			>
				<div css={styles.solidSurface}>
					<div css={styles.anchorFloorContent}>
						<Text color="inherit">
							Neither cell holds 163px, so the floor yields and the popover flips
						</Text>
					</div>
				</div>
			</Popover>
		</div>
	);
}

export default VrFitFloorRoomyDefault;
