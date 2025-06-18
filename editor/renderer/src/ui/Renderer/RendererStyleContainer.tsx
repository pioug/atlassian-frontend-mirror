/* eslint-disable @atlaskit/ui-styling-standard/no-important-styles */
/* eslint-disable @atlaskit/ui-styling-standard/no-imported-style-values */
/* eslint-disable @atlaskit/ui-styling-standard/no-nested-selectors, @atlaskit/ui-styling-standard/no-unsafe-values */
/**
 * @jsxRuntime classic
 * @jsx jsx
 */
// eslint-disable-next-line @atlaskit/ui-styling-standard/use-compiled
import { css, jsx } from '@emotion/react';
import {
	B300,
	B400,
	B500,
	N20,
	N200,
	N30A,
	N40A,
	N60A,
	N800,
	R50,
	R500,
	Y300,
	Y75,
} from '@atlaskit/theme/colors';
import { token } from '@atlaskit/tokens';
import { type RendererWrapperProps } from './index';
import { FullPagePadding } from './style';
import { fg } from '@atlaskit/platform-feature-flags';
import { RendererCssClassName } from '../../consts';
import {
	akEditorBlockquoteBorderColor,
	akEditorCalculatedWideLayoutWidth,
	akEditorCalculatedWideLayoutWidthSmallViewport,
	akEditorDefaultLayoutWidth,
	akEditorFullWidthLayoutWidth,
	akEditorGutterPadding,
	akEditorLineHeight,
	akEditorSelectedNodeClassName,
	akEditorShadowZIndex,
	akEditorStickyHeaderZIndex,
	akEditorTableBorder,
	akEditorTableCellMinWidth,
	akEditorTableNumberColumnWidth,
	akEditorTableToolbar,
	blockNodesVerticalMargin,
	gridMediumMaxWidth,
} from '@atlaskit/editor-shared-styles';
import { INLINE_IMAGE_WRAPPER_CLASS_NAME } from '@atlaskit/editor-common/media-inline';
import { HeadingAnchorWrapperClassName } from '../../react/nodes/heading-anchor';
import {
	CodeBlockSharedCssClassName,
	DateSharedCssClassName,
	listItemCounterPadding,
	richMediaClassName,
	SmartCardSharedCssClassName,
	tableCellBorderWidth,
	tableCellMinWidth,
	tableCellPadding,
	tableMarginTop,
	TableSharedCssClassName,
	TaskDecisionSharedCssClassName,
} from '@atlaskit/editor-common/styles';
import { bulletListSelector, orderedListSelector } from '@atlaskit/adf-schema';
import { shadowClassNames, shadowObserverClassNames } from '@atlaskit/editor-common/ui';
import { browser } from '@atlaskit/editor-common/browser';
import { editorExperiment } from '@atlaskit/tmp-editor-statsig/experiments';
import { isStickyScrollbarEnabled, isTableResizingEnabled } from '../../react/nodes/table';
import { SORTABLE_COLUMN_ICON_CLASSNAME } from '@atlaskit/editor-common/table';
import { LightWeightCodeBlockCssClassName } from '../../react/nodes/codeBlock/components/lightWeightCodeBlock';
import { editorUGCToken } from '@atlaskit/editor-common/ugc-tokens';
import { getBaseFontSize } from './get-base-font-size';

const wrappedMediaBreakoutPoint = 410;
const TELEPOINTER_ID = 'ai-streaming-telepointer';
const tableShadowWidth = 32;
const LAYOUT_BREAKPOINT_RENDERER = 629;
// originally defined from packages/editor/editor-plugin-table/src/ui/common-styles.ts
// Temporarily ignoring the below the owning team can add the ticket number for the TODO.  Context: https://atlassian.slack.com/archives/CPUEVD9MY/p1741565387326829
// eslint-disable-next-line @atlaskit/editor/enforce-todo-comment-format
// TODO: tableRowHeight can be moved into `@atlaskit/editor-common/table`
const tableRowHeight = 44;

const isBackgroundClipBrowserFixNeeded = () =>
	browser.isGecko || browser.isIE || (browser.isMac && browser.isChrome);

// styles are copied from ./style.tsx
// eslint-disable-next-line @atlaskit/ui-styling-standard/no-exported-styles, @atlaskit/design-system/no-css-tagged-template-expression, @atlaskit/design-system/consistent-css-prop-usage
const baseStyles = css({
	// eslint-disable-next-line @atlaskit/design-system/use-tokens-typography
	fontSize: 'var(--ak-renderer-base-font-size)',
	// eslint-disable-next-line @atlaskit/design-system/use-tokens-typography
	lineHeight: '1.5rem',
	color: token('color.text', N800),

	[`.${RendererCssClassName.DOCUMENT}::after`]: {
		// we add a clearfix after ak-renderer-document in order to
		// contain internal floats (such as media images that are "wrap-left")
		// to just the renderer (and not spill outside of it)
		content: '""',
		visibility: 'hidden',
		display: 'block',
		height: 0,
		clear: 'both',
	},

	[`.${RendererCssClassName.DOCUMENT}`]: {
		// p, h3, and action items
		[`.${INLINE_IMAGE_WRAPPER_CLASS_NAME}`]: {
			height: '22px',
			transform: `translateY(-2px)`,
		},

		h1: {
			[`> .mediaInlineView-content-wrap > .${INLINE_IMAGE_WRAPPER_CLASS_NAME},
  > :is(a, span[data-mark-type='border']) .mediaInlineView-content-wrap > .${INLINE_IMAGE_WRAPPER_CLASS_NAME},
  > .${INLINE_IMAGE_WRAPPER_CLASS_NAME},
  > :is(a, span[data-mark-type='border']) .${INLINE_IMAGE_WRAPPER_CLASS_NAME}`]: {
				height: '36px',
				transform: `translateY(-3px)`,
			},
		},
		h2: {
			[`> .mediaInlineView-content-wrap > .${INLINE_IMAGE_WRAPPER_CLASS_NAME},
  > :is(a, span[data-mark-type='border']) .mediaInlineView-content-wrap > .${INLINE_IMAGE_WRAPPER_CLASS_NAME},
  > .${INLINE_IMAGE_WRAPPER_CLASS_NAME},
  > :is(a, span[data-mark-type='border']) .${INLINE_IMAGE_WRAPPER_CLASS_NAME}`]: {
				height: '31px',
				transform: `translateY(-3px)`,
			},
		},
		h3: {
			[`> .mediaInlineView-content-wrap > .${INLINE_IMAGE_WRAPPER_CLASS_NAME},
  > :is(a, span[data-mark-type='border']) .mediaInlineView-content-wrap > .${INLINE_IMAGE_WRAPPER_CLASS_NAME},
  > .${INLINE_IMAGE_WRAPPER_CLASS_NAME},
  > :is(a, span[data-mark-type='border']) .${INLINE_IMAGE_WRAPPER_CLASS_NAME}`]: {
				height: '25px',
				transform: `translateY(-2px)`,
			},
		},
		h4: {
			[`> .mediaInlineView-content-wrap > .${INLINE_IMAGE_WRAPPER_CLASS_NAME},
  > :is(a, span[data-mark-type='border']) .mediaInlineView-content-wrap > .${INLINE_IMAGE_WRAPPER_CLASS_NAME},
  > .${INLINE_IMAGE_WRAPPER_CLASS_NAME},
  > :is(a, span[data-mark-type='border']) .${INLINE_IMAGE_WRAPPER_CLASS_NAME}`]: {
				height: '23px',
				transform: `translateY(-2px)`,
			},
		},
		h5: {
			[`> .mediaInlineView-content-wrap > .${INLINE_IMAGE_WRAPPER_CLASS_NAME},
  > :is(a, span[data-mark-type='border']) .mediaInlineView-content-wrap > .${INLINE_IMAGE_WRAPPER_CLASS_NAME},
  > .${INLINE_IMAGE_WRAPPER_CLASS_NAME},
  > :is(a, span[data-mark-type='border']) .${INLINE_IMAGE_WRAPPER_CLASS_NAME}`]: {
				height: '20px',
				transform: `translateY(-2px)`,
			},
		},
		h6: {
			[`> .mediaInlineView-content-wrap > .${INLINE_IMAGE_WRAPPER_CLASS_NAME},
  > :is(a, span[data-mark-type='border']) .mediaInlineView-content-wrap > .${INLINE_IMAGE_WRAPPER_CLASS_NAME},
  > .${INLINE_IMAGE_WRAPPER_CLASS_NAME},
  > :is(a, span[data-mark-type='border']) .${INLINE_IMAGE_WRAPPER_CLASS_NAME}`]: {
				height: '18px',
				transform: `translateY(-2px)`,
			},
		},
	},

	'& h1, & h2, & h3, & h4, & h5, & h6': {
		[`.${HeadingAnchorWrapperClassName}`]: {
			position: 'absolute',

			marginLeft: token('space.075', '6px'),

			button: {
				paddingLeft: 0,
				paddingRight: 0,
			},

			/**
			 * Adds the visibility of the button when in focus through keyboard navigation.
			 */
			'button:focus': {
				opacity: 1,

				transform: 'none !important',
			},
		},
		[`@media (hover: hover) and (pointer: fine)`]: {
			[`.${HeadingAnchorWrapperClassName}`]: {
				'> button': {
					opacity: 0,
					transform: `translate(-8px, 0px)`,
					transition: `opacity 0.2s ease 0s, transform 0.2s ease 0s`,
				},
			},

			'&:hover': {
				[`.${HeadingAnchorWrapperClassName} > button`]: {
					opacity: 1,

					transform: 'none !important',
				},
			},
		},
	},

	'& h1': {
		[`.${HeadingAnchorWrapperClassName}`]: {
			// eslint-disable-next-line @atlaskit/design-system/use-tokens-typography
			lineHeight: `${28 / 24}em`,
		},
	},
	'& h2': {
		[`.${HeadingAnchorWrapperClassName}`]: {
			// eslint-disable-next-line @atlaskit/design-system/use-tokens-typography
			lineHeight: `${24 / 20}em`,
		},
	},
	'& h3': {
		[`.${HeadingAnchorWrapperClassName}`]: {
			// eslint-disable-next-line @atlaskit/design-system/use-tokens-typography
			lineHeight: `${20 / 16}em`,
		},
	},
	'& h4': {
		[`.${HeadingAnchorWrapperClassName}`]: {
			// eslint-disable-next-line @atlaskit/design-system/use-tokens-typography
			lineHeight: `${16 / 14}em`,
		},
	},
	'& h5': {
		[`.${HeadingAnchorWrapperClassName}`]: {
			// eslint-disable-next-line @atlaskit/design-system/use-tokens-typography
			lineHeight: `${16 / 12}em`,
		},
	},
	'& h6': {
		[`.${HeadingAnchorWrapperClassName}`]: {
			// eslint-disable-next-line @atlaskit/design-system/use-tokens-typography
			lineHeight: `${16 / 11}em`,
		},
	},

	[`& span.akActionMark`]: {
		color: token('color.link', B400),
		textDecoration: 'none',
		cursor: 'pointer',
		'&:hover': {
			color: token('color.link', B300),
			textDecoration: 'underline',
		},
		'&:active': {
			color: token('color.link.pressed', B500),
		},
	},

	'& span[data-placeholder]': {
		color: token('color.text.subtlest', N200),
	},
});

