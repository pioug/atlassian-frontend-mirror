// eslint-disable-next-line @atlaskit/ui-styling-standard/use-compiled -- Ignored via go/DSP-18766
/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import { css, jsx } from '@compiled/react';
import { token } from '@atlaskit/tokens';

// TODO: remove this override behaviour for @atlaskit/icon-object
const iconObjectOverrideStyles = css({
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors
	'& > span': {
		height: '16px',
		width: '14px',
		position: 'absolute',
		top: 0,
		left: 0,
		// eslint-disable-next-line @atlaskit/design-system/use-tokens-typography
		lineHeight: '14px',
		// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors
		'& > svg': {
			position: 'absolute',
			top: '50%',
			left: '50%',
			transform: 'translate(-50%, -50%)',
		},
	},
});

// TODO: remove this override behaviour for @atlaskit/icon
const iconOverrideStyles = css({
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors
	'& > * > span': {
		height: '16px',
		width: '14px',
		position: 'absolute',
		top: 0,
		left: 0,
		// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors
		'& > svg': {
			position: 'absolute',
			top: '50%',
			left: '50%',
			transform: 'translate(-50%, -50%)',
		},
	},
});

const iconWrapperStyles = css({
	userSelect: 'none',
});

// Wraps all icons represented in Inline Links. Icons have three sources/types:
// - JSON-LD: from the generator.icon property coming back from ORS.
// - @atlaskit/icon: for lock icons, unauthorized, etc.
// - @atlaskit/icon-object: for object icons, e.g. repository, branch, etc.
// NB: the first set of overrides style icons imported from @atlaskit/icon-object correctly.
// NB: the second set of overrides style icons imported from @atlaskit/icon correctly.
export const IconWrapper = ({
	children,
	...props
}: React.DetailedHTMLProps<React.HTMLAttributes<HTMLSpanElement>, HTMLSpanElement>) => (
	<span css={[iconWrapperStyles, iconObjectOverrideStyles, iconOverrideStyles]} {...props}>
		{children}
	</span>
);

const emojiWrapperStyles = css({
	display: 'inline-block',
	marginRight: token('space.025', '2px'),
	userSelect: 'none',
});

// Wraps all emoji in Inline Links similar to icon
export const EmojiWrapper = ({
	children,
	...props
}: React.DetailedHTMLProps<React.HTMLAttributes<HTMLSpanElement>, HTMLSpanElement>) => (
	<span css={[emojiWrapperStyles, iconObjectOverrideStyles, iconOverrideStyles]} {...props}>
		{children}
	</span>
);

const iconTitleWrapperStyles = css({
	whiteSpace: 'pre-wrap',
	wordBreak: 'break-all',
});

// The main 'wrapping' element, title of the content.
// NB: `white-space` adds little whitespace before wrapping.
// NB: `word-break` line breaks as soon as an overflow takes place.
export const IconTitleWrapper = ({
	children,
	...props
}: React.DetailedHTMLProps<React.HTMLAttributes<HTMLSpanElement>, HTMLSpanElement>) => (
	<span css={iconTitleWrapperStyles} {...props}>
		{children}
	</span>
);

const lozengeWrapperStyles = css({
	display: 'inline-block',
	verticalAlign: '1px',
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors -- Ignored via go/DSP-18766
	'& > span': {
		marginLeft: token('space.050', '4px'),
		paddingTop: token('space.025', '2px'),
		paddingRight: 0,
		paddingBottom: token('space.025', '2px'),
		paddingLeft: 0,
	},
});

// TODO: Replace overrides with proper AtlasKit solution.
export const LozengeWrapper = ({
	children,
	...props
}: React.DetailedHTMLProps<React.HTMLAttributes<HTMLSpanElement>, HTMLSpanElement>) => (
	<span css={lozengeWrapperStyles} {...props}>
		{children}
	</span>
);

const lozengeBlockWrapperStyles = css({
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors -- Ignored via go/DSP-18766
	'& > span': {
		marginLeft: token('space.050', '4px'),
		paddingTop: token('space.025', '2px'),
		paddingRight: 0,
		paddingBottom: token('space.025', '2px'),
		paddingLeft: 0,
	},
});

// TODO: Replace overrides with proper AtlasKit solution.
export const LozengeBlockWrapper = ({
	children,
	...props
}: React.DetailedHTMLProps<React.HTMLAttributes<HTMLSpanElement>, HTMLSpanElement>) => (
	<span css={lozengeBlockWrapperStyles} {...props}>
		{children}
	</span>
);

const rightIconPositionWrapperStyles = css({
	marginLeft: token('space.025', '2px'),
	marginRight: token('space.050', '4px'),
	position: 'relative',
	display: 'inline-block',
});

export const RightIconPositionWrapper = ({
	children,
	...props
}: React.DetailedHTMLProps<React.HTMLAttributes<HTMLSpanElement>, HTMLSpanElement>) => (
	<span css={rightIconPositionWrapperStyles} {...props}>
		{children}
	</span>
);

const iconPositionWrapperStyles = css({
	marginRight: token('space.050', '4px'),
	position: 'relative',
	display: 'inline-block',
});

// The following components are used to absolutely position icons in the vertical center.
// - IconPositionWrapper: the `relative` parent which has no height in itself.
// - IconEmptyWrapper: the child which forces `IconPositionWrapper` to have a height.
export const IconPositionWrapper = ({
	children,
	...props
}: React.DetailedHTMLProps<React.HTMLAttributes<HTMLSpanElement>, HTMLSpanElement>) => (
	<span css={iconPositionWrapperStyles} {...props}>
		{children}
	</span>
);

const iconEmptyWrapperStyles = css({
	width: '14px',
	height: '100%',
	display: 'inline-block',
	opacity: 0,
});

export const IconEmptyWrapper = ({
	children,
	...props
}: React.DetailedHTMLProps<React.HTMLAttributes<HTMLSpanElement>, HTMLSpanElement>) => (
	<span css={iconEmptyWrapperStyles} {...props}>
		{children}
	</span>
);
