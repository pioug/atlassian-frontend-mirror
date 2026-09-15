/**
 * @jsxRuntime classic
 * @jsx jsx
 */
/**
 * VR fixtures for `useAnchoredPopover`'s `inlineSize` in a NARROW
 * `position-area` span, which is where each value's floor is most clearly
 * different: `'min-anchor'` wraps down to the anchor width, `'match-anchor'`
 * wraps at exactly the anchor width, and `'content'` keeps its natural width
 * (`inline-size: max-content`), so it overflows the span and slides to the
 * roomier side instead of wrapping.
 *
 * The anchor sits near the inline-end viewport edge in these fixtures, so an
 * `align: 'start'` popover gets a narrow span to occupy.
 *
 * See `notes/decisions/width-from-anchor-floors.md` for why the anchor floor
 * belongs to `'min-anchor'` alone, and `notes/decisions/fit-available-space.md`
 * -> Update (2026-09-04) for why `'content'` slides.
 */
import { Fragment, type ReactNode, useRef, useState } from 'react';

import { jsx } from '@compiled/react';

import { cssMap } from '@atlaskit/css';
import { Pressable, Text } from '@atlaskit/primitives/compiled';
import { token } from '@atlaskit/tokens';
import { Popover } from '@atlaskit/top-layer/popover/popover';
import { PopoverSurface } from '@atlaskit/top-layer/popover-surface';
import { useAnchoredPopover } from '@atlaskit/top-layer/use-anchored-popover';

type TWidthMode = 'none' | 'match-anchor' | 'min-anchor';

const styles = cssMap({
	container: {
		position: 'relative',
		width: '100%',
		height: '100vh',
	},
	inner: {
		position: 'absolute',
	},
	// Anchor near the inline-end viewport edge, leaving a narrow span for an
	// `align: 'start'` popover to occupy.
	nearInlineEnd: {
		insetInlineEnd: token('space.200'),
		insetBlockStart: '50%',
	},
	// Anchor a row-action menu's distance from the inline-end edge: with the 80px
	// anchor, a 160px span for an `align: 'start'` popover, too narrow for a
	// one-line menu.
	rowActionEnd: {
		insetInlineEnd: token('space.1000'),
		insetBlockStart: '50%',
	},
	// Anchor in the middle, where the span is roomy. The regression control.
	roomy: {
		insetInlineStart: '50%',
		insetBlockStart: '50%',
	},
	// A deliberately wide anchor, so the anchor floor is the binding one.
	wideAnchor: {
		width: '260px',
	},
	narrowAnchor: {
		width: '80px',
	},
	content: {
		paddingInline: token('space.100'),
		paddingBlock: token('space.100'),
	},
});

/**
 * An auto-opened popover in a given width mode, with the anchor either hard
 * against the inline-end viewport edge (narrow span) or in the middle (roomy).
 */
function VrMinAnchor({
	mode,
	position,
	anchorWidth,
	label = mode,
	children,
}: {
	mode: TWidthMode;
	position: 'nearInlineEnd' | 'rowActionEnd' | 'roomy';
	anchorWidth: 'wideAnchor' | 'narrowAnchor';
	/**
	 * The trigger's text. Defaults to the mode, which most fixtures want on show.
	 */
	label?: string;
	children: string;
}) {
	const anchorRef = useRef<HTMLButtonElement>(null);
	const popoverRef = useRef<HTMLDivElement>(null);
	const [isOpen, setIsOpen] = useState(true);

	// `mode` is rendered as label text in these snapshots, so it keeps the width
	// modes' original spelling. `'none'` is now `inlineSize: 'content'`.
	const inlineSize = mode === 'none' ? 'content' : mode;

	// `align: 'start'` so the popover occupies the span running from the
	// anchor's inline-start edge toward the inline end.
	useAnchoredPopover({
		anchorRef: anchorRef,
		popoverRef,
		placement: { axis: 'block', edge: 'end', align: 'start' },
		isOpen,
		inlineSize,
	});

	return (
		<div css={styles.container}>
			<div css={[styles.inner, styles[position]]}>
				<Pressable
					ref={anchorRef}
					xcss={styles[anchorWidth]}
					onClick={() => setIsOpen((previous) => !previous)}
				>
					{label}
				</Pressable>
			</div>
			<Popover
				ref={popoverRef}
				isOpen={isOpen}
				role="dialog"
				label={`mode="${mode}"`}
				onClose={() => setIsOpen(false)}
			>
				<PopoverSurface>
					<Fragment>
						<div css={styles.content}>
							<Text>{children}</Text>
						</div>
					</Fragment>
				</PopoverSurface>
			</Popover>
		</div>
	);
}