const akEditorBreakpointForSmallDevice = '1266px';

const responsiveBreakoutWidth = css({
	'--ak-editor--breakout-container-without-gutter-width': `calc(100cqw - ${akEditorGutterPadding}px * 2)`,

	// Corresponds to the legacyContentStyles from `@atlaskit/editor-core` meant to introduce responsive breakout width.
	'--ak-editor--breakout-wide-layout-width': `${akEditorCalculatedWideLayoutWidthSmallViewport}px`,

	[`@media (min-width: ${akEditorBreakpointForSmallDevice})`]: {
		'--ak-editor--breakout-wide-layout-width': `${akEditorCalculatedWideLayoutWidth}px`,
	},
});

const responsiveBreakoutWidthFullWidth = css({
	'--ak-editor--breakout-container-without-gutter-width': '100cqw',

	// Corresponds to the legacyContentStyles from `@atlaskit/editor-core` meant to introduce responsive breakout width.
	'--ak-editor--breakout-wide-layout-width': `${akEditorCalculatedWideLayoutWidthSmallViewport}px`,

	[`@media (min-width: ${akEditorBreakpointForSmallDevice})`]: {
		'--ak-editor--breakout-wide-layout-width': `${akEditorCalculatedWideLayoutWidth}px`,
	},
});

const hideHeadingCopyLinkWrapperStyles = css({
	'& h1, & h2, & h3, & h4, & h5, & h6': {
		[`.${HeadingAnchorWrapperClassName}`]: {
			'&:focus-within': {
				opacity: 1,
			},
		},
		[`@media (hover: hover) and (pointer: fine)`]: {
			[`.${HeadingAnchorWrapperClassName}`]: {
				opacity: 0,
				transition: `opacity 0.2s ease 0s`,
			},

			'&:hover': {
				[`.${HeadingAnchorWrapperClassName}`]: {
					opacity: 1,
				},
			},
		},
	},
});

const rendererFullPageStyles = css({
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-imported-style-values, @atlaskit/ui-styling-standard/no-unsafe-values
	maxWidth: `${akEditorDefaultLayoutWidth}px`,
	margin: '0 auto',
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-imported-style-values, @atlaskit/ui-styling-standard/no-unsafe-values
	padding: `0 ${FullPagePadding}px`,
});

const rendererFullWidthStyles = css({
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-imported-style-values, @atlaskit/ui-styling-standard/no-unsafe-values
	maxWidth: `${akEditorFullWidthLayoutWidth}px`,
	margin: `0 auto`,
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors, @atlaskit/ui-styling-standard/no-unsafe-selectors
	'.fabric-editor-breakout-mark:not([data-has-width="true"]), .ak-renderer-extension': {
		width: '100% !important',
	},
});

const rendererFullWidthStylesForTableResizing = css({
	'.pm-table-container': {
		width: '100% !important',
	},
});

// eslint-disable-next-line @atlaskit/design-system/no-css-tagged-template-expression
const telepointerStyles = css({
	[`#${TELEPOINTER_ID}`]: {
		display: 'inline-block',
		position: 'relative',
		width: '1.5px',
		height: '25px',
		backgroundColor: token('color.background.brand.bold'),
		marginLeft: token('space.025', '2px'),

		'&::after': {
			content: '"AI"',
			position: 'absolute',
			display: 'block',
			top: 0,
			left: 0,
			// eslint-disable-next-line @atlaskit/design-system/use-tokens-typography
			fontSize: '10px',
			fontWeight: token('font.weight.bold'),
			width: '12.5px',
			height: '13px',
			// eslint-disable-next-line @atlaskit/design-system/use-tokens-space
			paddingTop: '1px',
			// eslint-disable-next-line @atlaskit/design-system/use-tokens-space
			paddingLeft: '1.5px',
			// eslint-disable-next-line @atlaskit/design-system/use-tokens-typography
			lineHeight: 'initial',
			borderRadius: '0px 2px 2px 0px',
			color: token('color.text.inverse', 'white'),
			backgroundColor: token('color.background.brand.bold'),
		},
	},
});

const whitespaceSharedStyles = css({
	wordWrap: 'break-word',
	whiteSpace: 'pre-wrap',
});

const blockquoteSharedStyles = css({
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors -- Ignored via go/DSP-18766
	'& blockquote': {
		boxSizing: 'border-box',
		color: 'inherit',
		width: '100%',
		display: 'inline-block',
		paddingLeft: token('space.200', '16px'),
		// eslint-disable-next-line @atlaskit/ui-styling-standard/no-imported-style-values -- Ignored via go/DSP-18766
		borderLeft: `2px solid ${token('color.border', akEditorBlockquoteBorderColor)}`,
		// eslint-disable-next-line @atlaskit/design-system/ensure-design-token-usage/preview, @atlaskit/ui-styling-standard/no-imported-style-values, @atlaskit/ui-styling-standard/no-unsafe-values -- Ignored via go/DSP-18766
		margin: `${blockNodesVerticalMargin} 0 0 0`,
		marginRight: 0,
		// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors, @atlaskit/ui-styling-standard/no-unsafe-selectors -- Ignored via go/DSP-18766
		"[dir='rtl'] &": {
			paddingLeft: 0,
			paddingRight: token('space.200', '16px'),
		},
		// eslint-disable-next-line @atlaskit/ui-styling-standard/no-unsafe-selectors -- Ignored via go/DSP-18766
		'&:first-child': {
			marginTop: 0,
		},
		'&::before': {
			content: "''",
		},
		'&::after': {
			content: 'none',
		},
		// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors -- Ignored via go/DSP-18766
		'& p': {
			display: 'block',
		},
		// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors, @atlaskit/ui-styling-standard/no-unsafe-selectors -- Ignored via go/DSP-18766
		'& table, & table:last-child': {
			display: 'inline-table',
		},
		// Workaround for overriding the inline-block display on last child of a blockquote set in CSS reset.
		// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors, @atlaskit/ui-styling-standard/no-unsafe-selectors
		'> .code-block:last-child, >.mediaSingleView-content-wrap:last-child, >.mediaGroupView-content-wrap:last-child':
			{
				display: 'block',
			},

		// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors, @atlaskit/ui-styling-standard/no-unsafe-selectors -- Ignored via go/DSP-18766
		'> .extensionView-content-wrap:last-child': {
			// eslint-disable-next-line @atlaskit/ui-styling-standard/no-imported-style-values, @atlaskit/ui-styling-standard/no-unsafe-values -- Ignored via go/DSP-18766
			display: 'block',
		},
	},
});

const headingsSharedStyles = css({
	'& h1': {
		// eslint-disable-next-line @atlaskit/design-system/use-tokens-typography
		fontSize: `${24 / 14}em`,
		fontStyle: 'inherit',
		// eslint-disable-next-line @atlaskit/design-system/use-tokens-typography
		lineHeight: 28 / 24,
		color: token('color.text'),
		fontWeight: token('font.weight.medium'),
		// eslint-disable-next-line @atlaskit/design-system/use-tokens-typography
		letterSpacing: `-0.01em`,
		marginBottom: 0,
		// eslint-disable-next-line @atlaskit/design-system/use-tokens-space
		marginTop: '1.667em',
	},
	'& h2': {
		// eslint-disable-next-line @atlaskit/design-system/use-tokens-typography
		fontSize: `${20 / 14}em`,
		fontStyle: 'inherit',
		// eslint-disable-next-line @atlaskit/design-system/use-tokens-typography
		lineHeight: 24 / 20,
		color: token('color.text'),
		fontWeight: token('font.weight.medium'),
		// eslint-disable-next-line @atlaskit/design-system/use-tokens-typography
		letterSpacing: `-0.008em`,
		// eslint-disable-next-line @atlaskit/design-system/use-tokens-space
		marginTop: '1.8em',
		marginBottom: 0,
	},
	'& h3': {
		// eslint-disable-next-line @atlaskit/design-system/use-tokens-typography
		fontSize: `${16 / 14}em`,
		fontStyle: 'inherit',
		// eslint-disable-next-line @atlaskit/design-system/use-tokens-typography
		lineHeight: 20 / 16,
		color: token('color.text'),
		fontWeight: token('font.weight.semibold'),
		// eslint-disable-next-line @atlaskit/design-system/use-tokens-typography
		letterSpacing: `-0.006em`,
		marginTop: token('space.400', '2em'),
		marginBottom: 0,
	},
	'& h4': {
		// eslint-disable-next-line @atlaskit/design-system/use-tokens-typography
		fontSize: `${14 / 14}em`,
		fontStyle: 'inherit',
		// eslint-disable-next-line @atlaskit/design-system/use-tokens-typography
		lineHeight: 16 / 14,
		color: token('color.text'),
		fontWeight: token('font.weight.semibold'),
		// eslint-disable-next-line @atlaskit/design-system/use-tokens-typography
		letterSpacing: `-0.003em`,
		// eslint-disable-next-line @atlaskit/design-system/use-tokens-space
		marginTop: '1.357em',
	},
	'& h5': {
		// eslint-disable-next-line @atlaskit/design-system/use-tokens-typography
		fontSize: `${12 / 14}em`,
		fontStyle: 'inherit',
		// eslint-disable-next-line @atlaskit/design-system/use-tokens-typography
		lineHeight: 16 / 12,
		color: token('color.text'),
		fontWeight: token('font.weight.semibold'),
		// eslint-disable-next-line @atlaskit/design-system/use-tokens-space
		marginTop: '1.667em',
		textTransform: 'none',
	},
	'& h6': {
		// eslint-disable-next-line @atlaskit/design-system/use-tokens-typography
		fontSize: `${11 / 14}em`,
		fontStyle: 'inherit',
		// eslint-disable-next-line @atlaskit/design-system/use-tokens-typography
		lineHeight: 16 / 11,
		color: token('color.text.subtlest'),
		fontWeight: token('font.weight.bold'),
		// eslint-disable-next-line @atlaskit/design-system/use-tokens-space
		marginTop: '1.455em',
		textTransform: 'none',
	},
});

