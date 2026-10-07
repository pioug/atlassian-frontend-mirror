/**
 * @jsxRuntime classic
 * @jsx jsx
 */
// Popover host boost: each hostile fixture must match its baseline; `Limit` fixtures
// pin what it does not cover. See `notes/decisions/host-specificity-boost.md`.
import { Fragment, type ReactNode, useRef, useState } from 'react';

import { cssMap, jsx } from '@compiled/react';

import { token } from '@atlaskit/tokens';
import { PopoverSurface } from '@atlaskit/top-layer/popover-surface';
import { Popover } from '@atlaskit/top-layer/popover/popover';
import { type TPlacementOptions } from '@atlaskit/top-layer/resolve-placement';
import { useAnchoredPopover } from '@atlaskit/top-layer/use-anchored-popover';

const styles = cssMap({
	page: {
		paddingBlock: token('space.400'),
		paddingInline: token('space.400'),
		minBlockSize: '240px',
	},
	anchor: {
		inlineSize: '200px',
	},
	// Wrapped text and a long word, so each inherited text property shows.
	content: {
		paddingBlock: token('space.100'),
		paddingInline: token('space.100'),
		maxInlineSize: '160px',
		overflow: 'hidden',
		font: token('font.body'),
	},
	// 2 x 140px in a 200px host shows each flex property. Bold fills beat the VR threshold.
	flexItem: {
		inlineSize: '140px',
		minInlineSize: '140px',
		marginBlock: token('space.100'),
		marginInline: token('space.100'),
		color: token('color.text.inverse'),
		font: token('font.body'),
	},
	flexItemShort: {
		backgroundColor: token('color.background.accent.blue.bolder'),
	},
	flexItemTall: {
		blockSize: '48px',
		backgroundColor: token('color.background.accent.purple.bolder'),
	},
	// Dark page for unpositioned fixtures, so a taller white surface shows.
	contrastPage: {
		backgroundColor: token('color.background.neutral.bold'),
		minBlockSize: '100vh',
		paddingBlockStart: '120px',
		paddingInlineStart: '240px',
	},
	// Fixed and outside the hostile container, so it never moves the anchor or host.
	caption: {
		position: 'fixed',
		insetBlockEnd: token('space.300'),
		insetInlineStart: token('space.300'),
		maxInlineSize: '720px',
		paddingBlock: token('space.100'),
		paddingInline: token('space.150'),
		borderRadius: token('radius.small'),
		color: token('color.text'),
		font: token('font.body'),
	},
	captionTitle: {
		font: token('font.body.large'),
		fontWeight: token('font.weight.bold'),
	},
});

// Grey: baseline. Green: must match baseline. Orange: limit, expected broken.
const captionKindStyles = cssMap({
	baseline: {
		backgroundColor: token('color.background.accent.gray.subtler'),
	},
	guard: {
		backgroundColor: token('color.background.accent.green.subtler'),
	},
	limit: {
		backgroundColor: token('color.background.accent.orange.subtler'),
	},
});

type TCaptionKind = 'baseline' | 'guard' | 'limit';

type TCaption = {
	kind: TCaptionKind;
	title: string;
	details: string[];
};

const captionKindLabels: Record<TCaptionKind, string> = {
	baseline: 'BASELINE',
	guard: 'GUARD',
	limit: 'LIMIT',
};

function Caption({ kind, title, details }: TCaption): ReactNode {
	return (
		<div css={[styles.caption, captionKindStyles[kind]]}>
			<div css={styles.captionTitle}>
				{captionKindLabels[kind]}: {title}
			</div>
			{details.map((detail) => (
				<div key={detail}>{detail}</div>
			))}
		</div>
	);
}

