/**
 * @jsxRuntime classic
 * @jsx jsx
 */
// Dialog host boost: each hostile fixture must match its baseline; `Limit` fixtures
// pin what it does not cover. See `notes/decisions/host-specificity-boost.md`.
import { Fragment, type ReactNode, useEffect, useRef } from 'react';

import { cssMap, jsx } from '@compiled/react';

import noop from '@atlaskit/ds-lib/noop';
import { token } from '@atlaskit/tokens';
import { Dialog } from '@atlaskit/top-layer/dialog-content';

const styles = cssMap({
	// Bold card, wrapped text and a long word, so every change shows.
	card: {
		inlineSize: '240px',
		paddingBlock: token('space.100'),
		paddingInline: token('space.100'),
		overflow: 'hidden',
		backgroundColor: token('color.background.accent.blue.bolder'),
		color: token('color.text.inverse'),
		font: token('font.body'),
	},
	// Manual popover above the backdrop, outside the hostile container.
	caption: {
		position: 'fixed',
		insetBlockStart: 'auto',
		insetInlineEnd: 'auto',
		insetBlockEnd: token('space.300'),
		insetInlineStart: token('space.300'),
		marginBlockStart: '0px',
		marginInlineEnd: '0px',
		marginBlockEnd: '0px',
		marginInlineStart: '0px',
		borderWidth: '0px',
		overflow: 'visible',
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
	const captionRef = useRef<HTMLDivElement>(null);

	// Runs after the dialog's `showModal`, so it lands above it. JSX `div` types lack `popover`.
	useEffect(() => {
		const caption = captionRef.current;
		caption?.setAttribute('popover', 'manual');
		caption?.showPopover();
	}, []);

	return (
		<div ref={captionRef} css={[styles.caption, captionKindStyles[kind]]}>
			<div css={styles.captionTitle}>
				{captionKindLabels[kind]}: {title}
			</div>
			{details.map((detail) => (
				<div key={detail}>{detail}</div>
			))}
		</div>
	);
}

// `xcss` geometry, as drawer and modal-dialog set it.
const positionedStyles = cssMap({
	root: {
		margin: '0px',
		width: '360px',
		height: '240px',
	},
});

// Hostile consumer rules. Every declaration would visibly change the host.
const hostileStyles = cssMap({
	// (0,1,0): any child of the consumer's class.
	childUniversal: {
		// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors -- hostile fixture
		'& > *': {
			paddingBlockStart: token('space.300'),
			paddingInlineEnd: token('space.300'),
			paddingBlockEnd: token('space.300'),
			paddingInlineStart: token('space.300'),
			borderWidth: '6px',
			borderStyle: 'solid',
			borderColor: token('color.border.danger'),
			backgroundColor: token('color.background.accent.yellow.subtle'),
			opacity: 0.3,
			// `min-height` beats `max-height`, so each shows when it alone loses.
			minWidth: '560px',
			minHeight: '360px',
			maxHeight: '60px',
			// A lost `position` does not show. The self-alignments show only when positioned.
			position: 'relative',
			insetBlockEnd: '160px',
			alignSelf: 'end',
			justifySelf: 'end',
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
	// (0,1,1): a child `dialog` of the consumer's class.
	childDialog: {
		// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors -- hostile fixture
		'& > dialog': {
			paddingBlockStart: token('space.300'),
			paddingInlineEnd: token('space.300'),
			paddingBlockEnd: token('space.300'),
			paddingInlineStart: token('space.300'),
			borderWidth: '6px',
			borderStyle: 'solid',
			borderColor: token('color.border.danger'),
			backgroundColor: token('color.background.accent.yellow.subtle'),
			opacity: 0.3,
			minWidth: '560px',
			minHeight: '360px',
			maxHeight: '60px',
			position: 'relative',
			insetBlockEnd: '160px',
			alignSelf: 'end',
			justifySelf: 'end',
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
	// (0,3,1), like `.a .b .c > dialog`: one step below the boost.
	highSpecificity: {
		// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors -- hostile fixture
		'& [data-hostile-level-b] [data-hostile-level-c] > dialog': {
			paddingBlockStart: token('space.300'),
			paddingInlineEnd: token('space.300'),
			paddingBlockEnd: token('space.300'),
			paddingInlineStart: token('space.300'),
			borderWidth: '6px',
			borderStyle: 'solid',
			borderColor: token('color.border.danger'),
			backgroundColor: token('color.background.accent.yellow.subtle'),
			opacity: 0.3,
			minWidth: '560px',
			minHeight: '360px',
			maxHeight: '60px',
			position: 'relative',
			insetBlockEnd: '160px',
			alignSelf: 'end',
			justifySelf: 'end',
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
	// (0,1,1): hides the open dialog if `display` loses the boost.
	display: {
		// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors -- hostile fixture
		'& > dialog': {
			display: 'none',
		},
	},
	// (1,1,1): expected to win.
	limitId: {
		// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors -- hostile fixture
		'#vr-dialog-host-specificity-limit > dialog': {
			borderWidth: '6px',
			borderStyle: 'solid',
			borderColor: token('color.border.danger'),
			transform: 'translateX(80px)',
			opacity: 0.3,
		},
	},
	// (0,1,1) `!important`: expected to win.
	limitImportant: {
		// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors -- hostile fixture
		'& > dialog': {
			/* eslint-disable @atlaskit/ui-styling-standard/no-important-styles -- hostile fixture */
			borderWidth: '6px !important',
			borderStyle: 'solid !important',
			borderColor: `${token('color.border.danger')} !important`,
			transform: 'translateX(80px) !important',
			opacity: '0.3 !important',
			/* eslint-enable @atlaskit/ui-styling-standard/no-important-styles */
		},
	},
	// (0,1,1) on the unboosted `xcss` properties: expected to win.
	limitXcss: {
		// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors -- hostile fixture
		'& > dialog': {
			marginBlockStart: '0px',
			marginInlineEnd: '0px',
			marginBlockEnd: '0px',
			marginInlineStart: '0px',
			insetBlockStart: token('space.500'),
			insetInlineStart: token('space.500'),
			insetInlineEnd: 'auto',
			width: '200px',
			height: '120px',
			maxWidth: '200px',
			overflow: 'hidden',
			scrollbarGutter: 'stable',
		},
	},
});

type THostile =
	| 'none'
	| 'child-universal'
	| 'child-dialog'
	| 'high-specificity'
	| 'display'
	| 'limit-id'
	| 'limit-important'
	| 'limit-xcss';

function HostileContainer({
	hostile,
	children,
}: {
	hostile: THostile;
	children: ReactNode;
}): ReactNode {
	if (hostile === 'child-universal') {
		return <div css={hostileStyles.childUniversal}>{children}</div>;
	}
	if (hostile === 'child-dialog') {
		return <div css={hostileStyles.childDialog}>{children}</div>;
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
	if (hostile === 'display') {
		return <div css={hostileStyles.display}>{children}</div>;
	}
	if (hostile === 'limit-id') {
		return (
			<div css={hostileStyles.limitId}>
				<div id="vr-dialog-host-specificity-limit">{children}</div>
			</div>
		);
	}
	if (hostile === 'limit-important') {
		return <div css={hostileStyles.limitImportant}>{children}</div>;
	}
	if (hostile === 'limit-xcss') {
		return <div css={hostileStyles.limitXcss}>{children}</div>;
	}
	return <div>{children}</div>;
}

function DialogFixture({
	hostile,
	caption,
	isPositioned = false,
	hasLongWord = true,
}: {
	hostile: THostile;
	caption: TCaption;
	isPositioned?: boolean;
	// Off where `opacity` wins: VR Chromium paints a dark strip over the clipped word.
	hasLongWord?: boolean;
}): ReactNode {
	return (
		<Fragment>
			<HostileContainer hostile={hostile}>
				<Dialog
					isOpen
					onClose={noop}
					label={`Dialog host specificity: ${hostile}`}
					xcss={isPositioned ? positionedStyles.root : undefined}
				>
					<div css={styles.card}>
						Dialog content that wraps over a few lines.
						{hasLongWord ? ' Pneumonoultramicroscopicsilicovolcanoconiosis' : null}
					</div>
				</Dialog>
			</HostileContainer>
			<Caption {...caption} />
		</Fragment>
	);
}

export function VrDialogHostSpecificityBaseline(): ReactNode {
	return (
		<DialogFixture
			hostile="none"
			caption={{
				kind: 'baseline',
				title: 'plain dialog, no hostile rule',
				details: ['Reference for: child-universal, child-dialog, high-specificity, display'],
			}}
		/>
	);
}

export function VrDialogHostSpecificityChildUniversal(): ReactNode {
	return (
		<DialogFixture
			hostile="child-universal"
			caption={{
				kind: 'guard',
				title: 'hostile rule `.container > *` (0,1,0)',
				details: ['Expect: identical to the baseline dialog'],
			}}
		/>
	);
}

export function VrDialogHostSpecificityChildDialog(): ReactNode {
	return (
		<DialogFixture
			hostile="child-dialog"
			caption={{
				kind: 'guard',
				title: 'hostile rule `.container > dialog` (0,1,1)',
				details: ['Expect: identical to the baseline dialog'],
			}}
		/>
	);
}

export function VrDialogHostSpecificityHighSpecificity(): ReactNode {
	return (
		<DialogFixture
			hostile="high-specificity"
			caption={{
				kind: 'guard',
				title: 'hostile rule `.a .b .c > dialog` (0,3,1)',
				details: ['Expect: identical to the baseline dialog'],
			}}
		/>
	);
}

export function VrDialogHostSpecificityDisplay(): ReactNode {
	return (
		<DialogFixture
			hostile="display"
			caption={{
				kind: 'guard',
				title: 'hostile rule `.container > dialog { display: none }`',
				details: ['Expect: identical to the baseline dialog, it stays visible'],
			}}
		/>
	);
}

export function VrDialogHostSpecificityPositionedBaseline(): ReactNode {
	return (
		<DialogFixture
			hostile="none"
			isPositioned
			caption={{
				kind: 'baseline',
				title: 'dialog with consumer geometry through `xcss`',
				details: [
					'margin 0, 360 by 240: the dialog sits in the top-left corner',
					'The empty grey area inside the black border is the dialog, the blue card is 240px plus padding wide',
					'Reference for: positioned-hostile',
				],
			}}
		/>
	);
}

// Non-`auto` margins let a lost `align-self` / `justify-self` show.
export function VrDialogHostSpecificityPositionedHostile(): ReactNode {
	return (
		<DialogFixture
			hostile="child-dialog"
			isPositioned
			caption={{
				kind: 'guard',
				title: 'consumer `xcss` geometry with hostile rule `.container > dialog`',
				details: ['Expect: identical to positioned-baseline, the dialog is not moved'],
			}}
		/>
	);
}

export function VrDialogHostSpecificityLimitId(): ReactNode {
	return (
		<DialogFixture
			hostile="limit-id"
			hasLongWord={false}
			caption={{
				kind: 'limit',
				title: 'an ID rule `.container #id > dialog` (1,1,1) beats the defence',
				details: ['Expected by design: red border, 80px shift to the right, 30% fade'],
			}}
		/>
	);
}

export function VrDialogHostSpecificityLimitImportant(): ReactNode {
	return (
		<DialogFixture
			hostile="limit-important"
			hasLongWord={false}
			caption={{
				kind: 'limit',
				title: 'an `!important` rule beats the defence',
				details: ['Expected by design: red border, 80px shift to the right, 30% fade'],
			}}
		/>
	);
}

export function VrDialogHostSpecificityLimitXcss(): ReactNode {
	return (
		<DialogFixture
			hostile="limit-xcss"
			caption={{
				kind: 'limit',
				title: 'a rule on the 9 `xcss` properties is not defended',
				details: [
					'Expected by design: the dialog moves to 40px, 40px, resizes to 200 by 120 and clips the card',
				],
			}}
		/>
	);
}

export default VrDialogHostSpecificityBaseline;