const headingsSharedStylesWithEditorUGC = css({
	'& h1': {
		// eslint-disable-next-line @atlaskit/design-system/use-tokens-typography
		font: `var(--ak-renderer-editor-font-heading-h1)`,
		marginBottom: 0,
		// eslint-disable-next-line @atlaskit/design-system/use-tokens-space
		marginTop: '1.45833em',
		'& strong': {
			// set all heading bold style to token font.weight.bold, as not matter what typography is used, the editorUGCToken will return the font weight 700
			fontWeight: token('font.weight.bold'),
		},
		'&::before': {},
	},
	'& h2': {
		// eslint-disable-next-line @atlaskit/design-system/use-tokens-typography
		font: `var(--ak-renderer-editor-font-heading-h2)`,
		// eslint-disable-next-line @atlaskit/design-system/use-tokens-space
		marginTop: '1.4em',
		marginBottom: 0,
		'& strong': {
			// set all heading bold style to token font.weight.bold, as not matter what typography is used, the editorUGCToken will return the font weight 700
			fontWeight: token('font.weight.bold'),
		},
	},
	'& h3': {
		// eslint-disable-next-line @atlaskit/design-system/use-tokens-typography
		font: `var(--ak-renderer-editor-font-heading-h3)`,
		// eslint-disable-next-line @atlaskit/design-system/use-tokens-space
		marginTop: '1.31249em',
		marginBottom: 0,
		'& strong': {
			// set all heading bold style to token font.weight.bold, as not matter what typography is used, the editorUGCToken will return the font weight 700
			fontWeight: token('font.weight.bold'),
		},
	},
	'& h4': {
		// eslint-disable-next-line @atlaskit/design-system/use-tokens-typography
		font: `var(--ak-renderer-editor-font-heading-h4)`,
		marginTop: token('space.250', '1.25em'),
		'& strong': {
			// set all heading bold style to token font.weight.bold, as not matter what typography is used, the editorUGCToken will return the font weight 700
			fontWeight: token('font.weight.bold'),
		},
	},
	'& h5': {
		// eslint-disable-next-line @atlaskit/design-system/use-tokens-typography
		font: `var(--ak-renderer-editor-font-heading-h5)`,
		// eslint-disable-next-line @atlaskit/design-system/use-tokens-space
		marginTop: '1.45833em',
		textTransform: 'none',
		'& strong': {
			// set all heading bold style to token font.weight.bold, as not matter what typography is used, the editorUGCToken will return the font weight 700
			fontWeight: token('font.weight.bold'),
		},
	},
	'& h6': {
		// eslint-disable-next-line @atlaskit/design-system/use-tokens-typography
		font: `var(--ak-renderer-editor-font-heading-h6)`,
		// eslint-disable-next-line @atlaskit/design-system/use-tokens-space
		marginTop: '1.59091em',
		textTransform: 'none',
		'& strong': {
			// set all heading bold style to token font.weight.bold, as not matter what typography is used, the editorUGCToken will return the font weight 700
			fontWeight: token('font.weight.bold'),
		},
	},
});

const headingWithAlignmentStyles = css({
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-unsafe-selectors
	'.fabric-editor-block-mark.fabric-editor-alignment:not(:first-child)': {
		// eslint-disable-next-line @atlaskit/ui-styling-standard/no-unsafe-selectors
		'> h1:first-child': {
			// eslint-disable-next-line @atlaskit/design-system/use-tokens-space
			marginTop: '1.667em',
		},
		// eslint-disable-next-line @atlaskit/ui-styling-standard/no-unsafe-selectors
		' > h2:first-child': {
			// eslint-disable-next-line @atlaskit/design-system/use-tokens-space
			marginTop: '1.8em',
		},
		// eslint-disable-next-line @atlaskit/ui-styling-standard/no-unsafe-selectors
		'> h3:first-child': {
			// eslint-disable-next-line @atlaskit/design-system/use-tokens-space
			marginTop: '2em',
		},
		// eslint-disable-next-line @atlaskit/ui-styling-standard/no-unsafe-selectors
		'> h4:first-child': {
			// eslint-disable-next-line @atlaskit/design-system/use-tokens-space
			marginTop: '1.357em',
		},
		// eslint-disable-next-line @atlaskit/ui-styling-standard/no-unsafe-selectors
		'> h5:first-child': {
			// eslint-disable-next-line @atlaskit/design-system/use-tokens-space
			marginTop: '1.667em',
		},
		// eslint-disable-next-line @atlaskit/ui-styling-standard/no-unsafe-selectors
		'> h6:first-child': {
			// eslint-disable-next-line @atlaskit/design-system/use-tokens-space
			marginTop: '1.455em',
		},
	},
	// Set marginTop: 0 if alignment block is next to a gap cursor or widget that is first child
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-unsafe-selectors
	'.ProseMirror-gapcursor:first-child + .fabric-editor-block-mark.fabric-editor-alignment, .ProseMirror-widget:first-child + .fabric-editor-block-mark.fabric-editor-alignment, .ProseMirror-widget:first-child + .ProseMirror-widget:nth-child(2) + .fabric-editor-block-mark.fabric-editor-alignment':
		{
			// eslint-disable-next-line @atlaskit/ui-styling-standard/no-unsafe-selectors
			'> :is(h1, h2, h3, h4, h5, h6):first-child': {
				marginTop: '0',
			},
		},
});

const ruleSharedStyles = css({
	'& hr': {
		border: 'none',
		backgroundColor: token('color.border'),
		// eslint-disable-next-line @atlaskit/design-system/ensure-design-token-usage/preview, @atlaskit/ui-styling-standard/no-imported-style-values, @atlaskit/ui-styling-standard/no-unsafe-values -- Ignored via go/DSP-18766
		margin: `${akEditorLineHeight}em 0`,
		height: '2px',
		borderRadius: '1px',
	},
});

const paragraphSharedStylesWithEditorUGC = css({
	'& p': {
		// eslint-disable-next-line @atlaskit/design-system/use-tokens-typography
		font: `var(--ak-renderer-editor-font-normal-text)`,
		marginTop: blockNodesVerticalMargin,
		marginBottom: 0,
	},
});

const paragraphSharedStyles = css({
	'& p': {
		// eslint-disable-next-line @atlaskit/design-system/use-tokens-typography
		fontSize: '1em',
		// eslint-disable-next-line @atlaskit/design-system/use-tokens-typography
		lineHeight: akEditorLineHeight,
		fontWeight: token('font.weight.regular'),
		marginTop: blockNodesVerticalMargin,
		marginBottom: 0,
		// eslint-disable-next-line @atlaskit/design-system/use-tokens-typography
		letterSpacing: '-0.005em',
	},
});

const listsSharedStyles = css({
	/* =============== INDENTATION SPACING ========= */
	'ul, ol': {
		boxSizing: 'border-box',
		paddingLeft: `var(--ed--list--item-counter--padding, ${listItemCounterPadding}px)`,
	},

	[`${orderedListSelector}, ${bulletListSelector}`]: {
		/*
	  Ensures list item content adheres to the list's margin instead
	  of filling the entire block row. This is important to allow
	  clicking interactive elements which are floated next to a list.

	  For some history and context on this block, see PRs related to tickets.:
	  @see ED-6551 - original issue.
	  @see ED-7015 - follow up issue.
	  @see ED-7447 - flow-root change.

	  used to have display: 'table' in tag template style but not supported in object styles
	  removed display: 'table' as 'flow-root' is supported in latest browsers

	  @see https://css-tricks.com/display-flow-root/
	*/
		display: 'flow-root',
	},

	/* =============== INDENTATION AESTHETICS ========= */
	/**
		We support nested lists up to six levels deep.
	**/
	/* LEGACY LISTS */
	'ul, ul ul ul ul': {
		listStyleType: 'disc',
	},

	'ul ul, ul ul ul ul ul': {
		listStyleType: 'circle',
	},

	'ul ul ul, ul ul ul ul ul ul': {
		listStyleType: 'square',
	},

	'ol, ol ol ol ol': {
		listStyleType: 'decimal',
	},
	'ol ol, ol ol ol ol ol': {
		listStyleType: 'lower-alpha',
	},
	'ol ol ol, ol ol ol ol ol ol': {
		listStyleType: 'lower-roman',
	},

	/* PREDICTABLE LISTS */
	'ol[data-indent-level="1"], ol[data-indent-level="4"]': {
		listStyleType: 'decimal',
	},

	'ol[data-indent-level="2"], ol[data-indent-level="5"]': {
		listStyleType: 'lower-alpha',
	},

	'ol[data-indent-level="3"], ol[data-indent-level="6"]': {
		listStyleType: 'lower-roman',
	},

	'ul[data-indent-level="1"], ul[data-indent-level="4"]': {
		listStyleType: 'disc',
	},

	'ul[data-indent-level="2"], ul[data-indent-level="5"]': {
		listStyleType: 'circle',
	},

	'ul[data-indent-level="3"], ul[data-indent-level="6"]': {
		listStyleType: 'square',
	},
});

/*
	Firefox does not handle empty block element inside li tag.
	If there is not block element inside li tag,
	then firefox sets inherited height to li
	However, if there is any block element and if it's empty
	(or has empty inline element) then
	firefox sets li tag height to zero.
	More details at
	https://product-fabric.atlassian.net/wiki/spaces/~455502413/pages/3149365890/ED-14110+Investigation
*/
const listsSharedStylesForGekko = css({
	'ul, ol': {
		'li p:empty, li p > span:empty': {
			display: 'inline-block',
		},
	},
});

const indentationSharedStyles = css({
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors -- Ignored via go/DSP-18766
	'.fabric-editor-indentation-mark': {
		// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors -- Ignored via go/DSP-18766
		"&[data-level='1']": {
			// eslint-disable-next-line @atlaskit/design-system/use-tokens-space
			marginLeft: '30px',
		},
		// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors -- Ignored via go/DSP-18766
		"&[data-level='2']": {
			// eslint-disable-next-line @atlaskit/design-system/use-tokens-space
			marginLeft: '60px',
		},
		// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors -- Ignored via go/DSP-18766
		"&[data-level='3']": {
			// eslint-disable-next-line @atlaskit/design-system/use-tokens-space
			marginLeft: '90px',
		},
		// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors -- Ignored via go/DSP-18766
		"&[data-level='4']": {
			// eslint-disable-next-line @atlaskit/design-system/use-tokens-space
			marginLeft: '120px',
		},
		// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors -- Ignored via go/DSP-18766
		"&[data-level='5']": {
			// eslint-disable-next-line @atlaskit/design-system/use-tokens-space
			marginLeft: '150px',
		},
		// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors -- Ignored via go/DSP-18766
		"&[data-level='6']": {
			// eslint-disable-next-line @atlaskit/design-system/use-tokens-space
			marginLeft: '180px',
		},
	},
});
const indentationSharedStylesWithMarginFix = css({
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors -- Ignored via go/DSP-18766
	'.fabric-editor-indentation-mark': {
		// Prevent marginTop of p:first-child overrode by batch.css
		// eslint-disable-next-line @atlaskit/ui-styling-standard/no-unsafe-selectors
		'p:first-child': {
			marginTop: blockNodesVerticalMargin,
		},
	},
});

const blockMarksSharedStyles = css({
	/**
	 * We need to remove margin-top from first item
	 * inside doc, tableCell, tableHeader, blockquote, etc.
	 */
	[`*:not(.fabric-editor-block-mark) >,
  	*:not(.fabric-editor-block-mark) >
    div.fabric-editor-block-mark:first-of-type
	:not(.fabric-editor-indentation-mark)
	:not(.fabric-editor-alignment),
  	.fabric-editor-alignment:first-of-type:first-child,
  	.ProseMirror .fabric-editor-indentation-mark:first-of-type:first-child`]: {
		'p, h1, h2, h3, h4, h5, h6, .heading-wrapper': {
			// eslint-disable-next-line @atlaskit/ui-styling-standard/no-unsafe-selectors
			':first-child:not(style), style:first-child + *': {
				marginTop: 0,
			},
		},
	},
});