// Hostile consumer rules. Every declaration would visibly change the host.
const hostileStyles = cssMap({
	// (0,1,1): a child `div` of the consumer's class.
	childDiv: {
		// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors -- hostile fixture
		'& > div': {
			marginBlockStart: token('space.300'),
			marginInlineEnd: token('space.300'),
			marginBlockEnd: token('space.300'),
			marginInlineStart: token('space.300'),
			paddingBlockStart: token('space.200'),
			paddingInlineEnd: token('space.200'),
			paddingBlockEnd: token('space.200'),
			paddingInlineStart: token('space.200'),
			borderWidth: '4px',
			borderStyle: 'solid',
			borderColor: token('color.border.danger'),
			backgroundColor: token('color.background.accent.yellow.subtle'),
			opacity: 0.3,
			overflow: 'hidden',
			boxSizing: 'content-box',
			// Only the two-item content shows these.
			display: 'block',
			flexDirection: 'column',
			flexWrap: 'wrap',
			alignItems: 'center',
			justifyContent: 'flex-end',
			// A lost `position` does not show: top layer computes `relative` as `absolute`.
			position: 'relative',
			insetBlockStart: '10px',
			insetInlineEnd: '10px',
			insetBlockEnd: '10px',
			insetInlineStart: '10px',
			alignSelf: 'center',
			justifySelf: 'start',
			// Hooks write max sizes inline, so only the unpositioned host shows those.
			width: '50px',
			height: '10px',
			minWidth: '320px',
			maxWidth: '50px',
			minHeight: '120px',
			maxHeight: '10px',
			transform: 'translateX(80px)',
			translate: '40px 40px',
			scale: '1.5',
			rotate: '10deg',
			// Surface reset. `pointer-events` is omitted: snapshots cannot see it.
			whiteSpace: 'nowrap',
			wordBreak: 'break-all',
			overflowWrap: 'anywhere',
			textAlign: 'end',
			textIndent: '40px',
			textTransform: 'uppercase',
		},
	},
	// (0,1,0): any child of the consumer's class.
	childUniversal: {
		// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors -- hostile fixture
		'& > *': {
			marginBlockStart: token('space.300'),
			marginInlineEnd: token('space.300'),
			marginBlockEnd: token('space.300'),
			marginInlineStart: token('space.300'),
			paddingBlockStart: token('space.200'),
			paddingInlineEnd: token('space.200'),
			paddingBlockEnd: token('space.200'),
			paddingInlineStart: token('space.200'),
			borderWidth: '4px',
			borderStyle: 'solid',
			borderColor: token('color.border.danger'),
			backgroundColor: token('color.background.accent.yellow.subtle'),
			opacity: 0.3,
			overflow: 'hidden',
			boxSizing: 'content-box',
			display: 'block',
			flexDirection: 'column',
			flexWrap: 'wrap',
			alignItems: 'center',
			justifyContent: 'flex-end',
			position: 'relative',
			insetBlockStart: '10px',
			insetInlineEnd: '10px',
			insetBlockEnd: '10px',
			insetInlineStart: '10px',
			alignSelf: 'center',
			justifySelf: 'start',
			width: '50px',
			height: '10px',
			minWidth: '320px',
			maxWidth: '50px',
			minHeight: '120px',
			maxHeight: '10px',
			transform: 'translateX(80px)',
			translate: '40px 40px',
			scale: '1.5',
			rotate: '10deg',
			whiteSpace: 'nowrap',
			wordBreak: 'break-all',
			overflowWrap: 'anywhere',
			textAlign: 'end',
			textIndent: '40px',
			textTransform: 'uppercase',
		},
	},
	// (0,2,0): through the host's own attribute.
	childAttribute: {
		// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors -- hostile fixture
		'& > [popover]': {
			marginBlockStart: token('space.300'),
			marginInlineEnd: token('space.300'),
			marginBlockEnd: token('space.300'),
			marginInlineStart: token('space.300'),
			paddingBlockStart: token('space.200'),
			paddingInlineEnd: token('space.200'),
			paddingBlockEnd: token('space.200'),
			paddingInlineStart: token('space.200'),
			borderWidth: '4px',
			borderStyle: 'solid',
			borderColor: token('color.border.danger'),
			backgroundColor: token('color.background.accent.yellow.subtle'),
			opacity: 0.3,
			overflow: 'hidden',
			boxSizing: 'content-box',
			display: 'block',
			flexDirection: 'column',
			flexWrap: 'wrap',
			alignItems: 'center',
			justifyContent: 'flex-end',
			position: 'relative',
			insetBlockStart: '10px',
			insetInlineEnd: '10px',
			insetBlockEnd: '10px',
			insetInlineStart: '10px',
			alignSelf: 'center',
			justifySelf: 'start',
			width: '50px',
			height: '10px',
			minWidth: '320px',
			maxWidth: '50px',
			minHeight: '120px',
			maxHeight: '10px',
			transform: 'translateX(80px)',
			translate: '40px 40px',
			scale: '1.5',
			rotate: '10deg',
			whiteSpace: 'nowrap',
			wordBreak: 'break-all',
			overflowWrap: 'anywhere',
			textAlign: 'end',
			textIndent: '40px',
			textTransform: 'uppercase',
		},
	},
	// (0,3,1), like `.a .b .c > div`: one step below the boost.
	highSpecificity: {
		// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors -- hostile fixture
		'& [data-hostile-level-b] [data-hostile-level-c] > div': {
			marginBlockStart: token('space.300'),
			marginInlineEnd: token('space.300'),
			marginBlockEnd: token('space.300'),
			marginInlineStart: token('space.300'),
			paddingBlockStart: token('space.200'),
			paddingInlineEnd: token('space.200'),
			paddingBlockEnd: token('space.200'),
			paddingInlineStart: token('space.200'),
			borderWidth: '4px',
			borderStyle: 'solid',
			borderColor: token('color.border.danger'),
			backgroundColor: token('color.background.accent.yellow.subtle'),
			opacity: 0.3,
			overflow: 'hidden',
			boxSizing: 'content-box',
			display: 'block',
			flexDirection: 'column',
			flexWrap: 'wrap',
			alignItems: 'center',
			justifyContent: 'flex-end',
			position: 'relative',
			insetBlockStart: '10px',
			insetInlineEnd: '10px',
			insetBlockEnd: '10px',
			insetInlineStart: '10px',
			alignSelf: 'center',
			justifySelf: 'start',
			width: '50px',
			height: '10px',
			minWidth: '320px',
			maxWidth: '50px',
			minHeight: '120px',
			maxHeight: '10px',
			transform: 'translateX(80px)',
			translate: '40px 40px',
			scale: '1.5',
			rotate: '10deg',
			whiteSpace: 'nowrap',
			wordBreak: 'break-all',
			overflowWrap: 'anywhere',
			textAlign: 'end',
			textIndent: '40px',
			textTransform: 'uppercase',
		},
	},
	// (1,1,1): expected to win.
	limitId: {
		// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors -- hostile fixture
		'#vr-host-specificity-limit > div': {
			borderWidth: '4px',
			borderStyle: 'solid',
			borderColor: token('color.border.danger'),
			transform: 'translateX(80px)',
			opacity: 0.3,
		},
	},
	// (0,1,1) `!important`: expected to win.
	limitImportant: {
		// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors -- hostile fixture
		'& > div': {
			/* eslint-disable @atlaskit/ui-styling-standard/no-important-styles -- hostile fixture */
			borderWidth: '4px !important',
			borderStyle: 'solid !important',
			borderColor: `${token('color.border.danger')} !important`,
			transform: 'translateX(80px) !important',
			opacity: '0.3 !important',
			/* eslint-enable @atlaskit/ui-styling-standard/no-important-styles */
		},
	},
	// (0,1,1) descendant: the host holds, the content inside does not.
	limitDescendant: {
		// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors -- hostile fixture
		'& div': {
			paddingBlockStart: token('space.200'),
			paddingInlineEnd: token('space.200'),
			paddingBlockEnd: token('space.200'),
			paddingInlineStart: token('space.200'),
			borderWidth: '4px',
			borderStyle: 'solid',
			borderColor: token('color.border.danger'),
			backgroundColor: token('color.background.accent.yellow.subtle'),
			textTransform: 'uppercase',
		},
	},
});