/**
 * Content wide enough that it cannot fit in the narrow span on one line, so each
 * mode has to either wrap it or overflow.
 */
const LONG_CONTENT = 'This content is one long line that will not fit the span';

/**
 * `'min-anchor'` in a narrow span. Its only floor is the anchor width, so it wraps
 * down to that width rather than overflowing the span.
 */
export function VrMinAnchorNarrowSpan(): ReactNode {
	return (
		<VrMinAnchor mode="min-anchor" position="nearInlineEnd" anchorWidth="narrowAnchor">
			{LONG_CONTENT}
		</VrMinAnchor>
	);
}

/**
 * `'content'` in the same narrow span. Its natural width overflows the span, so it
 * slides to the inline-end-aligned cell on one line, where `'min-anchor'` above
 * wraps down to the anchor. See `notes/decisions/fit-available-space.md` ->
 * Update (2026-09-04).
 */
export function VrNoneNarrowSpan(): ReactNode {
	return (
		<VrMinAnchor mode="none" position="nearInlineEnd" anchorWidth="narrowAnchor">
			{LONG_CONTENT}
		</VrMinAnchor>
	);
}

/**
 * The consumer shape the slide exists for: a row-action menu 80px from the
 * inline-end edge, with content wider than its 160px span. It overflows the span
 * (and the re-centred fallback) and lands with its inline-end edge on the
 * trigger's, on one line. Wrapped into the span is the failure.
 */
export function VrContentWidthRowActionSlides(): ReactNode {
	return (
		<VrMinAnchor mode="none" position="rowActionEnd" anchorWidth="narrowAnchor" label="More">
			{LONG_CONTENT}
		</VrMinAnchor>
	);
}

/**
 * `'match-anchor'` in the same narrow span: exactly the anchor width, ignoring the
 * slack left in the span that `'min-anchor'` is free to use. That difference is
 * the whole distinction between the two.
 */
export function VrMatchAnchorNarrowSpan(): ReactNode {
	return (
		<VrMinAnchor mode="match-anchor" position="nearInlineEnd" anchorWidth="narrowAnchor">
			{LONG_CONTENT}
		</VrMinAnchor>
	);
}

/**
 * `'min-anchor'` with a wide anchor and short content in a roomy span. The
 * ANCHOR floor is the binding one here, so the popover should match the
 * anchor's width rather than shrinking to its content.
 */
export function VrMinAnchorWideAnchorShortContent(): ReactNode {
	return (
		<VrMinAnchor mode="min-anchor" position="roomy" anchorWidth="wideAnchor">
			Short
		</VrMinAnchor>
	);
}

/**
 * `'min-anchor'` with a narrow anchor and long content in a roomy span. The anchor
 * floor is not binding, so the popover grows past the anchor onto one line, which
 * is what distinguishes `'min-anchor'` from `'match-anchor'`.
 */
export function VrMinAnchorNarrowAnchorLongContent(): ReactNode {
	return (
		<VrMinAnchor mode="min-anchor" position="roomy" anchorWidth="narrowAnchor">
			{LONG_CONTENT}
		</VrMinAnchor>
	);
}

export default VrMinAnchorNarrowSpan;