const codeMarkSharedStyles = css({
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors -- Ignored via go/DSP-18766
	'.code': {
		'--ds--code--bg-color': token('color.background.neutral'),
		// eslint-disable-next-line @atlaskit/design-system/use-tokens-typography
		fontSize: '0.875em',
		// eslint-disable-next-line @atlaskit/design-system/use-tokens-typography
		fontFamily: token('font.family.code'),
		fontWeight: token('font.weight.regular'),
		backgroundColor: `var(--ds--code--bg-color,${token('color.background.neutral', N20)})`,
		color: token('color.text', N800),
		borderStyle: 'none',
		borderRadius: token('border.radius', '3px'),
		display: 'inline',
		padding: '2px 0.5ch',
		boxDecorationBreak: 'clone',
		overflow: 'auto',
		overflowWrap: 'break-word',
		whiteSpace: 'pre-wrap',
	},
});

const shadowSharedStyle = css({
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors, @atlaskit/ui-styling-standard/no-unsafe-values, @atlaskit/ui-styling-standard/no-imported-style-values -- Ignored via go/DSP-18766
	[`& .${shadowClassNames.RIGHT_SHADOW}::before, .${shadowClassNames.RIGHT_SHADOW}::after, .${shadowClassNames.LEFT_SHADOW}::before, .${shadowClassNames.LEFT_SHADOW}::after`]:
		{
			display: 'none',
			position: 'absolute',
			pointerEvents: 'none',
			// eslint-disable-next-line @atlaskit/ui-styling-standard/no-imported-style-values, @atlaskit/ui-styling-standard/no-unsafe-values -- Ignored via go/DSP-18766
			zIndex: akEditorShadowZIndex,
			width: '8px',
			content: "''",
			height: 'calc(100%)',
		},
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors, @atlaskit/ui-styling-standard/no-unsafe-values, @atlaskit/ui-styling-standard/no-imported-style-values -- Ignored via go/DSP-18766
	[`& .${shadowClassNames.RIGHT_SHADOW}, .${shadowClassNames.LEFT_SHADOW}`]: {
		position: 'relative',
	},
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors, @atlaskit/ui-styling-standard/no-unsafe-values, @atlaskit/ui-styling-standard/no-imported-style-values -- Ignored via go/DSP-18766
	[`& .${shadowClassNames.LEFT_SHADOW}::before`]: {
		background: `linear-gradient( to left, transparent 0, ${token(
			'elevation.shadow.overflow.spread',
		)} 140% ), linear-gradient( to right, ${token(
			'elevation.shadow.overflow.perimeter',
			'transparent',
		)} 0px, transparent 1px )`,
		top: '0px',
		left: 0,
		display: 'block',
	},
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors, @atlaskit/ui-styling-standard/no-unsafe-values, @atlaskit/ui-styling-standard/no-imported-style-values -- Ignored via go/DSP-18766
	[`& .${shadowClassNames.RIGHT_SHADOW}::after`]: {
		background: `linear-gradient( to right, transparent 0, ${token(
			'elevation.shadow.overflow.spread',
		)} 140% ), linear-gradient( to left, ${token(
			'elevation.shadow.overflow.perimeter',
			'transparent',
		)} 0px, transparent 1px )`,
		right: '0px',
		top: '0px',
		display: 'block',
	},
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors, @atlaskit/ui-styling-standard/no-unsafe-values, @atlaskit/ui-styling-standard/no-imported-style-values -- Ignored via go/DSP-18766
	[`& .${shadowObserverClassNames.SENTINEL_LEFT}`]: {
		height: '100%',
		width: '0px',
		minWidth: '0px',
	},
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors, @atlaskit/ui-styling-standard/no-unsafe-values, @atlaskit/ui-styling-standard/no-imported-style-values -- Ignored via go/DSP-18766
	[`& .${shadowObserverClassNames.SENTINEL_RIGHT}`]: {
		height: '100%',
		width: '0px',
		minWidth: '0px',
	},
});

const dateSharedStyle = css({
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors, @atlaskit/ui-styling-standard/no-unsafe-values -- Ignored via go/DSP-18766
	[`.${DateSharedCssClassName.DATE_WRAPPER} span`]: {
		whiteSpace: 'unset',
	},
});

const textColorStyles = css({
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors -- Ignored via go/DSP-18766
	'.fabric-text-color-mark': {
		color: 'var(--custom-palette-color, inherit)',
	},
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors -- Ignored via go/DSP-18766
	'a .fabric-text-color-mark': {
		color: 'unset',
	},
});

const backgroundColorStyles = css({
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors -- Ignored via go/DSP-18766
	'.fabric-background-color-mark': {
		backgroundColor: 'var(--custom-palette-color, inherit)',
		borderRadius: '2px',
		// eslint-disable-next-line @atlaskit/design-system/use-tokens-space
		paddingTop: '1px',
		// eslint-disable-next-line @atlaskit/design-system/use-tokens-space
		paddingBottom: '2px',
		boxDecorationBreak: 'clone',
	},
	// Don't show text highlight styling when there is a hyperlink
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors -- Ignored via go/DSP-18766
	'a .fabric-background-color-mark': {
		backgroundColor: 'unset',
	},
	// Don't show text highlight styling when there is an inline comment
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors -- Ignored via go/DSP-18766
	'.fabric-background-color-mark .ak-editor-annotation': {
		backgroundColor: 'unset',
	},
});

const tasksAndDecisionsStyles = css({
	'.ProseMirror': {
		[`.taskItemView-content-wrap,
		.${TaskDecisionSharedCssClassName.DECISION_CONTAINER}`]: {
			position: 'relative',
			minWidth: `${akEditorTableCellMinWidth}px`,
		},

		[`.${TaskDecisionSharedCssClassName.DECISION_CONTAINER}`]: {
			marginTop: 0,
		},

		[`.${TaskDecisionSharedCssClassName.TASK_CONTAINER}`]: {
			'span[contenteditable="false"]': {
				height: `${akEditorLineHeight}em`,
			},
		},

		[`.${TaskDecisionSharedCssClassName.TASK_ITEM}`]: {
			// eslint-disable-next-line @atlaskit/design-system/use-tokens-typography
			lineHeight: akEditorLineHeight,
		},
	},

	'div[data-task-local-id]': {
		'span[contenteditable="false"]': {
			height: `${akEditorLineHeight}em`,
		},
		'span[contenteditable="false"] + div': {
			// eslint-disable-next-line @atlaskit/design-system/use-tokens-typography
			lineHeight: `${akEditorLineHeight}em`,
		},
	},

	'div[data-task-list-local-id]': {
		margin: `${token('space.150', '12px')} 0 0 0`,
		// If task item is not first in the list then set margin top to 4px.
		'div + div': {
			marginTop: token('space.050', '4px'),
		},
	},

	// If task list is not first in the document then set margin top to 4px.
	'div[data-task-list-local-id] div[data-task-list-local-id]': {
		marginTop: token('space.050', '4px'),
		marginLeft: token('space.300', '24px'),
	},

	/* When action list is inside panel */
	'.ak-editor-panel__content': {
		// eslint-disable-next-line @atlaskit/ui-styling-standard/no-unsafe-selectors
		'> div[data-task-list-local-id]:first-child': {
			margin: '0 0 0 0 !important',
		},
	},
});

const smartCardStyles = css({
	[`.${SmartCardSharedCssClassName.BLOCK_CARD_CONTAINER}`]: {
		display: 'block',
		margin: `${blockNodesVerticalMargin} 0 0`,
		maxWidth: `${8 * 95}px`,
	},
});

const smartCardStylesAvatarFix = css({
	[`.${SmartCardSharedCssClassName.BLOCK_CARD_CONTAINER}`]: {
		/* EDM-11991: Fix list plugin adding padding to ADS AvatarGroup start */
		'ul, ol': {
			paddingLeft: 'inherit',
		},
		/* EDM-11991: Fix list plugin add padding to ADS AvatarGroup end */
	},
});

const smartCardStylesAvatarMarginFix = css({
	[`.${SmartCardSharedCssClassName.BLOCK_CARD_CONTAINER}`]: {
		'ul, ol': {
			marginRight: 'inherit',
		},
	},
});

const baseOtherStyles = css({
	'& .UnknownBlock': {
		fontFamily: token('font.family.body'),
		// eslint-disable-next-line @atlaskit/design-system/use-tokens-typography
		fontSize: `${14 / 16}rem`,
		fontWeight: token('font.weight.regular'),
		whiteSpace: 'pre-wrap',
		wordWrap: 'break-word',
	},
	'& span.date-node': {
		background: token('color.background.neutral', N30A),
		borderRadius: token('border.radius.100', '3px'),
		color: token('color.text', N800),
		padding: `${token('space.025', '2px')} ${token('space.050', '4px')}`,
		margin: `0 1px`,
		transition: `background 0.3s`,
	},
	'& span.date-node-highlighted': {
		background: token('color.background.danger', R50),
		color: token('color.text.danger', R500),
	},
	'& .renderer-image': {
		maxWidth: '100%',
		display: 'block',
		margin: `${token('space.300', '24px')} 0`,
	},

	[`.${richMediaClassName}.rich-media-wrapped + .${richMediaClassName}:not(.rich-media-wrapped)`]: {
		clear: 'both',
	},

	[`& .code-block,
	& blockquote,
	& hr,
	& > div > div:not(.rich-media-wrapped),
	.${richMediaClassName}.rich-media-wrapped + .rich-media-wrapped + *:not(.rich-media-wrapped),
	.${richMediaClassName}.rich-media-wrapped + div:not(.rich-media-wrapped),
	.${richMediaClassName}.image-align-start,
		.${richMediaClassName}.image-center,
		.${richMediaClassName}.image-align-end`]: {
		clear: 'both',
	},

	'& .rich-media-wrapped': {
		'& + h1, & + h2, & + h3, & + h4, & + h5, & + h6': {
			marginTop: token('space.100', '8px'),
		},
	},

	// originally copied the block after mediaSharedStyle
	'div[class^="image-wrap-"] + div[class^="image-wrap-"]': {
		marginLeft: 0,
		marginRight: 0,
	},

	/* Breakout for tables and extensions */
	[`.${RendererCssClassName.DOCUMENT} >`]: {
		[`*:not([data-mark-type='fragment']) .${TableSharedCssClassName.TABLE_CONTAINER}`]: {
			// Temporarily ignoring the below the owning team can add the ticket number for the TODO.  Context: https://atlassian.slack.com/archives/CPUEVD9MY/p1741565387326829
			// eslint-disable-next-line @atlaskit/editor/enforce-todo-comment-format
			// TODO - improve inline style logic on table container so important styles aren't required here
			width: '100% !important',
			left: '0 !important',
		},
		[`[data-mark-type='fragment'] * .${TableSharedCssClassName.TABLE_CONTAINER}`]: {
			// Temporarily ignoring the below the owning team can add the ticket number for the TODO.  Context: https://atlassian.slack.com/archives/CPUEVD9MY/p1741565387326829
			// eslint-disable-next-line @atlaskit/editor/enforce-todo-comment-format
			// TODO - improve inline style logic on table container so important styles aren't required here
			width: '100% !important',
			left: '0 !important',
		},
		[`* .${RendererCssClassName.EXTENSION_OVERFLOW_CONTAINER}`]: {
			overflowX: 'auto',
		},
		[`& .${RendererCssClassName.EXTENSION}:first-child`]: {
			marginTop: 0,
		},
	},

	[`.${RendererCssClassName.DOCUMENT}`]: {
		[`.${RendererCssClassName.EXTENSION}`]: {
			marginTop: `${blockNodesVerticalMargin}`,
		},

		[`.${RendererCssClassName.EXTENSION_CENTER_ALIGN}`]: {
			// eslint-disable-next-line @atlaskit/design-system/use-tokens-space
			marginLeft: '50%',
			transform: 'translateX(-50%)',
		},

		[`.${TableSharedCssClassName.TABLE_NODE_WRAPPER}`]: {
			overflowX: 'auto',
		},

		[`.${shadowObserverClassNames.SHADOW_CONTAINER} .${TableSharedCssClassName.TABLE_NODE_WRAPPER}`]:
			{
				display: 'flex',
			},
	},
});