type THostile =
	| 'none'
	| 'child-div'
	| 'child-universal'
	| 'child-attribute'
	| 'high-specificity'
	| 'limit-id'
	| 'limit-important'
	| 'limit-descendant';

function HostileContainer({
	hostile,
	children,
}: {
	hostile: THostile;
	children: ReactNode;
}): ReactNode {
	if (hostile === 'child-div') {
		return <div css={hostileStyles.childDiv}>{children}</div>;
	}
	if (hostile === 'child-universal') {
		return <div css={hostileStyles.childUniversal}>{children}</div>;
	}
	if (hostile === 'child-attribute') {
		return <div css={hostileStyles.childAttribute}>{children}</div>;
	}
	if (hostile === 'high-specificity') {
		return (
			<div css={hostileStyles.highSpecificity}>
				<div data-hostile-level-b="">
					<div data-hostile-level-c="">{children}</div>
				</div>
			</div>
		);
	}
	if (hostile === 'limit-id') {
		return (
			<div css={hostileStyles.limitId}>
				<div id="vr-host-specificity-limit">{children}</div>
			</div>
		);
	}
	if (hostile === 'limit-important') {
		return <div css={hostileStyles.limitImportant}>{children}</div>;
	}
	if (hostile === 'limit-descendant') {
		return <div css={hostileStyles.limitDescendant}>{children}</div>;
	}
	return <div>{children}</div>;
}

