/**
 * @jsxRuntime classic
 * @jsx jsx
 */
/**
 * VR fixtures for `useWidthFromAnchor` in a NARROW `position-area` span.
 *
 * A narrow span is where the three width modes are most clearly different,
 * because it is where each mode's floor decides whether the popover wraps its
 * content or overflows:
 *
 * - `'min-anchor'` is floored at the ANCHOR width only, so it wraps down to that
 *   width. Being a lower bound and not an exact size is what separates it from
 *   `'match-anchor'`.
 * - `'none'` is floored at its own CONTENT width, so it cannot wrap, which makes
 *   its margin box overflow and lets `position-try-fallbacks` reposition it.
 * - `'match-anchor'` has no floor. It is exactly the anchor width, so it wraps.
 *
 * The anchor sits near the inline-end viewport edge in these fixtures, so an
 * `align: 'start'` popover gets a narrow span to occupy.
 *
 * See `notes/decisions/width-from-anchor-floors.md` for why the content floor
 * belongs to `'none'` and deliberately not to `'min-anchor'`.
 */
import { Fragment, type ReactNode, useRef, useState } from 'react';

import { jsx } from '@compiled/react';

import { cssMap } from '@atlaskit/css';
import { Pressable, Text } from '@atlaskit/primitives/compiled';
import { token } from '@atlaskit/tokens';
import { Popover } from '@atlaskit/top-layer/popover/popover';
import { PopoverSurface } from '@atlaskit/top-layer/popover-surface';
import { useAnchorPosition } from '@atlaskit/top-layer/use-anchor-position';
import { useWidthFromAnchor } from '@atlaskit/top-layer/use-width-from-anchor';

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
 * Renders an auto-opened popover in a given width mode, with the anchor either
 * hard against the inline-end viewport edge (narrow span) or in the middle
 * (roomy span).
 */
function VrMinAnchor({
	mode,
	position,
	anchorWidth,
	children,
}: {
	mode: TWidthMode;
	position: 'nearInlineEnd' | 'roomy';
	anchorWidth: 'wideAnchor' | 'narrowAnchor';
	children: string;
}) {
	const anchorRef = useRef<HTMLButtonElement>(null);
	const popoverRef = useRef<HTMLDivElement>(null);
	const [isOpen, setIsOpen] = useState(true);

	// `align: 'start'` so the popover occupies the span running from the
	// anchor's inline-start edge toward the inline end.
	useAnchorPosition({
		anchorRef,
		popoverRef,
		placement: { axis: 'block', edge: 'end', align: 'start' },
		isOpen,
	});

	useWidthFromAnchor({ mode, popoverRef, anchorRef, isOpen });

	return (
		<div css={styles.container}>
			<div css={[styles.inner, styles[position]]}>
				<Pressable
					ref={anchorRef}
					xcss={styles[anchorWidth]}
					onClick={() => setIsOpen((previous) => !previous)}
				>
					{mode}
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
 * `'min-anchor'` in a narrow span. Its only floor is the anchor width, so the
 * popover wraps down to that width. It is NOT floored at its content width, so it
 * does not overflow the span.
 */
export function VrMinAnchorNarrowSpan(): ReactNode {
	return (
		<VrMinAnchor mode="min-anchor" position="nearInlineEnd" anchorWidth="narrowAnchor">
			{LONG_CONTENT}
		</VrMinAnchor>
	);
}

/**
 * `'none'` in the same narrow span. This is the mode the content floor belongs
 * to, so it is the contrast case: it cannot wrap, so it overflows and
 * `position-try-fallbacks` repositions it. Compare against `'min-anchor'` above,
 * which wraps.
 */
export function VrNoneNarrowSpan(): ReactNode {
	return (
		<VrMinAnchor mode="none" position="nearInlineEnd" anchorWidth="narrowAnchor">
			{LONG_CONTENT}
		</VrMinAnchor>
	);
}

/**
 * `'match-anchor'` in the same narrow span. It has no floor at all: it is exactly
 * the anchor width, so it wraps to that width and ignores the slack left in the
 * span. `'min-anchor'` above wraps too, but only down to the anchor width, so it
 * is free to use that slack and comes out slightly wider. That difference is the
 * whole distinction between the two modes.
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
 * floor is not binding, so the popover grows past the anchor onto one line. This
 * is the case that distinguishes `'min-anchor'` from `'match-anchor'`, and it
 * shows that dropping the content floor does not stop the popover growing when
 * there is room for it.
 */
export function VrMinAnchorNarrowAnchorLongContent(): ReactNode {
	return (
		<VrMinAnchor mode="min-anchor" position="roomy" anchorWidth="narrowAnchor">
			{LONG_CONTENT}
		</VrMinAnchor>
	);
}

export default VrMinAnchorNarrowSpan;