const alignedHeadingAnchorStyle = css({
	// Temporarily ignoring the below the owning team can add the ticket number for the TODO.  Context: https://atlassian.slack.com/archives/CPUEVD9MY/p1741565387326829
	// eslint-disable-next-line @atlaskit/editor/enforce-todo-comment-format
	// TODO Delete this comment after verifying space token -> previous value `margin: 6px`
	'.fabric-editor-block-mark[data-align] >': {
		'h1, h2, h3, h4, h5, h6': {
			position: 'relative',
		},
	},
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-unsafe-selectors
	'.fabric-editor-block-mark:not([data-align="center"])[data-align]': {
		[`.${HeadingAnchorWrapperClassName}`]: {
			margin: `0 ${token('space.075', '6px')} 0 0`,
			// If the anchor is right aligned then the left side of the heading
			// is aligned with the left side of the anchor.
			// In order to align as expected we transform it the width of the element (plus our expected 6px)
			// to the left
			transform: `translateX(calc(-100% - ${token('space.075', '6px')}))`,
		},
		'@media (hover: hover) and (pointer: fine)': {
			[`.${HeadingAnchorWrapperClassName} > button`]: {
				transform: `translate(8px, 0px)`,
			},
		},
	},
});

// Temporarily ignoring the below the owning team can add the ticket number for the TODO.  Context: https://atlassian.slack.com/archives/CPUEVD9MY/p1741565387326829
// eslint-disable-next-line @atlaskit/editor/enforce-todo-comment-format
// TODO: emotion refactor - there's a mediaSingleSharedNewStyle, but not originally used in the renderer.
const mediaSingleSharedStyle = css({
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors, @atlaskit/ui-styling-standard/no-unsafe-values -- Ignored via go/DSP-18766
	[`li .${richMediaClassName}`]: {
		margin: 0,
	},
	// Hack for chrome to fix media single position inside a list when media is the first child
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors -- Ignored via go/DSP-18766
	'&.ua-chrome li > .mediaSingleView-content-wrap::before': {
		content: "''",
		display: 'block',
		height: 0,
	},
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors -- Ignored via go/DSP-18766
	'&.ua-firefox': {
		// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors -- Ignored via go/DSP-18766
		'.mediaSingleView-content-wrap': {
			userSelect: 'none',
		},
		// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors -- Ignored via go/DSP-18766
		'.captionView-content-wrap': {
			userSelect: 'text',
		},
	},
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors -- Ignored via go/DSP-18766
	".mediaSingleView-content-wrap[layout='center']": {
		clear: 'both',
	},
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors, @atlaskit/ui-styling-standard/no-unsafe-values -- Ignored via go/DSP-18766
	[`table .${richMediaClassName}`]: {
		marginTop: token('space.150', '12px'),
		marginBottom: token('space.150', '12px'),
		clear: 'both',
		// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors -- Ignored via go/DSP-18766
		'&.image-wrap-left[data-layout], &.image-wrap-right[data-layout]': {
			clear: 'none',
			// eslint-disable-next-line @atlaskit/ui-styling-standard/no-unsafe-selectors -- Ignored via go/DSP-18766
			'&:first-child': {
				marginTop: token('space.150', '12px'),
			},
		},
	},
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors, @atlaskit/ui-styling-standard/no-unsafe-values -- Ignored via go/DSP-18766
	[`.${richMediaClassName}.image-wrap-right + .${richMediaClassName}.image-wrap-left`]: {
		clear: 'both',
	},
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors, @atlaskit/ui-styling-standard/no-unsafe-values -- Ignored via go/DSP-18766
	[`.${richMediaClassName}.image-wrap-left + .${richMediaClassName}.image-wrap-right, .${richMediaClassName}.image-wrap-right + .${richMediaClassName}.image-wrap-left, .${richMediaClassName}.image-wrap-left + .${richMediaClassName}.image-wrap-left, .${richMediaClassName}.image-wrap-right + .${richMediaClassName}.image-wrap-right`]:
		{
			marginRight: 0,
			marginLeft: 0,
		},
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-unsafe-values -- Ignored via go/DSP-18766
	[`@media all and (max-width: ${wrappedMediaBreakoutPoint}px)`]: {
		// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors -- Ignored via go/DSP-18766
		"div.mediaSingleView-content-wrap[layout='wrap-left'], div.mediaSingleView-content-wrap[data-layout='wrap-left'], div.mediaSingleView-content-wrap[layout='wrap-right'], div.mediaSingleView-content-wrap[data-layout='wrap-right']":
			{
				float: 'none',
				overflow: 'auto',
				margin: `${token('space.150', '12px')} 0`,
			},
	},
});