type TContent = 'text' | 'two-items';

// `unpositioned`: no hook, so no inline sizes; only the boost sets min and max sizes.
type TPositioning = 'anchored' | 'js-fallback' | 'unpositioned';

// `two-items` breaks the single-child contract on purpose, to show the flex properties.
function HostContent({ content }: { content: TContent }): ReactNode {
	if (content === 'two-items') {
		return (
			<Fragment>
				<div css={[styles.flexItem, styles.flexItemShort]}>Short</div>
				<div css={[styles.flexItem, styles.flexItemTall]}>Tall</div>
			</Fragment>
		);
	}
	return (
		<PopoverSurface>
			<div css={styles.content}>
				Popover content that wraps over a few lines. Supercalifragilisticexpialidocious
			</div>
		</PopoverSurface>
	);
}

function HostFixture({
	hostile,
	caption,
	placement = { edge: 'end' },
	inlineSize = 'content',
	isInitiallyOpen = true,
	content = 'text',
	positioning = 'anchored',
}: {
	hostile: THostile;
	caption: TCaption;
	placement?: TPlacementOptions;
	inlineSize?: 'content' | 'match-anchor';
	isInitiallyOpen?: boolean;
	content?: TContent;
	positioning?: TPositioning;
}): ReactNode {
	const anchorRef = useRef<HTMLButtonElement>(null);
	const popoverRef = useRef<HTMLDivElement>(null);
	const [isOpen, setIsOpen] = useState(isInitiallyOpen);

	useAnchoredPopover({
		anchorRef,
		popoverRef,
		placement,
		isOpen,
		inlineSize,
		isEnabled: positioning !== 'unpositioned',
		forceFallbackPositioning: positioning === 'js-fallback',
	});

	return (
		<div css={[styles.page, positioning === 'unpositioned' && styles.contrastPage]}>
			{/* Same label everywhere, so snapshots compare pixel for pixel. */}
			<button
				ref={anchorRef}
				type="button"
				css={styles.anchor}
				onClick={() => setIsOpen((previous) => !previous)}
			>
				anchor
			</button>
			<HostileContainer hostile={hostile}>
				<Popover
					ref={popoverRef}
					isOpen={isOpen}
					role="dialog"
					label={`Host specificity: ${hostile}`}
					onClose={() => setIsOpen(false)}
				>
					<HostContent content={content} />
				</Popover>
			</HostileContainer>
			<Caption {...caption} />
		</div>
	);
}

