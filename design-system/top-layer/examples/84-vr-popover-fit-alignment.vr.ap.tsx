/**
 * @jsxRuntime classic
 * @jsx jsx
 */
/**
 * VR fixtures for the ALIGNMENT of a fitting popover with `align: 'start'` or
 * `align: 'end'`: its border box lands on the anchor's edge, not 5px in from it.
 * `getFitMarginDeclarations` used to pad BOTH cross-axis margins, and a `span-*`
 * cell aligns the popover's MARGIN box to the anchor's edge, so only the
 * viewport-facing side may carry the padding.
 *
 * Each fixture lays a 2px ruler in flow against the anchor's aligned edge and
 * renders the popover as a solid block, so a 5px gap between the two is
 * unmistakable in a snapshot. The page is roomy, so nothing moves the popover.
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
	// Well clear of every viewport edge, so no fallback fires. A flex box, so the
	// ruler's edge IS the trigger's edge with no positioning arithmetic.
	inner: {
		position: 'absolute',
		insetInlineStart: '50%',
		insetBlockStart: '50%',
		display: 'flex',
		alignItems: 'flex-start',
	},
	// Ruler beside the trigger on the inline axis: both start at the top, and the
	// ruler runs down past the popover.
	innerRow: {
		flexDirection: 'row',
	},
	// Ruler above the trigger: both start at the inline start, and the ruler runs
	// toward the inline end past the popover.
	innerColumn: {
		flexDirection: 'column',
	},
	trigger: {
		width: '80px',
		paddingBlock: token('space.100'),
		backgroundColor: token('color.background.neutral.bold'),
		color: token('color.text.inverse'),
	},
	ruler: {
		flexShrink: 0,
		backgroundColor: token('color.background.danger.bold'),
	},
	rulerVertical: {
		inlineSize: '2px',
		blockSize: '220px',
	},
	rulerHorizontal: {
		inlineSize: '280px',
		blockSize: '2px',
	},
	// The popover's only child, so the flex context stretches it to the host and
	// its edges ARE the popover's. Solid, so those edges are crisp.
	content: {
		backgroundColor: token('color.background.brand.bold'),
		color: token('color.text.inverse'),
		paddingInline: token('space.100'),
		paddingBlock: token('space.100'),
		overflow: 'auto',
	},
});

/**
 * The edge the ruler sits on, which is the edge the popover aligns to.
 */
type TRulerEdge = 'inline-start' | 'inline-end' | 'block-start';

/**
 * An auto-opened popover fitting the available block space, aligned to one edge
 * of an 80px trigger, with a ruler on that edge.
 */
function VrFitAlignment({
	label,
	placement,
	rulerEdge,
}: {
	label: string;
	placement: TPlacementOptions;
	rulerEdge: TRulerEdge;
}) {
	const anchorRef = useRef<HTMLButtonElement>(null);
	const popoverRef = useRef<HTMLDivElement>(null);
	const [isOpen, setIsOpen] = useState(true);

	useAnchoredPopover({
		anchorRef: anchorRef,
		popoverRef,
		placement,
		isOpen,
		blockSize: 'max-available',
	});

	const isBlockEdge = rulerEdge === 'block-start';
	const ruler = (
		<div css={[styles.ruler, isBlockEdge ? styles.rulerHorizontal : styles.rulerVertical]} />
	);

	return (
		<div css={styles.container}>
			<div css={[styles.inner, isBlockEdge ? styles.innerColumn : styles.innerRow]}>
				{rulerEdge === 'inline-end' ? null : ruler}
				<Pressable
					ref={anchorRef}
					xcss={styles.trigger}
					onClick={() => setIsOpen((previous) => !previous)}
				>
					{label}
				</Pressable>
				{rulerEdge === 'inline-end' ? ruler : null}
			</div>
			<Popover
				ref={popoverRef}
				isOpen={isOpen}
				role="dialog"
				label={label}
				onClose={() => setIsOpen(false)}
				placement={placement}
			>
				<div css={styles.content}>
					<Text color="inherit">{label} fitting</Text>
				</div>
			</Popover>
		</div>
	);
}

/**
 * `bottom-start`: the popover's inline-start edge on the trigger's inline-start
 * edge. Used to render 5px toward the inline end of it.
 */
export function VrFitAlignBottomStart(): ReactNode {
	return (
		<VrFitAlignment
			label="bottom-start"
			placement={{ axis: 'block', edge: 'end', align: 'start' }}
			rulerEdge="inline-start"
		/>
	);
}

/**
 * `bottom-end`: the popover's inline-end edge on the trigger's inline-end edge.
 * Used to render 5px short of it.
 */
export function VrFitAlignBottomEnd(): ReactNode {
	return (
		<VrFitAlignment
			label="bottom-end"
			placement={{ axis: 'block', edge: 'end', align: 'end' }}
			rulerEdge="inline-end"
		/>
	);
}

/**
 * `right-start`: the popover's block-start edge on the trigger's. The cross axis
 * is block here, so this is the same defect on the other axis.
 */
export function VrFitAlignRightStart(): ReactNode {
	return (
		<VrFitAlignment
			label="right-start"
			placement={{ axis: 'inline', edge: 'end', align: 'start' }}
			rulerEdge="block-start"
		/>
	);
}

export default VrFitAlignBottomStart;