// was shared between editor-core and renderer
const tableSharedStyle = css({
	// originally from packages/editor/editor-common/src/styles/shared/tableCell.ts
	// Hardcoding the background color for the table cells to avoid the use of inline styles
	'td[colorname="white" i], th[colorname="white" i]': {
		backgroundColor: `${token('elevation.surface', '#FFFFFF')} !important`,
	},

	'td[colorname="light blue" i], th[colorname="light blue" i]': {
		backgroundColor: `${token('color.background.accent.blue.subtlest', '#DEEBFF')} !important`,
	},

	'td[colorname="light teal" i], th[colorname="light teal" i]': {
		backgroundColor: `${token('color.background.accent.teal.subtlest', '#E6FCFF')} !important`,
	},

	'td[colorname="light green" i], th[colorname="light green" i]': {
		backgroundColor: `${token('color.background.accent.green.subtlest', '#E3FCEF')} !important`,
	},

	'td[colorname="light yellow" i], th[colorname="light yellow" i]': {
		backgroundColor: `${token('color.background.accent.yellow.subtlest', '#FFFAE6')} !important`,
	},

	'td[colorname="light red" i], th[colorname="light red" i]': {
		backgroundColor: `${token('color.background.accent.red.subtlest', '#FFEBE6')} !important`,
	},

	'td[colorname="light purple" i], th[colorname="light purple" i]': {
		backgroundColor: `${token('color.background.accent.purple.subtlest', '#EAE6FF')} !important`,
	},

	'td[colorname="light gray" i], th[colorname="light gray" i]': {
		backgroundColor: `${token('color.background.accent.gray.subtlest', '#F4F5F7')} !important`,
	},

	'td[colorname="blue" i], th[colorname="blue" i]': {
		backgroundColor: `${token('color.background.accent.blue.subtler', '#B3D4FF')} !important`,
	},

	'td[colorname="teal" i], th[colorname="teal" i]': {
		backgroundColor: `${token('color.background.accent.teal.subtler', '#B3F5FF')} !important`,
	},

	'td[colorname="green" i], th[colorname="green" i]': {
		backgroundColor: `${token('color.background.accent.green.subtler', '#ABF5D1')} !important`,
	},

	'td[colorname="yellow" i], th[colorname="yellow" i]': {
		backgroundColor: `${token('color.background.accent.yellow.subtler', '#FFF0B3')} !important`,
	},

	'td[colorname="red" i], th[colorname="red" i]': {
		backgroundColor: `${token('color.background.accent.red.subtler', '#FFBDAD')} !important`,
	},

	'td[colorname="purple" i], th[colorname="purple" i]': {
		backgroundColor: `${token('color.background.accent.purple.subtler', '#C0B6F2')} !important`,
	},

	'td[colorname="gray" i], th[colorname="gray" i]': {
		backgroundColor: `${token('color.background.accent.gray.subtle', '#B3BAC5')} !important`,
	},

	'td[colorname="dark blue" i], th[colorname="dark blue" i]': {
		backgroundColor: `${token('color.background.accent.blue.subtle', '#4C9AFF')} !important`,
	},

	'td[colorname="dark teal" i], th[colorname="dark teal" i]': {
		backgroundColor: `${token('color.background.accent.teal.subtle', '#79E2F2')} !important`,
	},

	'td[colorname="dark green" i], th[colorname="dark green" i]': {
		backgroundColor: `${token('color.background.accent.green.subtle', '#57D9A3')} !important`,
	},

	'td[colorname="dark yellow" i], th[colorname="dark yellow" i]': {
		backgroundColor: `${token('color.background.accent.orange.subtle', '#FFC400')} !important`,
	},

	'td[colorname="dark red" i], th[colorname="dark red" i]': {
		backgroundColor: `${token('color.background.accent.red.subtle', '#FF8F73')} !important`,
	},

	'td[colorname="dark purple" i], th[colorname="dark purple" i]': {
		backgroundColor: `${token('color.background.accent.purple.subtle', '#998DD9')} !important`,
	},

	[`.${TableSharedCssClassName.TABLE_CONTAINER}`]: {
		position: 'relative',
		margin: `0 auto ${token('space.200', '16px')}`,
		boxSizing: 'border-box',
		/**
		 * Fix block top alignment inside table cells.
		 */
		// eslint-disable-next-line @atlaskit/ui-styling-standard/no-unsafe-selectors
		'.decisionItemView-content-wrap:first-of-type > div': {
			marginTop: 0,
		},
	},
	[`.${TableSharedCssClassName.TABLE_CONTAINER}[data-number-column='true']`]: {
		paddingLeft: `${akEditorTableNumberColumnWidth - 1}px`,
		clear: 'both',
	},

	[`.${TableSharedCssClassName.TABLE_RESIZER_CONTAINER}`]: {
		willChange: 'width, margin-left',
	},

	[`.${TableSharedCssClassName.TABLE_RESIZER_CONTAINER} table`]: {
		willChange: 'width',
	},

	[`.${TableSharedCssClassName.TABLE_NODE_WRAPPER} > table`]: {
		margin: `${token('space.300', '24px')} 0 0 0`,
	},

	[`.${TableSharedCssClassName.TABLE_CONTAINER} > table,
	.${TableSharedCssClassName.TABLE_STICKY_WRAPPER} > table`]: {
		margin: `${token('space.300', '24px')} ${token('space.100', '8px')} 0 0`,
	},

	/* avoid applying styles to nested tables (possible via extensions) */
	[`.${TableSharedCssClassName.TABLE_CONTAINER} > table,
	.${TableSharedCssClassName.TABLE_NODE_WRAPPER} > table,
	.${TableSharedCssClassName.TABLE_STICKY_WRAPPER} > table`]: {
		borderCollapse: 'collapse',
		border: `${tableCellBorderWidth}px solid ${token('color.background.accent.gray.subtler', akEditorTableBorder)}`,
		tableLayout: 'fixed',
		// eslint-disable-next-line @atlaskit/design-system/use-tokens-typography
		fontSize: '1em',
		width: '100%',

		'&[data-autosize="true"]': {
			tableLayout: 'auto',
		},

		'*': {
			boxSizing: 'border-box',
		},
		hr: {
			boxSizing: 'content-box',
		},
		tbody: {
			borderBottom: 'none',
		},
		'th td': {
			backgroundColor: token('color.background.neutral.subtle', 'white'),
		},
		'> tbody > tr > td': {
			backgroundColor: token('elevation.surface'),
		},
		th: {
			backgroundColor: token('color.background.accent.gray.subtlest', akEditorTableToolbar),
			textAlign: 'left',

			/* only apply this styling to codeblocks in default background headercells */
			/* TODO this needs to be overhauled as it relies on unsafe selectors */
			// eslint-disable-next-line @atlaskit/ui-styling-standard/no-unsafe-selectors
			'&:not([style]):not(.danger)': {
				[`.${CodeBlockSharedCssClassName.CODEBLOCK_CONTAINER}:not(.danger)`]: {
					backgroundColor: token('elevation.surface.raised', 'rgb(235, 237, 240)'),

					[`&:not(.${akEditorSelectedNodeClassName})`]: {
						boxShadow: `0px 0px 0px 1px ${token('color.border', 'transparent')}`,
					},

					[`.${CodeBlockSharedCssClassName.CODEBLOCK_CONTENT_WRAPPER}`]: {
						// originally copied from packages/editor/editor-shared-styles/src/overflow-shadow/overflow-shadow.ts
						backgroundImage: `linear-gradient(
							to right,
							${token('color.background.neutral')} ${token('space.300', '24px')},
							transparent ${token('space.300', '24px')}
						  ),linear-gradient(
							to right,
							${token('elevation.surface.raised')} ${token('space.300', '24px')},
							transparent ${token('space.300', '24px')}
						  ),linear-gradient(
							to left,
							${token('color.background.neutral')} ${token('space.100', '8px')},
							transparent ${token('space.100', '8px')}
						  ),linear-gradient(
							to left,
							${token('elevation.surface.raised')} ${token('space.100', '8px')},
							transparent ${token('space.100', '8px')}
						  ),linear-gradient(
							to left,
							${token('elevation.shadow.overflow.spread')} 0,
							${token('utility.UNSAFE.transparent')}  ${token('space.100', '8px')}
						  ),linear-gradient(
							to left,
							${token('elevation.shadow.overflow.perimeter')} 0,
							${token('utility.UNSAFE.transparent')}  ${token('space.100', '8px')}
						  ),linear-gradient(
							to right,
							${token('elevation.shadow.overflow.spread')} 0,
							${token('utility.UNSAFE.transparent')}  ${token('space.100', '8px')}
						  ),linear-gradient(
							to right,
							${token('elevation.shadow.overflow.perimeter')} 0,
							${token('utility.UNSAFE.transparent')}  ${token('space.100', '8px')}
						  )`,
						backgroundColor: token('color.background.neutral', 'rgb(235, 237, 240)'),
					},

					[`.${CodeBlockSharedCssClassName.CODEBLOCK_LINE_NUMBER_GUTTER}`]: {
						backgroundColor: token('color.background.neutral', 'rgb(226, 229, 233)'),
					},

					/* this is only relevant to the element taken care of by renderer */
					'> [data-ds--code--code-block]': {
						// originally copied from packages/editor/editor-shared-styles/src/overflow-shadow/overflow-shadow.ts
						backgroundImage: `linear-gradient(
							to right,
							${token('color.background.neutral')} ${token('space.300', '24px')},
							transparent ${token('space.300', '24px')}
						  ),linear-gradient(
							to right,
							${token('elevation.surface.raised')} ${token('space.300', '24px')},
							transparent ${token('space.300', '24px')}
						  ),linear-gradient(
							to left,
							${token('color.background.neutral')} ${token('space.100', '8px')},
							transparent ${token('space.100', '8px')}
						  ),linear-gradient(
							to left,
							${token('elevation.surface.raised')} ${token('space.100', '8px')},
							transparent ${token('space.100', '8px')}
						  ),linear-gradient(
							to left,
							${token('elevation.shadow.overflow.spread')} 0,
							${token('utility.UNSAFE.transparent')}  ${token('space.100', '8px')}
						  ),linear-gradient(
							to left,
							${token('elevation.shadow.overflow.perimeter')} 0,
							${token('utility.UNSAFE.transparent')}  ${token('space.100', '8px')}
						  ),linear-gradient(
							to right,
							${token('elevation.shadow.overflow.spread')} 0,
							${token('utility.UNSAFE.transparent')}  ${token('space.100', '8px')}
						  ),linear-gradient(
							to right,
							${token('elevation.shadow.overflow.perimeter')} 0,
							${token('utility.UNSAFE.transparent')}  ${token('space.100', '8px')}
						  )`,

						backgroundColor: `${token('color.background.neutral', 'rgb(235, 237, 240)')}!important`,

						// selector lives inside @atlaskit/code
						'--ds--code--line-number-bg-color': token(
							'color.background.neutral',
							'rgb(226, 229, 233)',
						),
					},
				},
			},
		},
	},
});

const tableRendererHeaderStylesForTableCellOnly = css({
	[`.${TableSharedCssClassName.TABLE_CONTAINER} > table,
		.${TableSharedCssClassName.TABLE_NODE_WRAPPER} > table,
		.${TableSharedCssClassName.TABLE_STICKY_WRAPPER} > table`]: {
		// platform_editor_renderer_table_header_styles has already been launched, so assume it's on
		'> tbody > tr > th, > tbody > tr > td': {
			minWidth: `${tableCellMinWidth}px`,
			fontWeight: token('font.weight.regular'),
			verticalAlign: 'top',
			border: `1px solid ${token('color.background.accent.gray.subtler', akEditorTableBorder)}`,
			borderRightWidth: 0,
			borderBottomWidth: 0,
			padding: token('space.100', '8px'),
			// eslint-disable-next-line @atlaskit/ui-styling-standard/no-unsafe-selectors
			'th p:not(:first-of-type), td p:not(:first-of-type)': {
				marginTop: token('space.150', '12px'),
			},
		},
	},
});

const tableRendererNestedPanelStyles = css({
	[`.${TableSharedCssClassName.TABLE_CONTAINER} .ak-editor-panel`]: {
		border: `${token('border.width', '1px')} solid ${token('color.border', '#d9dbea')}`,
	},
});

const tableStylesBackGroundClipForGeckoForTableCellOnly = css({
	[`.${TableSharedCssClassName.TABLE_CONTAINER} > table,
		.${TableSharedCssClassName.TABLE_NODE_WRAPPER} > table,
		.${TableSharedCssClassName.TABLE_STICKY_WRAPPER} > table`]: {
		// eslint-disable-next-line @atlaskit/ui-styling-standard/no-unsafe-selectors
		'> tbody > tr > th, > tbody > tr > td': {
			backgroundClip: 'padding-box',
		},
	},
});

const firstNodeWithNotMarginTopWithNestedDnD = css({
	[`.${TableSharedCssClassName.TABLE_CONTAINER} > table,
		.${TableSharedCssClassName.TABLE_NODE_WRAPPER} > table,
		.${TableSharedCssClassName.TABLE_STICKY_WRAPPER} > table`]: {
		'> tbody > tr > th, > tbody > tr > td': {
			// eslint-disable-next-line @atlaskit/ui-styling-standard/no-unsafe-selectors
			'> :nth-child(1 of :not(style, .ProseMirror-gapcursor, .ProseMirror-widget, span))': {
				marginTop: 0,
			},
		},
	},
});

const firstNodeWithNotMarginTop = css({
	[`.${TableSharedCssClassName.TABLE_CONTAINER} > table,
		.${TableSharedCssClassName.TABLE_NODE_WRAPPER} > table,
		.${TableSharedCssClassName.TABLE_STICKY_WRAPPER} > table`]: {
		'> tbody > tr > th, > tbody > tr > td': {
			// eslint-disable-next-line @atlaskit/ui-styling-standard/no-unsafe-selectors
			'> :first-child:not(style), > style:first-child + *': {
				marginTop: 0,
			},
			// eslint-disable-next-line @atlaskit/ui-styling-standard/no-unsafe-selectors
			'> .ProseMirror-gapcursor:first-child + *, > style:first-child + .ProseMirror-gapcursor + *':
				{
					marginTop: 0,
				},
			// eslint-disable-next-line @atlaskit/ui-styling-standard/no-unsafe-selectors
			'> .ProseMirror-gapcursor:first-child + span + *, > style:first-child + .ProseMirror-gapcursor + span + *':
				{
					marginTop: 0,
				},
		},
	},
});

const rendererTableStyles = css({
	[`.${RendererCssClassName.DOCUMENT} .${TableSharedCssClassName.TABLE_CONTAINER}`]: {
		zIndex: 0,
		transition: `all 0.1s linear`,
		display: 'flex' /* needed to avoid position: fixed jumpiness in Chrome */,

		/** Shadow overrides */
		[`&.${shadowClassNames.RIGHT_SHADOW}::after, &.${shadowClassNames.LEFT_SHADOW}::before`]: {
			top: `${tableMarginTop - 1}px`,
			height: `calc(100% - ${tableMarginTop}px)`,
			zIndex: `${akEditorStickyHeaderZIndex}`,
			width: `${tableShadowWidth}px`,
			background: `linear-gradient(
					to left,
					transparent 0,
					${token('elevation.shadow.overflow.spread', N40A)} 140%
				),
				linear-gradient(
					to right,
					${token('elevation.shadow.overflow.perimeter', 'transparent')} 0px,
					transparent 1px
				)`,
		},

		[`&.${shadowClassNames.RIGHT_SHADOW}::after`]: {
			background: `linear-gradient(
					to right,
					transparent 0,
					${token('elevation.shadow.overflow.spread', N40A)} 140%
				),
				linear-gradient(
					to left,
					${token('elevation.shadow.overflow.perimeter', 'transparent')} 0px,
					transparent 1px
				)`,
			right: `0px`,
		},

		[`&
          .${shadowObserverClassNames.SENTINEL_LEFT},
          &
          .${shadowObserverClassNames.SENTINEL_RIGHT}`]: {
			height: `calc(100% - ${tableMarginTop}px)`,
		},
	},
});