export function VrHostSpecificityBaseline(): ReactNode {
	return (
		<HostFixture
			hostile="none"
			caption={{
				kind: 'baseline',
				title: 'plain popover, no hostile rule',
				details: [
					'Reference for: child-div, child-universal, child-attribute, high-specificity',
					'The long word is clipped by design',
				],
			}}
		/>
	);
}

export function VrHostSpecificityChildDiv(): ReactNode {
	return (
		<HostFixture
			hostile="child-div"
			caption={{
				kind: 'guard',
				title: 'hostile rule `.container > div` (0,1,1)',
				details: ['Expect: identical to the baseline popover'],
			}}
		/>
	);
}

export function VrHostSpecificityChildUniversal(): ReactNode {
	return (
		<HostFixture
			hostile="child-universal"
			caption={{
				kind: 'guard',
				title: 'hostile rule `.container > *` (0,1,0)',
				details: ['Expect: identical to the baseline popover'],
			}}
		/>
	);
}

export function VrHostSpecificityChildAttribute(): ReactNode {
	return (
		<HostFixture
			hostile="child-attribute"
			caption={{
				kind: 'guard',
				title: 'hostile rule `.container > [popover]` (0,2,0)',
				details: ['Expect: identical to the baseline popover'],
			}}
		/>
	);
}

export function VrHostSpecificityHighSpecificity(): ReactNode {
	return (
		<HostFixture
			hostile="high-specificity"
			caption={{
				kind: 'guard',
				title: 'hostile rule `.a .b .c > div` (0,3,1)',
				details: ['Expect: identical to the baseline popover'],
			}}
		/>
	);
}

export function VrHostSpecificityFlexBaseline(): ReactNode {
	return (
		<HostFixture
			hostile="none"
			content="two-items"
			inlineSize="match-anchor"
			caption={{
				kind: 'baseline',
				title: 'two items in a host as wide as the anchor',
				details: [
					'Blue and purple items sit side by side in one row',
					'Each item is 140px, so together they overflow the 200px host',
					'Reference for: flex-hostile',
				],
			}}
		/>
	);
}

export function VrHostSpecificityFlexHostile(): ReactNode {
	return (
		<HostFixture
			hostile="child-div"
			content="two-items"
			inlineSize="match-anchor"
			caption={{
				kind: 'guard',
				title:
					'hostile `.container > div` with flex-direction, flex-wrap, align-items, justify-content',
				details: ['Expect: identical to flex-baseline, the two items stay in one row'],
			}}
		/>
	);
}

export function VrHostSpecificityInlineEndBaseline(): ReactNode {
	return (
		<HostFixture
			hostile="none"
			placement={{ axis: 'inline', edge: 'end' }}
			caption={{
				kind: 'baseline',
				title: 'popover placed at the inline end of the anchor',
				details: ['Reference for: inline-end-hostile'],
			}}
		/>
	);
}

export function VrHostSpecificityInlineEndHostile(): ReactNode {
	return (
		<HostFixture
			hostile="child-div"
			placement={{ axis: 'inline', edge: 'end' }}
			caption={{
				kind: 'guard',
				title: 'hostile `.container > div` with inset and position rules',
				details: ['Expect: identical to inline-end-baseline, the popover stays beside the anchor'],
			}}
		/>
	);
}

export function VrHostSpecificityInlineWritesBaseline(): ReactNode {
	return (
		<HostFixture
			hostile="none"
			inlineSize="match-anchor"
			placement={{ offset: { gap: 4 } }}
			caption={{
				kind: 'baseline',
				title: 'popover as wide as the anchor, 4px gap',
				details: ['Reference for: inline-writes-hostile'],
			}}
		/>
	);
}