const stickyScrollbarStyles = css({
	[`.${RendererCssClassName.DOCUMENT} .${TableSharedCssClassName.TABLE_CONTAINER}`]: {
		position: 'relative',
		flexDirection: 'column',

		[`> .${TableSharedCssClassName.TABLE_STICKY_SCROLLBAR_CONTAINER}`]: {
			width: '100%',
			display: 'block',
			visibility: 'hidden',
			overflowX: 'auto',
			position: 'sticky',
			bottom: `${token('space.0', '0px')}`,
			zIndex: 1,
		},

		[`> .${TableSharedCssClassName.TABLE_STICKY_SCROLLBAR_SENTINEL_BOTTOM},
		> .${TableSharedCssClassName.TABLE_STICKY_SCROLLBAR_SENTINEL_TOP}`]: {
			position: 'absolute',
			width: '100%',
			height: '1px',
			// eslint-disable-next-line @atlaskit/design-system/use-tokens-space
			marginTop: '-1px',
			// need this to avoid sentinel being focused via keyboard
			// this still allows it to be detected by intersection observer
			visibility: 'hidden',
		},
		[`> .${TableSharedCssClassName.TABLE_STICKY_SCROLLBAR_SENTINEL_TOP}`]: {
			top: `${tableRowHeight * 3}px`,
		},
		[`> .${TableSharedCssClassName.TABLE_STICKY_SCROLLBAR_SENTINEL_BOTTOM}`]: {
			bottom: `${token('space.250', '20px')}`, // MAX_BROWSER_SCROLLBAR_HEIGHT = 20;
		},
	},
});

const rendererTableHeaderEqualHeightStylesForTableCellOnly = css({
	[`.${RendererCssClassName.DOCUMENT} .${TableSharedCssClassName.TABLE_CONTAINER}`]: {
		[`.${TableSharedCssClassName.TABLE_NODE_WRAPPER} > table, .${TableSharedCssClassName.TABLE_STICKY_WRAPPER} > table`]:
			{
				height: '1px' /* will be ignored */,
				marginLeft: 0,
				marginRight: 0,
			},
	},
	[`.${TableSharedCssClassName.TABLE_NODE_WRAPPER} > table > tbody > tr:first-of-type, .${TableSharedCssClassName.TABLE_STICKY_WRAPPER} > table > tbody > tr:first-of-type`]:
		{
			height: '100%',
			'td, th': {
				position: 'relative',
			},
		},
});

const rendererTableSortableColumnStyles = css({
	[`.${RendererCssClassName.DOCUMENT} .${TableSharedCssClassName.TABLE_CONTAINER}`]: {
		[`.${TableSharedCssClassName.TABLE_NODE_WRAPPER} > table, .${TableSharedCssClassName.TABLE_STICKY_WRAPPER} > table`]:
			{
				// allow nested heading links
				[`.${RendererCssClassName.SORTABLE_COLUMN_WRAPPER}`]: {
					padding: 0,

					[`.${RendererCssClassName.SORTABLE_COLUMN}`]: {
						width: '100%',
						height: '100%',
						padding: `${tableCellPadding}px`,
						borderWidth: '1.5px',
						borderStyle: 'solid',
						borderColor: `transparent`,

						// eslint-disable-next-line @atlaskit/ui-styling-standard/no-unsafe-selectors
						'> *:first-child': {
							marginTop: 0,
						},

						// eslint-disable-next-line @atlaskit/ui-styling-standard/no-unsafe-selectors
						'> .ProseMirror-gapcursor:first-child + *, > style:first-child + .ProseMirror-gapcursor + *':
							{
								marginTop: 0,
							},

						// eslint-disable-next-line @atlaskit/ui-styling-standard/no-unsafe-selectors
						'> .ProseMirror-gapcursor:first-child + span + *, > style:first-child + .ProseMirror-gapcursor + span + *':
							{
								marginTop: 0,
							},

						'@supports selector(:focus-visible)': {
							'&:focus': {
								outline: 'unset',
							},
							'&:focus-visible': {
								borderColor: `${token('color.border.focused', B300)}`,
							},
						},
					},
					[`> .${RendererCssClassName.SORTABLE_COLUMN} > .${RendererCssClassName.SORTABLE_COLUMN_ICON_WRAPPER}`]:
						{
							margin: 0,
							[`.${SORTABLE_COLUMN_ICON_CLASSNAME}`]: {
								opacity: 1,
								transition: `opacity 0.2s ease-in-out`,
							},
						},

					[`> .${RendererCssClassName.SORTABLE_COLUMN}
						> .${RendererCssClassName.SORTABLE_COLUMN_NO_ORDER}`]: {
						[`.${SORTABLE_COLUMN_ICON_CLASSNAME}`]: {
							opacity: 0,
							'&:focus': {
								opacity: 1,
							},
						},
					},

					[`&:hover:not(
							:has(
									.${RendererCssClassName.SORTABLE_COLUMN_WRAPPER}
										.${RendererCssClassName.SORTABLE_COLUMN}:hover
								)
						)
						> .${RendererCssClassName.SORTABLE_COLUMN}
						> .${RendererCssClassName.SORTABLE_COLUMN_NO_ORDER}`]: {
						[`.${SORTABLE_COLUMN_ICON_CLASSNAME}`]: {
							opacity: 1,
						},
					},
				},
			},
	},
});

// TODO: ED-27229 - Cleanup with `platform_editor_tables_numbered_column_correction`
const rendererTableColumnStylesOld = css({
	[`.${RendererCssClassName.DOCUMENT} .${TableSharedCssClassName.TABLE_CONTAINER}`]: {
		'table[data-number-column="true"]': {
			[`.${RendererCssClassName.NUMBER_COLUMN}`]: {
				backgroundColor: `${token('color.background.neutral', akEditorTableToolbar)}`,
				borderRight: `1px solid
								${token('color.background.accent.gray.subtler', akEditorTableBorder)}`,
				width: `${akEditorTableNumberColumnWidth}px`,
				textAlign: 'center',
				color: `${token('color.text.subtlest', N200)}`,
				// eslint-disable-next-line @atlaskit/design-system/use-tokens-typography
				fontSize: `${14 / 16} rem`,
			},

			[`.fixed .${RendererCssClassName.NUMBER_COLUMN}`]: {
				borderRight: `0px none`,
			},
		},
	},
});

const rendererTableColumnStyles = css({
	[`.${RendererCssClassName.DOCUMENT} .${TableSharedCssClassName.TABLE_CONTAINER}`]: {
		'table[data-number-column="true"]': {
			[`.${RendererCssClassName.NUMBER_COLUMN}`]: {
				backgroundColor: `${token('color.background.accent.gray.subtlest')}`,
				borderRight: `1px solid
								${token('color.background.accent.gray.subtler', akEditorTableBorder)}`,
				width: `${akEditorTableNumberColumnWidth}px`,
				textAlign: 'center',
				color: `${token('color.text.subtlest', N200)}`,
				// eslint-disable-next-line @atlaskit/design-system/use-tokens-typography
				fontSize: `${14 / 16} rem`,
			},

			[`.fixed .${RendererCssClassName.NUMBER_COLUMN}`]: {
				borderRight: `0px none`,
			},
		},
	},
});

const rendererTableHeaderEqualHeightStylesAllowNestedHeaderLinks = css({
	[`.${RendererCssClassName.DOCUMENT} .${TableSharedCssClassName.TABLE_CONTAINER}`]: {
		[`.${TableSharedCssClassName.TABLE_NODE_WRAPPER} > table, .${TableSharedCssClassName.TABLE_STICKY_WRAPPER} > table`]:
			{
				[`.${RendererCssClassName.SORTABLE_COLUMN_WRAPPER}`]: {
					[`.${RendererCssClassName.SORTABLE_COLUMN}`]: {
						[`.${HeadingAnchorWrapperClassName}`]: {
							position: 'unset',
						},
						'>': {
							'h1, h2, h3, h4, h5, h6': {
								// eslint-disable-next-line @atlaskit/design-system/use-tokens-space
								marginRight: '30px',
							},
						},
					},
				},
			},
	},
});

// @ts-expect-error - throw TS error when use !import in position.
const stickyHeaderStyles = css({
	'tr[data-header-row].fixed': {
		position: 'fixed !important',
		display: 'flex',
		overflow: 'hidden',
		zIndex: `${akEditorStickyHeaderZIndex}`,

		borderRight: `1px solid ${token('color.background.accent.gray.subtler', akEditorTableBorder)}`,
		borderBottom: `1px solid ${token('color.background.accent.gray.subtler', akEditorTableBorder)}`,

		/* this is to compensate for the table border */
		transform: 'translateX(-1px)',
	},

	'.sticky > th': {
		zIndex: `${akEditorStickyHeaderZIndex}`,
		position: 'fixed !important',
		top: 0,
	},

	/* Make the number column header sticky */
	'.sticky > td': {
		position: 'fixed !important',
		top: 0,
	},

	/* add border for position: sticky
 and work around background-clip: padding-box
 bug for FF causing box-shadow bug in Chrome */
	'.sticky th, .sticky td': {
		boxShadow: `0px 1px ${token('color.background.accent.gray.subtler', akEditorTableBorder)},
			0px -0.5px ${token('color.background.accent.gray.subtler', akEditorTableBorder)},
			inset -1px 0px ${token('color.background.accent.gray.subtler', akEditorTableToolbar)},
			0px -1px ${token('color.background.accent.gray.subtler', akEditorTableToolbar)}`,
	},

	/* this will remove jumpiness caused in Chrome for sticky headers */
	'.fixed + tr': {
		minHeight: '0px',
	},
});

const codeBlockAndLayoutStyles = css({
	/*
	 * We wrap CodeBlock in a grid to prevent it from overflowing the container of the renderer.
	 * See ED-4159.
	 */
	'& .code-block': {
		maxWidth: '100%',
		display: 'block',
		position: 'relative',
		borderRadius: token('border.radius.100', '3px'),

		/*
		 * The overall renderer has word-wrap: break; which causes issues with
		 * code block line numbers in Safari / iOS.
		 */
		wordWrap: 'normal',
	},

	'& .MediaGroup, & .code-block': {
		marginTop: `${blockNodesVerticalMargin}`,

		// eslint-disable-next-line @atlaskit/ui-styling-standard/no-unsafe-selectors
		'&:first-child': {
			marginTop: 0,
		},
	},

	// We overwrite the rule that clears margin-top for first nested codeblocks, as
	// our lightweight codeblock dom structure will always nest the codeblock inside
	// an extra container div which would constantly be targeted. Now, top-level
	// lightweight codeblock containers will not be targeted.
	// NOTE: This must be added after other .code-block styles in the root
	// Renderer stylesheet.
	[`.${RendererCssClassName.DOCUMENT}
		> .${LightWeightCodeBlockCssClassName.CONTAINER}
		.${CodeBlockSharedCssClassName.CODEBLOCK_CONTAINER}`]: {
		marginTop: blockNodesVerticalMargin,
	},

	'& [data-layout-section]': {
		marginTop: token('space.250', '20px'),
		'& > div + div': {
			marginLeft: token('space.400', '32px'),
		},

		[`@media screen and (max-width: ${gridMediumMaxWidth}px)`]: {
			'& > div + div': {
				marginLeft: 0,
			},
		},

		'& .MediaGroup, & .code-block': {
			marginTop: blockNodesVerticalMargin,

			// eslint-disable-next-line @atlaskit/ui-styling-standard/no-unsafe-selectors
			'&:first-child': {
				marginTop: 0,
			},
		},
	},

	'& li': {
		'> .code-block': {
			margin: `${blockNodesVerticalMargin} 0 0 0`,
		},

		// eslint-disable-next-line @atlaskit/ui-styling-standard/no-unsafe-selectors
		'> .code-block:first-child': {
			marginTop: 0,
		},

		// eslint-disable-next-line @atlaskit/ui-styling-standard/no-unsafe-selectors
		'> div:last-of-type.code-block': {
			marginBottom: blockNodesVerticalMargin,
		},
	},
});