// DS inline writes (anchor width, gap) beat the hostile rule.
export function VrHostSpecificityInlineWritesHostile(): ReactNode {
	return (
		<HostFixture
			hostile="child-div"
			inlineSize="match-anchor"
			placement={{ offset: { gap: 4 } }}
			caption={{
				kind: 'guard',
				title: 'hostile `.container > div` with width: 50px and margin: 24px',
				details: ['Expect: identical to inline-writes-baseline, same width and 4px gap'],
			}}
		/>
	);
}

export function VrHostSpecificityJsFallbackBaseline(): ReactNode {
	return (
		<HostFixture
			hostile="none"
			positioning="js-fallback"
			caption={{
				kind: 'baseline',
				title: 'popover placed by the JavaScript fallback',
				details: ['Reference for: js-fallback-hostile'],
			}}
		/>
	);
}

export function VrHostSpecificityJsFallbackHostile(): ReactNode {
	return (
		<HostFixture
			hostile="child-div"
			positioning="js-fallback"
			caption={{
				kind: 'guard',
				title: 'JavaScript fallback with hostile rule `.container > div`',
				details: ['Expect: identical to js-fallback-baseline'],
			}}
		/>
	);
}

export function VrHostSpecificityUnpositionedBaseline(): ReactNode {
	return (
		<HostFixture
			hostile="none"
			positioning="unpositioned"
			caption={{
				kind: 'baseline',
				title: 'no positioning hook',
				details: [
					'The popover sits in the top-left corner of the viewport, clear of the anchor',
					'Reference for: unpositioned-hostile',
				],
			}}
		/>
	);
}

export function VrHostSpecificityUnpositionedHostile(): ReactNode {
	return (
		<HostFixture
			hostile="child-div"
			positioning="unpositioned"
			caption={{
				kind: 'guard',
				title: 'no positioning hook, hostile min and max sizes',
				details: [
					'Expect: identical to unpositioned-baseline, the popover keeps its size',
					'The popover sits flush in the top-left corner because there is no positioning hook',
				],
			}}
		/>
	);
}

// Closed hosts unmount today; fails if one stays mounted and visible.
export function VrHostSpecificityClosedHostile(): ReactNode {
	return (
		<HostFixture
			hostile="child-div"
			isInitiallyOpen={false}
			caption={{
				kind: 'guard',
				title: 'closed popover, hostile `.container > div { display: block }`',
				details: [
					'Expect: only the anchor shows, no popover',
					'A closed `Popover` unmounts its host, so the hostile rule has nothing to reach today',
				],
			}}
		/>
	);
}

export function VrHostSpecificityLimitId(): ReactNode {
	return (
		<HostFixture
			hostile="limit-id"
			caption={{
				kind: 'limit',
				title: 'an ID rule `.container #id > div` (1,1,1) beats the defence',
				details: ['Expected by design: red border, 80px shift to the right, 30% fade'],
			}}
		/>
	);
}

export function VrHostSpecificityLimitImportant(): ReactNode {
	return (
		<HostFixture
			hostile="limit-important"
			caption={{
				kind: 'limit',
				title: 'an `!important` rule beats the defence',
				details: ['Expected by design: red border, 80px shift to the right, 30% fade'],
			}}
		/>
	);
}

export function VrHostSpecificityLimitDescendant(): ReactNode {
	return (
		<HostFixture
			hostile="limit-descendant"
			caption={{
				kind: 'limit',
				title: 'a descendant rule `.container div` reaches inside the host',
				details: [
					'Expected by design: red borders, padding, yellow fill and UPPER-CASE text inside the popover',
					'The outermost red box is the surface, not the host: the invisible host box has no border',
				],
			}}
		/>
	);
}

export default VrHostSpecificityBaseline;