const layoutSectionForAdvancedLayoutsStyles = css({
	'& [data-layout-section]': {
		'& > div + div': {
			marginLeft: 0,
		},
	},
});

const gridRenderForCodeBlockStyles = css({
	'& .code-block': {
		// removed old -ms- prefix, as grid is well supported for MS Edge
		display: 'grid',
		gridTemplateColumns: 'minmax(0, 1fr)',

		'& > span': {
			gridColumn: 1,
		},
	},
});

// This prevents https://product-fabric.atlassian.net/browse/ED-20924
const codeBlockInListSafariFixStyles = css({
	[`&:not([data-node-type='decisionList']) > li,
		&:not(.${SmartCardSharedCssClassName.BLOCK_CARD_CONTAINER}) > li`]: {
		'&::before': {
			content: '" "',
			// eslint-disable-next-line @atlaskit/design-system/use-tokens-typography
			lineHeight: akEditorLineHeight,
		},

		[`> p:first-child,
			> .code-block:first-child,
			> .ProseMirror-gapcursor:first-child + .code-block`]: {
			marginTop: `-${akEditorLineHeight}em !important`,
		},
	},
});

const columnLayoutSharedStyle = css({
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors -- Ignored via go/DSP-18766
	'[data-layout-section]': {
		position: 'relative',
		display: 'flex',
		flexDirection: 'row',
		// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors -- Ignored via go/DSP-18766
		'& > *': {
			flex: 1,
			minWidth: 0,
		},
		// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors -- Ignored via go/DSP-18766
		'& > .unsupportedBlockView-content-wrap': {
			minWidth: 'initial',
		},
		// eslint-disable-next-line @atlaskit/ui-styling-standard/no-unsafe-values, @atlaskit/ui-styling-standard/no-imported-style-values -- Ignored via go/DSP-18766
		[`@media screen and (max-width: ${gridMediumMaxWidth}px)`]: {
			flexDirection: 'column',
		},
	},
});

const columnLayoutResponsiveSharedStyle = css({
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors
	'[data-layout-section]': {
		display: 'flex',
		flexDirection: 'row',
		gap: token('space.100', '8px'),

		// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors
		'& > *': {
			flex: 1,
			minWidth: 0,
		},

		// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors
		'& > .unsupportedBlockView-content-wrap': {
			minWidth: 'initial',
		},
	},
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors -- Ignored via go/DSP-18766
	'.layout-section-container': {
		containerType: 'inline-size',
		containerName: 'layout-area',
	},
});

const columnLayoutResponsiveRendererStyles = css({
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors
	'.layout-section-container [data-layout-section]': {
		gap: token('space.600', '48px'),
		// eslint-disable-next-line @atlaskit/ui-styling-standard/no-container-queries
		[`@container layout-area (max-width: ${LAYOUT_BREAKPOINT_RENDERER}px)`]: {
			flexDirection: 'column',
			gap: token('space.400', '32px'),
		},
	},
});

const rendererAnnotationStyles = css({
	"& [data-mark-type='annotation'][data-mark-annotation-state='active'] [data-annotation-mark], & [data-annotation-draft-mark][data-annotation-inline-node]":
		{
			background: token('color.background.accent.yellow.subtler', Y75),
			borderBottom: `2px solid ${token('color.border.accent.yellow', Y300)}`,
			boxShadow: token('elevation.shadow.overlay', `1px 2px 3px ${N60A}, -1px 2px 3px ${N60A}`),
			cursor: 'pointer',
			padding: `${token('space.050', '4px')} ${token('space.025', '2px')}`,
		},
});

const rendererAnnotationStylesCommentHeightFix = css({
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors
	'& [data-annotation-draft-mark][data-annotation-inline-node]': {
		borderBottom: '2px solid transparent',
		cursor: 'pointer',
		padding: '1px 0 2px',
		background: token('color.background.accent.yellow.subtler', Y75),
		borderBottomColor: token('color.border.accent.yellow', Y300),
		boxShadow: token('elevation.shadow.overlay', `1px 2px 3px ${N60A}, -1px 2px 3px ${N60A}`),
	},
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors
	'& [data-annotation-draft-mark][data-annotation-inline-node][data-inline-card]': {
		padding: '5px 0 3px 0',
	},
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors
	'& [data-annotation-draft-mark][data-annotation-inline-node].date-lozenger-container': {
		paddingTop: token('space.025', '2px'),
	},
});

type RendererStyleContainerProps = Pick<
	RendererWrapperProps,
	| 'onClick'
	| 'onMouseDown'
	| 'appearance'
	| 'allowNestedHeaderLinks'
	| 'allowColumnSorting'
	| 'useBlockRenderForCodeBlock'
	| 'allowAnnotations'
	| 'allowTableResizing'
	| 'innerRef'
	| 'children'
	| 'allowRendererContainerStyles'
> & {
	testId?: string;
};

export const RendererStyleContainer = (props: RendererStyleContainerProps) => {
	const {
		onClick,
		onMouseDown,
		appearance,
		allowNestedHeaderLinks,
		allowColumnSorting,
		useBlockRenderForCodeBlock,
		children,
		innerRef,
		testId,
	} = props;

	const isAdvancedLayoutsOn = editorExperiment('advanced_layouts', true);

	return (
		// eslint-disable-next-line jsx-a11y/click-events-have-key-events, jsx-a11y/no-static-element-interactions, @atlassian/a11y/interactive-element-not-keyboard-focusable
		<div
			ref={innerRef}
			onClick={onClick}
			onMouseDown={onMouseDown}
			style={
				{
					'--ak-renderer-base-font-size': `${getBaseFontSize(appearance)}px`,
					'--ak-renderer-editor-font-heading-h1': `${editorUGCToken('editor.font.heading.h1')}`,
					'--ak-renderer-editor-font-heading-h2': `${editorUGCToken('editor.font.heading.h2')}`,
					'--ak-renderer-editor-font-heading-h3': `${editorUGCToken('editor.font.heading.h3')}`,
					'--ak-renderer-editor-font-heading-h4': `${editorUGCToken('editor.font.heading.h4')}`,
					'--ak-renderer-editor-font-heading-h5': `${editorUGCToken('editor.font.heading.h5')}`,
					'--ak-renderer-editor-font-heading-h6': `${editorUGCToken('editor.font.heading.h6')}`,
					'--ak-renderer-editor-font-normal-text': `${editorUGCToken('editor.font.body')}`,
				} as React.CSSProperties
			}
			css={[
				baseStyles,
				hideHeadingCopyLinkWrapperStyles,
				appearance === 'full-page' && rendererFullPageStyles,
				appearance === 'full-width' && rendererFullWidthStyles,
				appearance === 'full-width' &&
					!isTableResizingEnabled(appearance) &&
					rendererFullWidthStylesForTableResizing,
				telepointerStyles,
				whitespaceSharedStyles,
				blockquoteSharedStyles,
				fg('platform_editor_typography_ugc')
					? headingsSharedStylesWithEditorUGC
					: headingsSharedStyles,
				headingWithAlignmentStyles,
				ruleSharedStyles,
				fg('platform_editor_typography_ugc')
					? paragraphSharedStylesWithEditorUGC
					: paragraphSharedStyles,
				listsSharedStyles,
				browser.gecko && listsSharedStylesForGekko,
				indentationSharedStyles,
				fg('platform_editor__renderer_indentation_text_margin') &&
					indentationSharedStylesWithMarginFix,
				blockMarksSharedStyles,
				codeMarkSharedStyles,
				shadowSharedStyle,
				dateSharedStyle,
				textColorStyles,
				backgroundColorStyles,
				tasksAndDecisionsStyles,
				smartCardStyles,
				fg('platform-linking-visual-refresh-v1') && smartCardStylesAvatarFix,
				fg('smartcard_avatar_margin_fix') && smartCardStylesAvatarMarginFix,
				// eslint-disable-next-line @atlaskit/platform/ensure-feature-flag-prefix
				fg('editor_inline_comments_on_inline_nodes') && rendererAnnotationStyles,
				// eslint-disable-next-line @atlaskit/platform/no-preconditioning, @atlaskit/platform/ensure-feature-flag-prefix
				fg('editor_inline_comments_on_inline_nodes') &&
					// eslint-disable-next-line @atlaskit/platform/ensure-feature-flag-prefix
					fg('annotations_align_editor_and_renderer_styles') &&
					rendererAnnotationStylesCommentHeightFix,
				baseOtherStyles,
				allowNestedHeaderLinks && alignedHeadingAnchorStyle,
				mediaSingleSharedStyle,
				tableSharedStyle,
				tableRendererHeaderStylesForTableCellOnly,
				fg('platform_editor_bordered_panel_nested_in_table') && tableRendererNestedPanelStyles,
				isBackgroundClipBrowserFixNeeded() && tableStylesBackGroundClipForGeckoForTableCellOnly,
				fg('platform_editor_nested_dnd_styles_changes')
					? firstNodeWithNotMarginTopWithNestedDnD
					: firstNodeWithNotMarginTop,
				rendererTableStyles,
				isStickyScrollbarEnabled(appearance) && stickyScrollbarStyles,
				rendererTableHeaderEqualHeightStylesForTableCellOnly,
				allowColumnSorting && rendererTableSortableColumnStyles,
				allowColumnSorting &&
					allowNestedHeaderLinks &&
					rendererTableHeaderEqualHeightStylesAllowNestedHeaderLinks,
				fg('platform_editor_tables_numbered_column_correction')
					? rendererTableColumnStyles
					: rendererTableColumnStylesOld,
				stickyHeaderStyles,
				codeBlockAndLayoutStyles,
				columnLayoutSharedStyle,
				isAdvancedLayoutsOn && columnLayoutResponsiveSharedStyle,
				isAdvancedLayoutsOn && columnLayoutResponsiveRendererStyles,
				isAdvancedLayoutsOn && layoutSectionForAdvancedLayoutsStyles,
				!useBlockRenderForCodeBlock && gridRenderForCodeBlockStyles,
				browser.safari && codeBlockInListSafariFixStyles,
				appearance === 'full-page' && fg('platform_breakout_cls') ? responsiveBreakoutWidth : null,
				appearance === 'full-width' && fg('platform_breakout_cls')
					? responsiveBreakoutWidthFullWidth
					: null,
			]}
			data-testid={testId}
		>
			{children}
		</div>
	);
};
