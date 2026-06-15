// TODO: EDITOR-6833 - Expected across this entire file, future violations are expected. Will try to remove them later after fully migration
/* eslint-disable @atlaskit/platform/use-motion-token-values, @atlaskit/ui-styling-standard/no-nested-selectors, @atlaskit/design-system/no-invalid-css-map, @atlaskit/ui-styling-standard/no-unsafe-values, @atlaskit/ui-styling-standard/no-imported-style-values, @atlaskit/ui-styling-standard/no-unsafe-selectors, @atlaskit/platform/expand-spacing-shorthand, @atlaskit/platform/expand-border-shorthand, @atlaskit/platform/expand-background-shorthand */
/**
 * @jsxRuntime classic
 * @jsx jsx
 * Compiled migration: platform_editor_core_static_css
 */
import React from 'react';

import { css, cssMap, jsx, keyframes } from '@compiled/react';

// eslint-disable-next-line import/order
import { getBrowserInfo } from '@atlaskit/editor-common/browser';

// eslint-disable-next-line @atlaskit/editor/enforce-todo-comment-format
// TODO: add back tableSharedStyle when migrate table styles
// import { richMediaClassName, tableSharedStyle } from '@atlaskit/editor-common/styles';
import { PanelSharedCssClassName } from '@atlaskit/editor-common/panel';
import {
	AnnotationSharedClassNames,
	richMediaClassName,
	expandClassNames,
	SmartCardSharedCssClassName,
	CodeBlockSharedCssClassName,
	tableCellBorderWidth,
	tableCellMinWidth,
	TaskDecisionSharedCssClassName,
} from '@atlaskit/editor-common/styles';
import {
	BodiedSyncBlockSharedCssClassName,
	SyncBlockSharedCssClassName,
	SyncBlockLabelSharedCssClassName,
	SyncBlockStateCssClassName,
} from '@atlaskit/editor-common/sync-block';
import { tableCellBackgroundStyleOverrideForCompiled } from '@atlaskit/editor-common/table-cell-background-for-compiled';
import type {
	EditorAppearance,
	EditorContentMode,
	FeatureFlags,
} from '@atlaskit/editor-common/types';
import {
	akEditorFullPageDefaultFontSize,
	akEditorFullPageDenseFontSize,
	akEditorGutterPaddingDynamic,
	akEditorSwoopCubicBezier,
	akEditorTableNumberColumnWidth,
} from '@atlaskit/editor-shared-styles';
import { overflowShadowForCompiled } from '@atlaskit/editor-shared-styles/overflow-shadow-for-compiled';
import { fg } from '@atlaskit/platform-feature-flags';
import { expValEquals } from '@atlaskit/tmp-editor-statsig/exp-val-equals';
import { expValEqualsNoExposure } from '@atlaskit/tmp-editor-statsig/exp-val-equals-no-exposure';
import { editorExperiment } from '@atlaskit/tmp-editor-statsig/experiments';
import { useThemeObserver, token } from '@atlaskit/tokens';

import { getBaseFontSize } from '../../composable-editor/utils/getBaseFontSize';

// = akEditorDefaultLayoutWidth * breakoutWideScaleRatio = 1010.8 ~ 1011 This is a resulting width value that is applied to nodes that currently use breakouts (except table) and are set to `wide` when the viewport's width is > 1329px.
const akEditorCalculatedWideLayoutWidth = 1011;
// from breakoutConsts.calcWideWidth, layoutMaxWidth * breakoutConsts.wideScaleRatio = 904.8 ~ 905 This is a resulting width value that is applied to nodes that currently use breakouts (except table) and are set to `wide` when the viewport's width is <= 1266px.
const akEditorCalculatedWideLayoutWidthSmallViewport = 905;
const akEditorGutterPadding = 32;
const akEditorDefaultLayoutWidth = 760;
const akEditorFullWidthLayoutWidth = 1800;
// The breakpoint for small devices is 1266px, copied from getBreakpoint in platform/packages/editor/editor-common/src/ui/WidthProvider/index.tsx
const akEditorBreakpointForSmallDevice = `1266px`;

const akEditorGutterPaddingReduced = 24;
const akEditorFullPageNarrowBreakout = 600;
const akEditorUltraWideLayoutWidth = 4000;
// Layout responsiveness breakpoints — chosen to align editor layout responsiveness with the renderer.
// Applied to the editor-area container query (max-width) for layout sections.
const akEditorLayoutFullWidthBreakpoint = 724;
const akEditorLayoutFixedWidthBreakpoint = 788;
const akEditorLayoutResizedBreakpoint = 820;

// Originally copied from packages/editor/editor-core/src/ui/Appearance/Comment/Comment.tsx
const CommentEditorMargin = 14;
const GRID_GUTTER = 12;

const blockNodesVerticalMargin = '0.75rem';
const fontSize14px = `${14 / 16}rem`;
const scaledBlockNodesVerticalMargin = '0.75em';

// emoji constants — values inlined from packages/elements/emoji/src/util/constants.ts
// If you need to update these values, please also update packages/elements/emoji/src/util/constants.ts
const defaultEmojiHeight = 20;
const defaultDenseEmojiHeight = 16.25;
const scaledEmojiHeightH1 = 28;
const scaledEmojiHeightH2 = 26;
const scaledEmojiHeightH3 = 24;
const scaledEmojiHeightH4 = 22;
const denseEmojiHeightH1 = 24.25;
const denseEmojiHeightH2 = 22.25;
const denseEmojiHeightH3 = 20.25;
const denseEmojiHeightH4 = 18.25;

// TODO: EDITOR-6932 - inline them at the end of migration
const emojiSelectionStyles = css({
	borderRadius: token('radius.xsmall'),
});

const gutterDangerOverlay = css({
	'&::after': {
		height: '100%',
		content: "''",
		position: 'absolute',
		left: 0,
		top: 0,
		width: '24px',
		backgroundColor: token('color.blanket.danger'),
	},
});

const blanketSelectionStyles = css({
	position: 'relative',
	// Fixes ED-9263, where emoji or inline card in panel makes selection go outside the panel
	// in Safari. Looks like it's caused by user-select: all in the emoji element
	WebkitUserSelect: 'text',
	'&::before': {
		position: 'absolute',
		content: "''",
		left: 0,
		right: 0,
		top: 0,
		bottom: 0,
		width: '100%',
		pointerEvents: 'none',
		zIndex: 12,
		backgroundColor: token('color.blanket.selected'),
	},
});
// copied from packages/editor/editor-shared-styles/src/consts/consts.ts
const akEditorLineHeight = 1.714;
const listsStylesSafariFixMultiSelector = `
	.ProseMirror:not(.blockCardView-content-wrap) > li > p:first-child,
	.ProseMirror:not(.blockCardView-content-wrap) > li > .code-block:first-child,
	.ProseMirror:not(.blockCardView-content-wrap) > li > .ProseMirror-gapcursor:first-child + .code-block`;

const editorAreaNonSmallDeviceContainerQuery = `@container editor-area (width >= ${akEditorBreakpointForSmallDevice})`;
const editorAreaNarrowPageContainerQuery = `@container editor-area (max-width: ${akEditorFullPageNarrowBreakout}px)`;
const editorAreaLayoutFullWidthMaxWidthContainerQuery = `@container editor-area (max-width: ${akEditorLayoutFullWidthBreakpoint}px)`;
const editorAreaLayoutFixedWidthMaxWidthContainerQuery = `@container editor-area (max-width: ${akEditorLayoutFixedWidthBreakpoint}px)`;
const editorAreaLayoutResizedMaxWidthContainerQuery = `@container editor-area (max-width: ${akEditorLayoutResizedBreakpoint}px)`;

const placeholderFadeInKeyframes = keyframes({
	from: {
		opacity: 0,
	},
	to: {
		opacity: 1,
	},
});

const fadeIn = keyframes({
	from: {
		opacity: 0,
		transform: 'translateY(16px)',
	},
	to: {
		opacity: 1,
		transform: 'translateY(0)',
	},
});

const hideNativeBrowserTextSelectionStyles = css({
	'&::selection,*::selection': {
		backgroundColor: 'transparent',
	},
	'&::-moz-selection,*::-moz-selection': {
		backgroundColor: 'transparent',
	},
});

const boxShadowSelectionStyles = css({
	boxShadow: `0 0 0 1px ${token('color.border.selected')}`,
	borderColor: 'transparent',
});

// TODO: EDITOR-6932 - inline them at the end of migration
const dangerBorderStyles = css({
	boxShadow: `0 0 0 1px ${token('color.border.danger')}`,
});

// TODO: EDITOR-6932 - inline them at the end of migration
const backgroundSelectionStyles = css({
	backgroundColor: token('color.background.selected'),
});

// TODO: EDITOR-6932 - inline them at the end of migration
const dangerBackgroundStyles = css({
	backgroundColor: token('color.background.danger'),
});

// TODO: EDITOR-6932 - inline them at the end of migration
const mentionsSelectedColor = css({
	color: token('color.text.subtle'),
});

const fixVerticalAlignmentSelector = `
	&:first-of-type + ul,
	&:first-of-type + span + ul,
	&:first-of-type + ol,
	&:first-of-type + span + ol,
	&:first-of-type + pre,
	&:first-of-type + span + pre,
	&:first-of-type + blockquote,
	&:first-of-type + span + blockquote
`;

const gapCursorTwoImagesSideBySideFixSelector = `
  .ProseMirror-gapcursor[layout="wrap-left"] + span + [layout="wrap-left"],
  .ProseMirror-gapcursor[layout="wrap-right"] + span + [layout="wrap-right"],
  .ProseMirror-gapcursor + [layout="wrap-left"] + [layout="wrap-right"],
  .ProseMirror-gapcursor + [layout="wrap-left"] + span + [layout="wrap-right"],
  .ProseMirror-gapcursor + [layout="wrap-right"] + [layout="wrap-left"],
  .ProseMirror-gapcursor + [layout="wrap-right"] + span + [layout="wrap-left"],
  [layout="wrap-left"] + .ProseMirror-gapcursor + [layout="wrap-right"],
  [layout="wrap-left"] + .ProseMirror-gapcursor + span [layout="wrap-right"],
  [layout="wrap-right"] + .ProseMirror-gapcursor + [layout="wrap-left"],
  [layout="wrap-right"] + .ProseMirror-gapcursor + span + [layout="wrap-left"],
  [layout="wrap-left"] + .ProseMirror-gapcursor`;

const gapCursorMarginFixSelector = `
  [layout="wrap-left"] + .ProseMirror-gapcursor + [layout="wrap-right"] > div,
  [layout="wrap-left"] + .ProseMirror-gapcursor + span + [layout="wrap-right"] > div,
  [layout="wrap-right"] + .ProseMirror-gapcursor + [layout="wrap-left"] > div,
  [layout="wrap-right"] + .ProseMirror-gapcursor + span + [layout="wrap-left"] > div,
  .ProseMirror-gapcursor + [layout="wrap-right"] + [layout="wrap-left"] > div,
  .ProseMirror-gapcursor + [layout="wrap-right"] + span + [layout="wrap-left"] > div,
  .ProseMirror-gapcursor + [layout="wrap-left"] + [layout="wrap-right"] > div,
  .ProseMirror-gapcursor + [layout="wrap-left"] + span + [layout="wrap-right"] > div`;

const gapCursorFloatLeftFixSelector = `
  [layout="wrap-left"] + .ProseMirror-gapcursor,
  [layout="wrap-right"] + .ProseMirror-gapcursor`;

const gapCursorAfterPseudoSelector = `
  .ProseMirror-gapcursor + [layout="wrap-left"] + span + [layout="wrap-right"]::after,
  .ProseMirror-gapcursor + [layout="wrap-right"] + span + [layout="wrap-left"]::after,
  [layout="wrap-left"] + .ProseMirror-gapcursor + [layout="wrap-right"]::after,
  [layout="wrap-left"] + .ProseMirror-gapcursor + span + [layout="wrap-right"]::after,
  [layout="wrap-right"] + .ProseMirror-gapcursor + [layout="wrap-left"]::after,
  [layout="wrap-right"] + .ProseMirror-gapcursor + span + [layout="wrap-left"]::after`;

const gapCursorMarginDeepChildrenFixSelector = `
  [layout="wrap-left"] + .ProseMirror-gapcursor + [layout="wrap-right"] + *,
  [layout="wrap-left"] + .ProseMirror-gapcursor + [layout="wrap-right"] + span + *,
  [layout="wrap-right"] + .ProseMirror-gapcursor + [layout="wrap-left"] + *,
  [layout="wrap-right"] + .ProseMirror-gapcursor + [layout="wrap-left"] + span + *,
  [layout="wrap-left"] + .ProseMirror-gapcursor + span + [layout="wrap-right"] + *,
  [layout="wrap-right"] + .ProseMirror-gapcursor + span + [layout="wrap-left"] + *,
  .ProseMirror-gapcursor + [layout="wrap-left"] + span + [layout="wrap-right"] + *,
  .ProseMirror-gapcursor + [layout="wrap-right"] + span + [layout="wrap-left"] + *,
  [layout="wrap-left"] + .ProseMirror-gapcursor + [layout="wrap-right"] + * > *,
  [layout="wrap-left"] + .ProseMirror-gapcursor + [layout="wrap-right"] + span + * > *,
  [layout="wrap-right"] + .ProseMirror-gapcursor + [layout="wrap-left"] + * > *,
  [layout="wrap-right"] + .ProseMirror-gapcursor + [layout="wrap-left"] + span + * > *,
  [layout="wrap-left"] + .ProseMirror-gapcursor + span + [layout="wrap-right"] + * > *,
  [layout="wrap-right"] + .ProseMirror-gapcursor + span + [layout="wrap-left"] + * > *,
  .ProseMirror-gapcursor + [layout="wrap-left"] + span + [layout="wrap-right"] + * > *,
  .ProseMirror-gapcursor + [layout="wrap-right"] + span + [layout="wrap-left"] + * > *,
  .ProseMirror-widget:not([data-blocks-decoration-container="true"]):not([data-blocks-drag-handle-container="true"]):not([data-blocks-quick-insert-container="true"]) + .ProseMirror-gapcursor + *,
  .ProseMirror-widget:not([data-blocks-decoration-container="true"]):not([data-blocks-drag-handle-container="true"]):not([data-blocks-quick-insert-container="true"]) + .ProseMirror-gapcursor + span + *`;

const gapCursorBlink = keyframes({
	'from, to': {
		opacity: 0,
	},
	'50%': {
		opacity: 1,
	},
});

const pulseIn = keyframes({
	'0%, 100%': {
		transform: 'scaleX(0)',
		opacity: 0,
	},
	'10%': {
		transform: 'scaleX(1.4)',
		opacity: 1,
	},
	'15%, 85%': {
		transform: 'scaleX(1)',
		opacity: 1,
	},
});

const pulseOut = keyframes({
	'0%, 90%, 100%': {
		transform: 'scaleX(1)',
		opacity: 1,
	},
	'10%, 80%': {
		transform: 'scaleX(0)',
		opacity: 0,
	},
});

const pulseInDuringTr = keyframes({
	'0%, 95%': {
		transform: 'scaleX(1)',
		opacity: 1,
	},
	'100%': {
		transform: 'scaleX(0)',
		opacity: 0,
	},
});

const pulseOutDuringTr = keyframes({
	'100%': {
		transform: 'scaleX(1)',
		opacity: 1,
	},
	'0%, 90%': {
		transform: 'scaleX(0)',
		opacity: 0,
	},
});

const syncBlockCreationLoadingKeyframes = keyframes({
	from: { '--angle': '0deg' },
	to: { '--angle': '360deg' },
});

/**
 * aiPanelStyles
 * was imported from packages/editor/editor-core/src/ui/ContentStyles/ai-panels.ts
 */
const rotationAnimation = keyframes({
	'0%': {
		'--panel-gradient-angle': '0deg',
	},
	'100%': {
		'--panel-gradient-angle': '360deg',
	},
});

const rotationAnimationFirefox = keyframes({
	'0%': {
		'--panel-gradient-angle': '0deg',
		backgroundPosition: '100%',
	},
	'100%': {
		'--panel-gradient-angle': '360deg',
		backgroundPosition: '-100%',
	},
});

// eslint-disable-next-line @atlaskit/ui-styling-standard/no-unsafe-values
const prismBorderBaseBackgroundFirefox = `linear-gradient(90deg, #0065FF 0%, #0469FF 12%, #BF63F3 24%, #FFA900 48%, #BF63F3 64%, #0469FF 80%, #0065FF 100%)`;

// eslint-disable-next-line @atlaskit/ui-styling-standard/no-unsafe-values
const prismBorderBaseBackground = `conic-gradient(from var(--panel-gradient-angle, 270deg), #0065FF 0%, #0469FF 20%, #BF63F3 50%, #FFA900 56%, #0065FF 100%)`;

// eslint-disable-next-line @atlaskit/ui-styling-standard/no-unsafe-values
const prismBorderDarkBackgroundFirefox = `linear-gradient(90deg, #0065FF80 0%, #0469FF80 12%, #BF63F380 24%, #FFA90080 48%, #BF63F380 64%, #0469FF80 80%, #0065FF80 100%)`;

// eslint-disable-next-line @atlaskit/ui-styling-standard/no-unsafe-values
const prismBorderDarkBackground = `conic-gradient(from var(--panel-gradient-angle, 270deg), #0065FF80 0%, #0469FF80 20%, #BF63F380 50%, #FFA90080 56%, #0065FF80 100%)`;

// TODO: EDITOR-6932 - inline them at the end of migration
const borderSelectionStyles = css({
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-unsafe-values
	border: `1px solid ${token('color.border.selected')}`,

	// Fixes ED-15246: Trello card is visible through a border of a table border
	'&::after': {
		height: '100%',
		content: "'\\00a0'",
		// eslint-disable-next-line @atlaskit/ui-styling-standard/no-unsafe-values
		background: token('color.border.selected'),
		position: 'absolute',
		right: -1,
		top: 0,
		bottom: 0,
		width: 1,
		border: 'none',
		display: 'inline-block',
	},
});

const overflowShadowStyles = css({
	backgroundImage: `
		linear-gradient(
			to right,
			${token('color.background.neutral')} ${token('space.300')},
			transparent ${token('space.300')}
		),
		linear-gradient(
			to right,
			${token('elevation.surface.raised')} ${token('space.300')},
			transparent ${token('space.300')}
		),
		linear-gradient(
			to left,
			${token('color.background.neutral')} ${token('space.100')},
			transparent ${token('space.100')}
		),
		linear-gradient(
			to left,
			${token('elevation.surface.raised')} ${token('space.100')},
			transparent ${token('space.100')}
		),
		linear-gradient(
			to left,
			${token('elevation.shadow.overflow.spread')} 0,
			${token('utility.UNSAFE.transparent')}  ${token('space.100')}
		),
		linear-gradient(
			to left,
			${token('elevation.shadow.overflow.perimeter')} 0,
			${token('utility.UNSAFE.transparent')}  ${token('space.100')}
		),
		linear-gradient(
			to right,
			${token('elevation.shadow.overflow.spread')} 0,
			${token('utility.UNSAFE.transparent')}  ${token('space.100')}
		),
		linear-gradient(
			to right,
			${token('elevation.shadow.overflow.perimeter')} 0,
			${token('utility.UNSAFE.transparent')}  ${token('space.100')}
		)
	`,
});

/**
 * editorContentStyles migrated styles from EditorContentContainer/styles,
 * the styles migration is under `platform_editor_core_static_css`,
 * this FF has a global tests override atm, while waiting for some fixes from compiled and atlaspack,
 * if you are making changes, please do VR/Integration test locally and individually by temporarily removing FF overrides from
 * packages/editor/editor-test-overrides/src/gemini-platform-feature-gate-overrides.ts, and
 * packages/editor/tmp-editor-statsig/src/exp-test-overrides.ts.
 *
 * If you are not sure, please contact #proj-cc-editor-full-compiled-css-migration
 */
const editorContentStyles = cssMap({
	aiPanelBaseFirefoxStyles: {
		'div[extensionType="com.atlassian.ai-blocks"]': {
			'&::before, &::after': {
				// eslint-disable-next-line @atlaskit/ui-styling-standard/no-unsafe-values
				background: prismBorderBaseBackgroundFirefox,
				backgroundSize: '200%',
			},
		},
		// eslint-disable-next-line @atlaskit/ui-styling-standard/no-unsafe-selectors
		'div[extensionType="com.atlassian.ai-blocks"]:has(.streaming)': {
			'.extension-container': {
				'&::before, &::after': {
					animationName: rotationAnimationFirefox,
					animationDuration: '1s',
					animationDirection: 'normal',
				},
			},
		},
	},
	aiPanelBaseStyles: {
		'@property --panel-gradient-angle': {
			syntax: "'<angle>'",
			initialValue: '270deg',
			inherits: 'false',
		},
		'div[extensionType="com.atlassian.ai-blocks"]': {
			/* This hides the label for the extension */
			'.extension-label': {
				display: 'none',
			},
			/* This styles the ai panel correctly when its just sitting on the page and there
		is no user interaction */
			'.extension-container': {
				position: 'relative',
				boxShadow: 'none',
				overflow: 'unset',
				// eslint-disable-next-line @atlaskit/ui-styling-standard/no-important-styles
				backgroundColor: `${token('elevation.surface')} !important`,
				// prismBorderBaseStyles
				'&::before, &::after': {
					content: "''",
					position: 'absolute',
					zIndex: -1,
					width: `calc(100% + 2px)`,
					height: `calc(100% + 2px)`,
					top: `-1px`,
					left: `-1px`,
					borderRadius: `calc(${token('radius.small', '3px')} + 1px)`,
					transform: 'translate3d(0, 0, 0)',
					// eslint-disable-next-line @atlaskit/ui-styling-standard/no-unsafe-values
					background: prismBorderBaseBackground,
				},
				'&.with-hover-border': {
					'&::before, &::after': {
						//prismBorderHoverStyles
						// eslint-disable-next-line @atlaskit/platform/expand-background-shorthand
						background: token('color.border.input'),
					},
				},
				'& .with-margin-styles': {
					// eslint-disable-next-line @atlaskit/ui-styling-standard/no-important-styles
					backgroundColor: `${token('elevation.surface')} !important`,
					borderRadius: token('radius.small', '3px'),
				},
			},
		},

		/* This styles the ai panel correctly when its streaming */
		// eslint-disable-next-line @atlaskit/ui-styling-standard/no-unsafe-selectors
		'div[extensionType="com.atlassian.ai-blocks"]:has(.streaming)': {
			'.extension-container': {
				'&::before, &::after': {
					// prismBorderAnimationStyles
					// eslint-disable-next-line @atlaskit/ui-styling-standard/no-unsafe-values
					animationName: rotationAnimation,
					animationDuration: '2s',
					animationTimingFunction: 'linear',
					animationIterationCount: 'infinite',
					'@media (prefers-reduced-motion)': {
						animation: 'none',
					},
				},
			},
		},

		/* This styles the ai panel correctly when a user is hovering over the delete button in the floating panel */
		'div[extensionType="com.atlassian.ai-blocks"].danger': {
			'.extension-container': {
				boxShadow: `0 0 0 1px ${token('color.border.danger')}`,
			},
		},

		/* This removes the margin from the action list when inside an ai panel */
		'div[extensiontype="com.atlassian.ai-blocks"][extensionkey="ai-action-items-block:aiActionItemsBodiedExtension"]':
			{
				'div[data-node-type="actionList"]': {
					// eslint-disable-next-line @atlaskit/ui-styling-standard/no-important-styles
					margin: '0 !important',
				},
			},
	},
	aiPanelDarkFirefoxStyles: {
		'div[extensionType="com.atlassian.ai-blocks"]': {
			'.extension-container': {
				'&::before, &::after': {
					// eslint-disable-next-line @atlaskit/ui-styling-standard/no-unsafe-values
					background: prismBorderDarkBackgroundFirefox,
					backgroundSize: '200%',
				},
			},
		},
	},
	aiPanelDarkStyles: {
		'div[extensionType="com.atlassian.ai-blocks"]': {
			'.extension-container': {
				'&::before, &::after': {
					// eslint-disable-next-line @atlaskit/ui-styling-standard/no-unsafe-values
					background: prismBorderDarkBackground,
				},
			},
		},
	},
	alignMultipleWrappedImageInLayoutStyles: {
		'.ProseMirror [data-layout-section] [data-layout-column] > div': {
			// apply marginTop to wrapped mediaSingle that has preceding wrapped mediaSingle (even when there's gap cursor in between them)
			// Given the first wrapped mediaSingle in layout has 0 marginTop, this is needed to make sure fellow wrapped mediaSingle align with it horizontally
			'.mediaSingleView-content-wrap[layout^=wrap] + .mediaSingleView-content-wrap[layout^=wrap], .mediaSingleView-content-wrap[layout^=wrap] + .ProseMirror-gapcursor + .mediaSingleView-content-wrap[layout^=wrap]':
				{
					'.rich-media-item': {
						marginTop: 0,
					},
				},

			// Due to the above rule, wrapped mediaSingle (not the first node in layout) that are followed by wrapped mediaSingle should also have 0 marginTop
			// so it's aligned with the following wrapped mediaSingle
			// eslint-disable-next-line @atlaskit/ui-styling-standard/no-unsafe-selectors
			'.mediaSingleView-content-wrap[layout^=wrap]:has( + .mediaSingleView-content-wrap[layout^=wrap])':
				{
					'.rich-media-item': {
						marginTop: 0,
					},
				},
		},
	},
	annotationStyles: {
		'.ProseMirror': {
			// eslint-disable-next-line @atlaskit/ui-styling-standard/no-unsafe-values, @atlaskit/ui-styling-standard/no-imported-style-values
			[`.${AnnotationSharedClassNames.blur}, .${AnnotationSharedClassNames.focus}, .${AnnotationSharedClassNames.draft}, .${AnnotationSharedClassNames.hover}`]:
				{
					borderBottom: '2px solid transparent',
					cursor: 'pointer',
					padding: '1px 0 2px',
					// eslint-disable-next-line @atlaskit/ui-styling-standard/no-unsafe-selectors
					'&:has(.card), &:has([data-inline-card])': {
						padding: '5px 0 3px 0',
					},
					// eslint-disable-next-line @atlaskit/ui-styling-standard/no-unsafe-selectors
					'&:has(.date-lozenger-container)': {
						paddingTop: token('space.025'),
					},
				},
			// eslint-disable-next-line @atlaskit/ui-styling-standard/no-imported-style-values,@atlaskit/ui-styling-standard/no-unsafe-values
			[`.${AnnotationSharedClassNames.focus}`]: {
				// eslint-disable-next-line @atlaskit/platform/expand-background-shorthand
				background: token('color.background.accent.yellow.subtlest.pressed'),
				borderBottomColor: token('color.border.accent.yellow'),
				boxShadow: token('elevation.shadow.raised'),
			},

			// eslint-disable-next-line @atlaskit/ui-styling-standard/no-imported-style-values,@atlaskit/ui-styling-standard/no-unsafe-values
			[`.${AnnotationSharedClassNames.draft}`]: {
				// eslint-disable-next-line @atlaskit/platform/expand-background-shorthand
				background: token('color.background.accent.yellow.subtlest.pressed'),
				borderBottomColor: token('color.border.accent.yellow'),
				boxShadow: token('elevation.shadow.raised'),
				cursor: 'initial',
			},

			// eslint-disable-next-line @atlaskit/ui-styling-standard/no-imported-style-values,@atlaskit/ui-styling-standard/no-unsafe-values
			[`.${AnnotationSharedClassNames.blur}`]: {
				// eslint-disable-next-line @atlaskit/platform/expand-background-shorthand
				background: token('color.background.accent.yellow.subtlest'),
				borderBottomColor: token('color.border.accent.yellow'),
			},

			// eslint-disable-next-line @atlaskit/ui-styling-standard/no-imported-style-values,@atlaskit/ui-styling-standard/no-unsafe-values
			[`.${AnnotationSharedClassNames.hover}`]: {
				// eslint-disable-next-line @atlaskit/platform/expand-background-shorthand
				background: token('color.background.accent.yellow.subtlest.hovered'),
				borderBottomColor: token('color.border.accent.yellow'),
				boxShadow: token('elevation.shadow.raised'),
			},
		},
	},
	backgroundColorStyles: {
		'.fabric-background-color-mark': {
			backgroundColor: 'var(--custom-palette-color, inherit)',
			borderRadius: token('radius.xsmall'),
			// eslint-disable-next-line @atlaskit/design-system/use-tokens-space
			paddingTop: 1,
			// eslint-disable-next-line @atlaskit/design-system/use-tokens-space
			paddingBottom: 2,
			boxDecorationBreak: 'clone',
		},

		// Don't show text highlight styling when there is a hyperlink
		'a .fabric-background-color-mark': {
			backgroundColor: 'unset',
		},

		// Don't show text highlight styling when there is an inline comment
		'.fabric-background-color-mark .ak-editor-annotation': {
			backgroundColor: 'unset',
		},
	},
	baseStyles: {
		'--ak-editor--default-gutter-padding': `${akEditorGutterPadding}px`,
		'--ak-editor--default-layout-width': `${akEditorDefaultLayoutWidth}px`,
		'--ak-editor--resizer-handle-spacing': `12px`,
		'--ak-editor--full-width-layout-width': `${akEditorFullWidthLayoutWidth}px`,
		/* calculate editor line length, 100cqw is the editor container width */
		'--ak-editor--line-length':
			'min(calc(100cqw - var(--ak-editor--large-gutter-padding) * 2), var(--ak-editor--default-layout-width))',
		'--ak-editor--max-width-layout-width': `${akEditorUltraWideLayoutWidth}px`,
		'--ak-editor--breakout-wide-layout-width': `${akEditorCalculatedWideLayoutWidthSmallViewport}px`,
		'--ak-editor--breakout-full-page-guttering-padding':
			'calc(var(--ak-editor--large-gutter-padding) * 2 + var(--ak-editor--default-gutter-padding))',

		'--ak-editor--breakout-fallback-width':
			'calc(100cqw - var(--ak-editor--breakout-full-page-guttering-padding))',
		'--ak-editor--breakout-min-width': '100%',

		'.fabric-editor--full-width-mode': {
			'--ak-editor--line-length':
				'min(calc(100cqw - var(--ak-editor--large-gutter-padding) * 2), var(--ak-editor--full-width-layout-width))',
			/* in full width appearances it's not possible to rely on cqw because it doesn't account for the page scrollbar, which depends on users system settings */
			'--ak-editor--breakout-fallback-width': '100%',
			'--ak-editor--breakout-min-width': '0px',
		},

		'.ProseMirror': {
			'--ak-editor-max-container-width': 'calc(100cqw - var(--ak-editor--large-gutter-padding))',
			outline: 'none',
			// eslint-disable-next-line @atlaskit/design-system/use-tokens-typography
			fontSize: 'var(--ak-editor-base-font-size)',
		},

		/* We can't allow nodes that are inside other nodes to bleed from the parent container */
		'.ProseMirror > div[data-prosemirror-node-block] [data-prosemirror-node-block]': {
			'--ak-editor-max-container-width': '100%',
		},

		/* container editor-area is defined in platform/packages/editor/editor-core/src/ui/Appearance/FullPage/StyledComponents.ts */
		// eslint-disable-next-line @atlaskit/ui-styling-standard/no-unsafe-values
		[editorAreaNonSmallDeviceContainerQuery]: {
			'.ProseMirror': {
				'--ak-editor--breakout-wide-layout-width': `${akEditorCalculatedWideLayoutWidth}px`,
			},
		},
	},
	baseStylesMaxContainerWidthFixes: {
		'.ProseMirror': {
			'--ak-editor-max-container-width': 'calc(100cqw - var(--ak-editor--large-gutter-padding)*2)',
		},
	},
	blockMarksStyles: {
		// We need to remove margin-top from first item
		// inside doc, tableCell, tableHeader, blockquote, etc.
		//
		// - For nested block marks apart from those with indentation mark.
		// - Do not remove the margin top for nodes inside indentation marks.
		// - Do not remove the margin top for nodes inside alignment marks.
		// - Do not remove the margin top for nodes inside font size marks.
		//- If first element inside a block node has alignment or font size mark, then remove the margin-top.
		//- If first document element has indentation mark remove margin-top.
		// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors,@atlaskit/ui-styling-standard/no-unsafe-selectors
		'*:not(.fabric-editor-block-mark) >, *:not(.fabric-editor-block-mark) > div.fabric-editor-block-mark:first-of-type:not(.fabric-editor-indentation-mark):not(.fabric-editor-alignment):not(.fabric-editor-font-size), .fabric-editor-alignment:first-of-type:first-child, .fabric-editor-font-size:first-of-type:first-child, .ProseMirror .fabric-editor-indentation-mark:first-of-type:first-child':
			{
				// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors
				'p, h1, h2, h3, h4, h5, h6, .heading-wrapper': {
					// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors,@atlaskit/ui-styling-standard/no-unsafe-selectors
					'&:first-child:not(style), style:first-child + *': {
						marginTop: 0,
					},
				},
			},
	},
	blockquoteDangerStyles: {
		'.ProseMirror blockquote.danger': {
			backgroundColor: token('color.background.danger'),
			borderLeftColor: token('color.border.danger'),
		},
	},
	blockquoteSelectedNodeStyles: {
		'.ProseMirror blockquote.ak-editor-selected-node': {
			background: token('color.background.accent.blue.subtler'),
			borderLeftColor: token('color.border.selected'),
			WebkitUserSelect: 'text',

			'&::selection, *::selection': {
				backgroundColor: 'transparent',
			},

			'&::-moz-selection, *::-moz-selection': {
				backgroundColor: 'transparent',
			},
		},
	},
	blocktypeStyles: {
		'.ProseMirror': {
			// Block Quote Shared Styles
			'& blockquote': {
				boxSizing: 'border-box',
				color: 'inherit',
				width: '100%',
				display: 'inline-block',

				// These 2 styles are needed to avoid Confluence's batch.css overrides that expand blockquote with extra padding after SSR.
				paddingTop: 0,
				paddingBottom: 0,

				paddingLeft: token('space.200'),
				borderLeftWidth: token('border.width.selected'),
				borderLeftStyle: 'solid',
				borderLeftColor: token('color.border'),
				margin: '0.75rem 0 0 0', // From https://docs.google.com/spreadsheets/d/1iYusRGCT4PoPfvxbJ8NrgjtfFgXLm5lpDWXzjua1W2E/edit#gid=93913128
				marginRight: 0,
				'[dir="rtl"] &': {
					paddingLeft: 0,
					paddingRight: token('space.200'),
				},
				'&:first-child': {
					marginTop: 0,
				},
				'&::before': {
					content: "''",
				},
				'&::after': {
					content: 'none',
				},
				'& p': {
					display: 'block',
				},
				'& table, & table:last-child': {
					display: 'inline-table',
				},
				// Workaround for overriding the inline-block display on last child of a blockquote set in CSS reset.
				'> .code-block:last-child, >.mediaSingleView-content-wrap:last-child, >.mediaGroupView-content-wrap:last-child':
					{
						display: 'block',
					},
				'> .extensionView-content-wrap:last-child': {
					display: 'block',
				},
			},
			// Headings Shared Styles -> Heading With Alignment Styles
			// Override marginTop: 0 with default margin found in headingsSharedStyles for first heading in alignment block that is not the first child
			'.fabric-editor-block-mark.fabric-editor-alignment:not(:first-child)': {
				'> h1:first-child': {
					// eslint-disable-next-line @atlaskit/design-system/use-tokens-space
					marginTop: '1.667em',
				},
				'> h2:first-child': {
					// eslint-disable-next-line @atlaskit/design-system/use-tokens-space
					marginTop: '1.8em',
				},
				'> h3:first-child': {
					// eslint-disable-next-line @atlaskit/design-system/use-tokens-space
					marginTop: '2em',
				},
				'> h4:first-child': {
					// eslint-disable-next-line @atlaskit/design-system/use-tokens-space
					marginTop: '1.357em',
				},
				'> h5:first-child': {
					// eslint-disable-next-line @atlaskit/design-system/use-tokens-space
					marginTop: '1.667em',
				},
				'> h6:first-child': {
					// eslint-disable-next-line @atlaskit/design-system/use-tokens-space
					marginTop: '1.455em',
				},
			},
			// Set marginTop: 0 if alignment block is next to a gap cursor or widget that is first child
			'.ProseMirror-gapcursor:first-child + .fabric-editor-block-mark.fabric-editor-alignment, .ProseMirror-widget:first-child + .fabric-editor-block-mark.fabric-editor-alignment, .ProseMirror-widget:first-child + .ProseMirror-widget:nth-child(2) + .fabric-editor-block-mark.fabric-editor-alignment':
				{
					'> :is(h1, h2, h3, h4, h5, h6):first-child': {
						marginTop: '0',
					},
				},
		},
	},
	blocktypeStyles_fg_platform_editor_nested_dnd_styles_changes: {
		'.ak-editor-content-area.appearance-full-page .ProseMirror blockquote': {
			paddingLeft: token('space.250'),
		},
		// Don't want extra padding for inline editor (nested)
		'.ak-editor-content-area .ak-editor-content-area .ProseMirror blockquote': {
			paddingLeft: token('space.200'),
		},
	},
	blocktypeStyles_fg_platform_editor_typography_ugc: {
		'.ProseMirror': {
			'& h1': {
				// eslint-disable-next-line @atlaskit/design-system/use-tokens-typography
				font: 'var(--editor-font-ugc-token-heading-h1)',
				marginBottom: 0,
				// eslint-disable-next-line @atlaskit/design-system/use-tokens-space
				marginTop: '1.45833em',
				'& strong': {
					// eslint-disable-next-line @atlaskit/design-system/use-tokens-typography
					fontWeight: 'var(--editor-font-ugc-token-weight-heading-bold)',
				},
			},
			'& h2': {
				// eslint-disable-next-line @atlaskit/design-system/use-tokens-typography
				font: 'var(--editor-font-ugc-token-heading-h2)',
				marginBottom: 0,
				// eslint-disable-next-line @atlaskit/design-system/use-tokens-space
				marginTop: '1.4em',
				'& strong': {
					// eslint-disable-next-line @atlaskit/design-system/use-tokens-typography
					fontWeight: 'var(--editor-font-ugc-token-weight-heading-bold)',
				},
			},
			'& h3': {
				// eslint-disable-next-line @atlaskit/design-system/use-tokens-typography
				font: 'var(--editor-font-ugc-token-heading-h3)',
				marginBottom: 0,
				// eslint-disable-next-line @atlaskit/design-system/use-tokens-space
				marginTop: '1.31249em',
				'& strong': {
					// eslint-disable-next-line @atlaskit/design-system/use-tokens-typography
					fontWeight: 'var(--editor-font-ugc-token-weight-heading-bold)',
				},
			},
			'& h4': {
				// eslint-disable-next-line @atlaskit/design-system/use-tokens-typography
				font: 'var(--editor-font-ugc-token-heading-h4)',
				// eslint-disable-next-line @atlaskit/design-system/use-tokens-space
				marginTop: '1.25em',
				'& strong': {
					// eslint-disable-next-line @atlaskit/design-system/use-tokens-typography
					fontWeight: 'var(--editor-font-ugc-token-weight-heading-bold)',
				},
			},
			'& h5': {
				// eslint-disable-next-line @atlaskit/design-system/use-tokens-typography
				font: 'var(--editor-font-ugc-token-heading-h5)',
				// eslint-disable-next-line @atlaskit/design-system/use-tokens-space
				marginTop: '1.45833em',
				textTransform: 'none',
				'& strong': {
					// eslint-disable-next-line @atlaskit/design-system/use-tokens-typography
					fontWeight: 'var(--editor-font-ugc-token-weight-heading-bold)',
				},
			},
			'& h6': {
				// eslint-disable-next-line @atlaskit/design-system/use-tokens-typography
				font: 'var(--editor-font-ugc-token-heading-h6)',
				// eslint-disable-next-line @atlaskit/design-system/use-tokens-space
				marginTop: '1.59091em',
				textTransform: 'none',
				'& strong': {
					// eslint-disable-next-line @atlaskit/design-system/use-tokens-typography
					fontWeight: 'var(--editor-font-ugc-token-weight-heading-bold)',
				},
			},
		},
	},
	blocktypeStyles_without_fg_platform_editor_typography_ugc: {
		'.ProseMirror': {
			'& h1': {
				// eslint-disable-next-line @atlaskit/design-system/use-tokens-typography
				fontSize: 'calc(24em / 14)',
				fontStyle: 'inherit',
				// eslint-disable-next-line @atlaskit/design-system/use-tokens-typography
				lineHeight: 'calc(28 / 24)',
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
				fontSize: 'calc(20em / 14)',
				fontStyle: 'inherit',
				// eslint-disable-next-line @atlaskit/design-system/use-tokens-typography
				lineHeight: 'calc(24 / 20)',
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
				fontSize: 'calc(16em / 14)',
				fontStyle: 'inherit',
				// eslint-disable-next-line @atlaskit/design-system/use-tokens-typography
				lineHeight: 'calc(20 / 16)',
				color: token('color.text'),
				fontWeight: token('font.weight.semibold'),
				// eslint-disable-next-line @atlaskit/design-system/use-tokens-typography
				letterSpacing: `-0.006em`,
				// eslint-disable-next-line @atlaskit/design-system/use-tokens-space
				marginTop: '2em',
				marginBottom: 0,
			},
			'& h4': {
				// eslint-disable-next-line @atlaskit/design-system/use-tokens-typography
				fontSize: 'calc(14em / 14)',
				fontStyle: 'inherit',
				// eslint-disable-next-line @atlaskit/design-system/use-tokens-typography
				lineHeight: 'calc(16 / 14)',
				color: token('color.text'),
				fontWeight: token('font.weight.semibold'),
				// eslint-disable-next-line @atlaskit/design-system/use-tokens-typography
				letterSpacing: '-0.003em',
				// eslint-disable-next-line @atlaskit/design-system/use-tokens-space
				marginTop: '1.357em',
			},
			'& h5': {
				// eslint-disable-next-line @atlaskit/design-system/use-tokens-typography
				fontSize: 'calc(12em / 14)',
				fontStyle: 'inherit',
				// eslint-disable-next-line @atlaskit/design-system/use-tokens-typography
				lineHeight: 'calc(16 / 12)',
				color: token('color.text'),
				fontWeight: token('font.weight.semibold'),
				// eslint-disable-next-line @atlaskit/design-system/use-tokens-space
				marginTop: '1.667em',
				textTransform: 'none',
			},
			'& h6': {
				// eslint-disable-next-line @atlaskit/design-system/use-tokens-typography
				fontSize: 'calc(11em / 14)',
				fontStyle: 'inherit',
				// eslint-disable-next-line @atlaskit/design-system/use-tokens-typography
				lineHeight: 'calc(16 / 11)',
				color: token('color.text.subtlest'),
				fontWeight: token('font.weight.bold'),
				// eslint-disable-next-line @atlaskit/design-system/use-tokens-space
				marginTop: '1.455em',
				textTransform: 'none',
			},
		},
	},
	codeBlockStyles: {
		'.ProseMirror': {
			[`.${CodeBlockSharedCssClassName.CODEBLOCK_CONTENT_WRAPPED} > .${CodeBlockSharedCssClassName.CODEBLOCK_CONTENT_WRAPPER} > .${CodeBlockSharedCssClassName.CODEBLOCK_CONTENT}`]:
				{
					marginRight: token('space.100'),

					code: {
						display: 'block',
						wordBreak: 'break-word',
						whiteSpace: 'pre-wrap',
					},
				},

			[`.${CodeBlockSharedCssClassName.CODEBLOCK_CONTENT_WRAPPER} > .${CodeBlockSharedCssClassName.CODEBLOCK_CONTENT}`]:
				{
					display: 'flex',
					flex: 1,

					code: {
						flexGrow: 1,
						whiteSpace: 'pre',
					},
				},

			[`.${CodeBlockSharedCssClassName.CODEBLOCK_CONTAINER}`]: {
				position: 'relative',
				backgroundColor: token('elevation.surface.raised'),
				borderRadius: token('radius.small', '3px'),
				margin: `${blockNodesVerticalMargin} 0 0 0`,
				fontFamily: token('font.family.code'),
				minWidth: 48,
				cursor: 'pointer',
				clear: 'both',
				// This is necessary to allow for arrow key navigation in/out of code blocks in Firefox.
				whiteSpace: 'normal',

				'.code-block-gutter-pseudo-element::before': {
					content: 'attr(data-label)',
				},

				[`.${CodeBlockSharedCssClassName.CODEBLOCK_START}`]: {
					position: 'absolute',
					visibility: 'hidden',
					height: '1.5rem',
					top: 0,
					left: 0,
				},

				[`.${CodeBlockSharedCssClassName.CODEBLOCK_END}`]: {
					position: 'absolute',
					visibility: 'hidden',
					height: '1.5rem',
					bottom: 0,
					right: 0,
				},

				[`.${CodeBlockSharedCssClassName.CODEBLOCK_CONTENT_WRAPPER}`]: {
					...overflowShadowStyles,
					position: 'relative',
					backgroundColor: token('color.background.neutral'),
					display: 'flex',
					borderRadius: token('radius.small', '3px'),
					width: '100%',
					counterReset: 'line',
					overflowX: 'auto',
					backgroundRepeat: 'no-repeat',
					backgroundAttachment: 'local, local, local, local, scroll, scroll, scroll, scroll',
					backgroundSize: `${token('space.300')} 100%,
							${token('space.300')} 100%,
							${token('space.100')} 100%,
							${token('space.100')} 100%,
							${token('space.100')} 100%,
							1px 100%,
							${token('space.100')} 100%,
							1px 100%`,
					backgroundPosition: `0 0,
								0 0,
							100% 0,
							100% 0,
							100% 0,
							100% 0,
								0 0,
								0 0`,
					// Be careful if refactoring this; it is needed to keep arrow key navigation in Firefox consistent with other browsers.
					overflowY: 'hidden',
				},

				[`.${CodeBlockSharedCssClassName.CODEBLOCK_LINE_NUMBER_GUTTER}`]: {
					backgroundColor: token('color.background.neutral'),
					position: 'relative',
					width: 'var(--lineNumberGutterWidth, 2rem)',
					padding: token('space.100'),
					flexShrink: 0,
					// eslint-disable-next-line @atlaskit/design-system/use-tokens-typography
					fontSize: fontSize14px,
					boxSizing: 'content-box',
				},

				// This is a fix of marker of list item with code block.
				// The list item marker in Chrome is aligned by the baseline of the text,
				// that's why we need to add a text (content: "1") to the line number gutter to align
				// the list item marker with the text.
				// Without it, the list item marker will be aligned by the bottom of the code block. */
				[`.${CodeBlockSharedCssClassName.CODEBLOCK_LINE_NUMBER_GUTTER}::before`]: {
					content: "'1'",
					visibility: 'hidden',
					// eslint-disable-next-line @atlaskit/design-system/use-tokens-typography
					fontSize: fontSize14px,
					// eslint-disable-next-line @atlaskit/design-system/use-tokens-typography
					lineHeight: '1.5rem',
				},

				[`.${CodeBlockSharedCssClassName.CODEBLOCK_CONTENT}`]: {
					code: {
						tabSize: 4,
						cursor: 'text',
						color: token('color.text'),
						borderRadius: token('radius.small', '3px'),
						margin: token('space.100'),
						// eslint-disable-next-line @atlaskit/design-system/use-tokens-typography
						fontSize: fontSize14px,
						// eslint-disable-next-line @atlaskit/design-system/use-tokens-typography
						lineHeight: '1.5rem',
					},
				},

				[`.${CodeBlockSharedCssClassName.CODEBLOCK_CONTAINER_LINE_NUMBER_WIDGET}`]: {
					pointerEvents: 'none',
					userSelect: 'none',
					width: 'var(--lineNumberGutterWidth, 2rem)',
					left: 0,
					position: 'absolute',
					// eslint-disable-next-line @atlaskit/design-system/use-tokens-typography
					fontSize: fontSize14px,
					padding: `0px ${token('space.100')}`,
					// eslint-disable-next-line @atlaskit/design-system/use-tokens-typography
					lineHeight: '1.5rem',
					textAlign: 'right',
					color: token('color.text.subtlest'),
					boxSizing: 'content-box',
				},
			},

			li: {
				// if same list item has multiple code blocks we need top margin for all but first
				'> .code-block': {
					margin: `${blockNodesVerticalMargin} 0 0 0`,
				},
				'> .code-block:first-child, > .ProseMirror-gapcursor:first-child + .code-block': {
					marginTop: 0,
				},

				'> div:last-of-type.code-block, > pre:last-of-type.code-block': {
					marginBottom: blockNodesVerticalMargin,
				},
			},

			'.code-block.ak-editor-selected-node:not(.danger)': {
				...boxShadowSelectionStyles,
				...blanketSelectionStyles,
				...hideNativeBrowserTextSelectionStyles,
			},

			// Danger when top level node
			'.danger.code-block': {
				boxShadow: `0 0 0 1px ${token('color.border.danger')}`,

				[`.${CodeBlockSharedCssClassName.CODEBLOCK_LINE_NUMBER_GUTTER}`]: {
					backgroundColor: token('color.background.danger'),
					color: token('color.text.danger'),
					...gutterDangerOverlay,
				},

				[`.${CodeBlockSharedCssClassName.CODEBLOCK_CONTENT}`]: {
					backgroundColor: token('color.blanket.danger'),
				},
			},

			// Danger when nested node
			'.danger .code-block': {
				[`.${CodeBlockSharedCssClassName.CODEBLOCK_LINE_NUMBER_GUTTER}`]: {
					backgroundColor: token('color.background.danger'),
					color: token('color.text.danger'),
					...gutterDangerOverlay,
				},

				[`.${CodeBlockSharedCssClassName.CODEBLOCK_CONTENT}`]: {
					backgroundColor: token('color.blanket.danger'),
				},
			},
		},
	},
	codeBlockStylesWithEmUnits: {
		'.ProseMirror': {
			[`.${CodeBlockSharedCssClassName.CODEBLOCK_CONTAINER}`]: {
				'.code-block-gutter-pseudo-element::before': {
					display: 'flow',
					// eslint-disable-next-line @atlaskit/design-system/use-tokens-typography
					lineHeight: '1.5em',
				},

				[`.${CodeBlockSharedCssClassName.CODEBLOCK_CONTENT}`]: {
					code: {
						// eslint-disable-next-line @atlaskit/design-system/use-tokens-typography
						fontSize: '0.875em',
						// eslint-disable-next-line @atlaskit/design-system/use-tokens-typography
						lineHeight: '1.5em',
					},
				},
			},
		},
	},
	codeMarkStyles: {
		'.code': {
			'--ds--code--bg-color': token('color.background.neutral'),
			// eslint-disable-next-line @atlaskit/ui-styling-standard/no-unsafe-values, @atlaskit/ui-styling-standard/no-imported-style-values -- Ignored via go/DSP-18766
			display: 'inline',
			padding: '2px 0.5ch',
			backgroundColor: `var(--ds--code--bg-color,${token('color.background.neutral')})`,
			borderRadius: token('radius.small', '3px'),
			borderStyle: 'none',
			boxDecorationBreak: 'clone',
			color: token('color.text'),
			fontFamily: token('font.family.code'),
			// eslint-disable-next-line @atlaskit/design-system/use-tokens-typography
			fontSize: '0.875em',
			fontWeight: token('font.weight.regular'),
			overflow: 'auto',
			overflowWrap: 'break-word',
			whiteSpace: 'pre-wrap',
		},
	},
	codeMarkStylesA11yFix: {
		'.code': {
			overflow: 'unset',
		},
	},
	commentEditorStyles: {
		flexGrow: 1,
		overflowX: 'clip',
		// eslint-disable-next-line @atlaskit/design-system/use-tokens-typography
		lineHeight: '24px',
		// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors -- Ignored via go/DSP-18766
		'.ProseMirror': {
			marginTop: token('space.150'),
			marginRight: token('space.150'),
			marginBottom: token('space.150'),
			marginLeft: token('space.150'),
		},
		// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors -- Ignored via go/DSP-18766
		'.gridParent': {
			marginLeft: token('space.025'),
			marginRight: token('space.025'),
			// eslint-disable-next-line @atlaskit/ui-styling-standard/no-imported-style-values, @atlaskit/ui-styling-standard/no-unsafe-values -- Ignored via go/DSP-18766
			width: `calc(100% + ${CommentEditorMargin - GRID_GUTTER}px)`,
		},
		paddingTop: token('space.250'),
		paddingRight: token('space.250'),
		paddingBottom: token('space.250'),
		paddingLeft: token('space.250'),
	},
	cursorStyles: {
		// eslint-disable-next-line @atlaskit/ui-styling-standard/no-unsafe-selectors
		'.ProseMirror.ProseMirror-focused:has(.ProseMirror-mark-boundary-cursor)': {
			caretColor: 'transparent',
		},
		// eslint-disable-next-line @atlaskit/ui-styling-standard/no-unsafe-selectors
		'.ProseMirror:not(.ProseMirror-focused) .ProseMirror-mark-boundary-cursor': {
			display: 'none',
		},
		// eslint-disable-next-line @atlaskit/ui-styling-standard/no-unsafe-selectors
		'.ProseMirror:has(.ProseMirror-hide-cursor)': {
			caretColor: 'transparent',
		},
	},
	dangerDateStyles: {
		// eslint-disable-next-line @atlaskit/ui-styling-standard/no-unsafe-values
		'.dateView-content-wrap.ak-editor-selected-node.danger .date-lozenger-container > span': {
			...dangerBorderStyles,
		},
	},
	dangerRuleStyles: {
		// eslint-disable-next-line @atlaskit/ui-styling-standard/no-unsafe-values
		'.ProseMirror hr.ak-editor-selected-node.danger': {
			backgroundColor: token('color.border.danger'),
		},
	},
	dateStyles: {
		// eslint-disable-next-line @atlaskit/ui-styling-standard/no-unsafe-values
		'.date-lozenger-container span': {
			whiteSpace: 'unset',
		},

		// eslint-disable-next-line @atlaskit/ui-styling-standard/no-unsafe-values
		'.dateView-content-wrap': {
			// eslint-disable-next-line @atlaskit/ui-styling-standard/no-unsafe-values
			'.date-lozenger-container': {
				// eslint-disable-next-line @atlaskit/design-system/use-tokens-typography
				lineHeight: 'initial',
				cursor: 'pointer',
			},

			'&.ak-editor-selected-node': {
				'.date-lozenger-container > span': {
					...boxShadowSelectionStyles,
					...hideNativeBrowserTextSelectionStyles,
				},
			},
		},

		'.danger': {
			'.dateView-content-wrap.ak-editor-selected-node .date-lozenger-container > span': {
				boxShadow: `0 0 0 1px ${token('color.border.danger')}`,
			},
		},
	},
	dateVanillaStyles: {
		// eslint-disable-next-line @atlaskit/ui-styling-standard/no-unsafe-values
		"[data-prosemirror-node-name='date'] .date-lozenger-container span": {
			backgroundColor: token('color.background.neutral'),
			color: token('color.text'),
			borderRadius: token('radius.small'),
			paddingTop: token('space.025'),
			paddingRight: token('space.050'),
			paddingBottom: token('space.025'),
			paddingLeft: token('space.050'),
			margin: '0 1px',
			position: 'relative',
			transitionProperty: 'background',
			transitionDuration: '0.3s',
			whiteSpace: 'nowrap',
			cursor: 'unset',
		},
		// eslint-disable-next-line @atlaskit/ui-styling-standard/no-unsafe-values
		"[data-prosemirror-node-name='date'] .date-lozenger-container span:hover": {
			backgroundColor: token('color.background.neutral.hovered'),
		},
		// eslint-disable-next-line @atlaskit/ui-styling-standard/no-unsafe-values
		"[data-prosemirror-node-name='date'] .date-lozenger-container span.date-node-color-red": {
			backgroundColor: token('color.background.accent.red.subtlest'),
			color: token('color.text.accent.red'),
		},
		// eslint-disable-next-line @atlaskit/ui-styling-standard/no-unsafe-values
		"[data-prosemirror-node-name='date'] .date-lozenger-container span.date-node-color-red:hover": {
			backgroundColor: token('color.background.accent.red.subtler'),
		},
	},
	decisionDangerStyles: {
		".ak-editor-selected-node.danger > [data-decision-wrapper], ol[data-node-type='decisionList'].ak-editor-selected-node.danger":
			{
				...dangerBackgroundStyles,
				...dangerBorderStyles,
			},
	},
	decisionIconWithVisualRefresh: {
		'[data-prosemirror-node-name="decisionItem"] > [data-decision-wrapper] > [data-component="icon"] > span >  svg[data-icon-source="legacy"]':
			{
				display: 'none',
			},
		'[data-prosemirror-node-name="decisionItem"] > [data-decision-wrapper] > [data-component="icon"] > span':
			{
				boxSizing: 'border-box',
				paddingInlineEnd: 'var(--ds--button--new-icon-padding-end, 0)',
				paddingInlineStart: 'var(--ds--button--new-icon-padding-start, 0)',
				'@media screen and (forced-colors: active)': {
					color: 'canvastext',
					filter: 'grayscale(1)',
				},
			},
		'[data-prosemirror-node-name="decisionItem"] > [data-decision-wrapper] > [data-component="icon"] > span > svg':
			{
				// eslint-disable-next-line @atlaskit/ui-styling-standard/no-unsafe-values
				width: token('space.300'),
				// eslint-disable-next-line @atlaskit/ui-styling-standard/no-unsafe-values
				height: token('space.300'),
			},
	},
	decisionStyles: {
		".ak-editor-selected-node > [data-decision-wrapper], ol[data-node-type='decisionList'].ak-editor-selected-node":
			{
				borderRadius: token('radius.small'),
				...boxShadowSelectionStyles,
				...blanketSelectionStyles,
				...hideNativeBrowserTextSelectionStyles,
			},
		'.danger': {
			'.decisionItemView-content-wrap.ak-editor-selected-node > div': {
				// eslint-disable-next-line @atlaskit/ui-styling-standard/no-unsafe-values
				boxShadow: `0 0 0 1px ${token('color.border.danger')}`,
				backgroundColor: token('color.blanket.danger'),
				'&::after': {
					content: 'none', // reset the Blanket selection style
				},
			},
		},
		'[data-prosemirror-node-name="decisionItem"]': {
			listStyleType: 'none',
		},
		'[data-prosemirror-node-name="decisionItem"] > [data-decision-wrapper]': {
			cursor: 'pointer',
			display: 'flex',
			flexDirection: 'row',
			margin: `${token('space.100')} 0 0 0`,
			padding: token('space.100'),
			paddingLeft: token('space.150'),
			borderRadius: token('radius.small'),
			backgroundColor: token('color.background.neutral'),
			position: 'relative',
		},
		'[data-prosemirror-node-name="decisionItem"] > [data-decision-wrapper] > [data-component="icon"]':
			{
				flex: '0 0 16px',
				height: '16px',
				width: '16px',
				margin: `${token('space.050')} ${token('space.150')} 0 0`,
				color: token('color.icon.subtle'),
				display: 'flex',
				alignItems: 'center',
				justifyContent: 'center',
			},
		'[data-prosemirror-node-name="decisionItem"]:not(:has([data-empty]):not(:has([data-type-ahead]))) > [data-decision-wrapper] > [data-component="icon"]':
			{
				color: token('color.icon.success'),
			},
		'[data-prosemirror-node-name="decisionItem"] > [data-decision-wrapper] > [data-component="icon"] > span':
			{
				display: 'inline-block',
				flexShrink: 0,
				// eslint-disable-next-line @atlaskit/design-system/use-tokens-typography -- Mirroring icon styles
				lineHeight: 1,
			},
		'[data-prosemirror-node-name="decisionItem"] > [data-decision-wrapper] > [data-component="icon"] > span > svg':
			{
				overflow: 'hidden',
				pointerEvents: 'none',
				color: 'currentColor',
				verticalAlign: 'bottom',
			},
		'[data-prosemirror-node-name="decisionItem"] > [data-decision-wrapper] > [data-component="placeholder"]':
			{
				margin: `0 0 0 calc(${token('space.100')} * 3.5)`,
				position: 'absolute',
				color: token('color.text.subtlest'),
				pointerEvents: 'none',
				textOverflow: 'ellipsis',
				overflow: 'hidden',
				whiteSpace: 'nowrap',
				maxWidth: 'calc(100% - 50px)',
			},
		'[data-prosemirror-node-name="decisionItem"]:not(:has([data-empty]):not(:has([data-type-ahead]))) > [data-decision-wrapper] > [data-component="placeholder"]':
			{
				display: 'none',
			},
		'[data-prosemirror-node-name="decisionItem"] > [data-decision-wrapper] > [data-component="content"]':
			{
				margin: 0,
				wordWrap: 'break-word',
				minWidth: 0,
				flex: '1 1 auto',
			},
	},
	diffListStyles: {
		// eslint-disable-next-line @atlaskit/ui-styling-standard/no-unsafe-values
		'li[data-testid="show-diff-changed-decoration-node"]::marker': {
			// eslint-disable-next-line @atlaskit/ui-styling-standard/no-unsafe-values
			color: 'var(--diff-decoration-marker-color)',
		},
	},
	// Move this into `smartCardStyles` below when cleaning up editor_controls_patch_15
	editorControlsSmartCardStyles: {
		// Constant variables here has been inlined in css from EditorContentContainer, if you need to make
		// update here, please also update packages/editor/editor-core/src/ui/EditorContentContainer/styles/smartCardStyles.ts
		// SmartCardSharedCssClassName.INLINE_CARD_CONTAINER = 'inlineCardView-content-wrap'
		'.inlineCardView-content-wrap': {
			'[data-inlinecard-button-overlay="icon-wrapper-line-height"] span': {
				// eslint-disable-next-line @atlaskit/design-system/use-tokens-typography
				lineHeight: 0,
			},
		},
	},
	editorLargeGutterPuddingBaseStyles: {
		'--ak-editor--large-gutter-padding': '52px',
	},
	editorLargeGutterPuddingBaseStylesEditorControls: {
		'--ak-editor--large-gutter-padding': '72px',
	},
	editorLargeGutterPuddingReducedBaseStyles: {
		// eslint-disable-next-line @atlaskit/ui-styling-standard/no-unsafe-values
		[editorAreaNarrowPageContainerQuery]: {
			'--ak-editor--large-gutter-padding': `${akEditorGutterPaddingReduced}px`,
		},
	},
	/**
	 * Use when fg('platform_editor_typography_ugc') is disabled.
	 */
	editorUGCTokensDefault: {
		'--editor-font-ugc-token-heading-h1':
			'normal 500 1.71429em/1.16667 ui-sans-serif, -apple-system, BlinkMacSystemFont, "Segoe UI", Ubuntu, "Helvetica Neue", sans-serif',
		'--editor-font-ugc-token-heading-h2':
			'normal 500 1.42857em/1.2 ui-sans-serif, -apple-system, BlinkMacSystemFont, "Segoe UI", Ubuntu, "Helvetica Neue", sans-serif',
		'--editor-font-ugc-token-heading-h3':
			'normal 600 1.14286em/1.25 ui-sans-serif, -apple-system, BlinkMacSystemFont, "Segoe UI", Ubuntu, "Helvetica Neue", sans-serif',
		'--editor-font-ugc-token-heading-h4':
			'normal 600 1em/1.14286 ui-sans-serif, -apple-system, BlinkMacSystemFont, "Segoe UI", Ubuntu, "Helvetica Neue", sans-serif',
		'--editor-font-ugc-token-heading-h5':
			'normal 600 0.857143em/1.33333 ui-sans-serif, -apple-system, BlinkMacSystemFont, "Segoe UI", Ubuntu, "Helvetica Neue", sans-serif',
		'--editor-font-ugc-token-heading-h6':
			'normal 700 0.785714em/1.45455 ui-sans-serif, -apple-system, BlinkMacSystemFont, "Segoe UI", Ubuntu, "Helvetica Neue", sans-serif',
		'--editor-font-ugc-token-body':
			'normal 400 1em/1.714 ui-sans-serif, -apple-system, BlinkMacSystemFont, "Segoe UI", Ubuntu, "Helvetica Neue", sans-serif',
		'--editor-font-ugc-token-weight-heading-bold': '700',
	},
	/**
	 * Use when fg('platform_editor_typography_ugc') is enabled and the following is enabled:
	 * - fg('atlas_editor_typography_refreshed')
	 */
	editorUGCTokensRefreshed: {
		'--editor-font-ugc-token-heading-h1':
			'normal 600 1.71429em/1.16667 "Atlassian Sans", ui-sans-serif, -apple-system, BlinkMacSystemFont, "Segoe UI", Ubuntu, "Helvetica Neue", sans-serif',
		'--editor-font-ugc-token-heading-h2':
			'normal 600 1.42857em/1.2 "Atlassian Sans", ui-sans-serif, -apple-system, BlinkMacSystemFont, "Segoe UI", Ubuntu, "Helvetica Neue", sans-serif',
		'--editor-font-ugc-token-heading-h3':
			'normal 600 1.14286em/1.25 "Atlassian Sans", ui-sans-serif, -apple-system, BlinkMacSystemFont, "Segoe UI", Ubuntu, "Helvetica Neue", sans-serif',
		'--editor-font-ugc-token-heading-h4':
			'normal 600 1em/1.14286 "Atlassian Sans", ui-sans-serif, -apple-system, BlinkMacSystemFont, "Segoe UI", Ubuntu, "Helvetica Neue", sans-serif',
		'--editor-font-ugc-token-heading-h5':
			'normal 600 0.857143em/1.33333 "Atlassian Sans", ui-sans-serif, -apple-system, BlinkMacSystemFont, "Segoe UI", Ubuntu, "Helvetica Neue", sans-serif',
		'--editor-font-ugc-token-heading-h6':
			'normal 600 0.785714em/1.45455 "Atlassian Sans", ui-sans-serif, -apple-system, BlinkMacSystemFont, "Segoe UI", Ubuntu, "Helvetica Neue", sans-serif',
		'--editor-font-ugc-token-body':
			'normal 400 1em/1.714 "Atlassian Sans", ui-sans-serif, -apple-system, BlinkMacSystemFont, "Segoe UI", Ubuntu, "Helvetica Neue", sans-serif',
		'--editor-font-ugc-token-weight-heading-bold': '700',
	},
	editorUGCSmallText: {
		'--editor-font-ugc-token-body-small':
			'normal 400 0.875em/1.714 "Atlassian Sans", ui-sans-serif, -apple-system, BlinkMacSystemFont, "Segoe UI", Ubuntu, "Helvetica Neue", sans-serif',
	},
	embedCardStyles: {
		'.ProseMirror': {
			".embedCardView-content-wrap[layout^='wrap-']": {
				maxWidth: '100%',
				position: 'relative',
				// eslint-disable-next-line @atlaskit/ui-styling-standard/no-unsafe-values, @atlaskit/ui-styling-standard/no-imported-style-values
				zIndex: 2,
			},

			".embedCardView-content-wrap[layout='wrap-left']": {
				float: 'left',
			},

			".embedCardView-content-wrap[layout='wrap-right']": {
				float: 'right',
			},

			".embedCardView-content-wrap[layout='wrap-right'] + .embedCardView-content-wrap[layout='wrap-left']":
				{
					clear: 'both',
				},
		},
	},
	// Emoji node view styles
	emojiDangerStyles: {
		// eslint-disable-next-line @atlaskit/ui-styling-standard/no-unsafe-values, @atlaskit/ui-styling-standard/no-imported-style-values
		'.ProseMirror .ak-editor-selected-node.danger': {
			// eslint-disable-next-line @atlaskit/ui-styling-standard/no-unsafe-values, @atlaskit/ui-styling-standard/no-imported-style-values
			'.emoji-common-emoji-sprite, .emoji-common-emoji-image': {
				// eslint-disable-next-line @atlaskit/ui-styling-standard/no-imported-style-values, @atlaskit/design-system/no-invalid-css-map, @atlaskit/ui-styling-standard/no-unsafe-values
				...dangerBorderStyles,
				// eslint-disable-next-line @atlaskit/ui-styling-standard/no-imported-style-values, @atlaskit/design-system/no-invalid-css-map, @atlaskit/ui-styling-standard/no-unsafe-values
				...dangerBackgroundStyles,
			},
		},
	},
	// Emoji node view styles
	emojiStyles: {
		// eslint-disable-next-line @atlaskit/ui-styling-standard/no-unsafe-values, @atlaskit/ui-styling-standard/no-imported-style-values
		'.ProseMirror .emojiView-content-wrap': {
			display: 'inline-block',
		},
		// eslint-disable-next-line @atlaskit/ui-styling-standard/no-unsafe-values, @atlaskit/ui-styling-standard/no-imported-style-values
		'.ProseMirror :is(.emoji-common-emoji-sprite, .emoji-common-emoji-image)': {
			background: 'no-repeat transparent',
			display: 'inline-block',
			// eslint-disable-next-line @atlaskit/ui-styling-standard/no-imported-style-values, @atlaskit/ui-styling-standard/no-unsafe-values
			height: `${defaultEmojiHeight}px`,
			// eslint-disable-next-line @atlaskit/ui-styling-standard/no-imported-style-values, @atlaskit/ui-styling-standard/no-unsafe-values
			maxHeight: `${defaultEmojiHeight}px`,
			cursor: 'pointer',
			verticalAlign: 'middle',
			userSelect: 'all',
		},
		// eslint-disable-next-line @atlaskit/ui-styling-standard/no-unsafe-values, @atlaskit/ui-styling-standard/no-imported-style-values
		'.ProseMirror .ak-editor-selected-node': {
			// eslint-disable-next-line @atlaskit/ui-styling-standard/no-unsafe-values, @atlaskit/ui-styling-standard/no-imported-style-values
			'.emoji-common-emoji-sprite, .emoji-common-emoji-image': {
				// eslint-disable-next-line @atlaskit/ui-styling-standard/no-unsafe-values, @atlaskit/design-system/no-invalid-css-map
				...emojiSelectionStyles,
				// eslint-disable-next-line @atlaskit/ui-styling-standard/no-imported-style-values, @atlaskit/design-system/no-invalid-css-map, @atlaskit/ui-styling-standard/no-unsafe-values
				...blanketSelectionStyles,
				// eslint-disable-next-line @atlaskit/ui-styling-standard/no-imported-style-values, @atlaskit/design-system/no-invalid-css-map, @atlaskit/ui-styling-standard/no-unsafe-values
				...boxShadowSelectionStyles,
				// eslint-disable-next-line @atlaskit/ui-styling-standard/no-imported-style-values, @atlaskit/design-system/no-invalid-css-map, @atlaskit/ui-styling-standard/no-unsafe-values
				...hideNativeBrowserTextSelectionStyles,
			},
		},
	},
	emojiDenseStyles: {
		'.ProseMirror :is(.emoji-common-emoji-sprite, .emoji-common-emoji-image)': {
			width: `${defaultDenseEmojiHeight}px`,
			height: `${defaultDenseEmojiHeight}px`,
			maxHeight: `${defaultDenseEmojiHeight}px`,
			img: {
				width: '100%',
				height: '100%',
				objectFit: 'contain',
			},
		},
		// Scale panel icon in dense mode
		'.ProseMirror .ak-editor-panel .ak-editor-panel__icon': {
			// eslint-disable-next-line @atlaskit/ui-styling-standard/no-unsafe-values
			height: token('space.250'),
			// eslint-disable-next-line @atlaskit/ui-styling-standard/no-unsafe-values
			width: token('space.250'),
		},
	},
	expandStyles: {
		'.ProseMirror > .ak-editor-expand__type-expand, .fabric-editor-breakout-mark-dom > .ak-editor-expand__type-expand':
			{
				marginLeft: token('space.negative.150'),
				marginRight: token('space.negative.150'),
			},
	},
	/**
	 * Base expand styles, always applied.
	 */
	expandStylesBase: {
		'.ak-editor-expand__icon > div': {
			display: 'flex',
		},
		'.ak-editor-expand': {
			// sharedExpandStyles.containerStyles({ expanded: false, focused: false })(),
			borderWidth: token('border.width'),
			borderStyle: 'solid',
			borderColor: 'transparent',
			borderRadius: token('radius.small', '4px'),
			minHeight: '25px',
			background: token('color.background.neutral.subtle'),
			margin: `${token('space.050')} 0 0`,
			transitionProperty: 'background, border-color',
			transitionDuration: '0.3s, 0.3s',
			transitionTimingFunction: 'cubic-bezier(0.15, 1, 0.3, 1), cubic-bezier(0.15, 1, 0.3, 1)',
			padding: token('space.100'),
			'td > :not(style):first-child, td > style:first-child + *': {
				marginTop: 0,
			},

			cursor: 'pointer',
			boxSizing: 'border-box',

			'td > &': {
				marginTop: 0,
			},

			'.ak-editor-expand__icon-container svg': {
				color: token('color.icon.subtle'),
				transform: 'rotate(90deg)',
			},

			'&.ak-editor-selected-node:not(.danger)': {
				// SelectionStyle.Blanket
				position: 'relative',
				// Fixes ED-9263, where emoji or inline card in panel makes selection go outside the panel
				// in Safari. Looks like it's caused by user-select: all in the emoji element
				WebkitUserSelect: 'text',
				'&::before': {
					position: 'absolute',
					content: "''",
					left: 0,
					right: 0,
					top: 0,
					bottom: 0,
					width: '100%',
					pointerEvents: 'none',
					zIndex: 12, // akEditorStickyheaderZIndex (11) + 1
					backgroundColor: token('color.blanket.selected'),
				},

				// SelectionStyle.Border (common case)
				border: `${token('border.width')} solid ${token('color.border.selected')}`,
				// If fg('platform_editor_nested_dnd_styles_changes') is true,
				// then we'll also need the rest of the selection styles for blanket

				// hideNativeBrowserTextSelectionStyles
				'&::selection, *::selection': {
					backgroundColor: 'transparent',
				},
				'&::-moz-selection, *::-moz-selection': {
					backgroundColor: 'transparent',
				},
			},

			'&.danger': {
				background: token('color.background.danger'),
				borderColor: token('color.border.danger'),
			},
		},

		'.ak-editor-expand__content': {
			// sharedExpandStyles.contentStyles({ expanded: false, focused: false })(),
			paddingTop: token('space.0', '0px'),
			paddingRight: token('space.100', '8px'),
			paddingLeft: token('space.300', '24px'),
			marginLeft: token('space.050', '4px'),
			display: 'flow-root',
			/* The follow rules inside @supports block are added as a part of ED-8893
			The fix is targeting mobile bridge on iOS 12 or below,
			We should consider remove this fix when we no longer support iOS 12 */
			'@supports not (display: flow-root)': {
				width: '100%',
				boxSizing: 'border-box',
			},
			'.expand-content-wrapper, .nestedExpand-content-wrapper': {
				/* We visually hide the content here to preserve the content during copy+paste */
				/* Do not add text nowrap here because inline comment navigation depends on the location of the text */
				width: '100%',
				display: 'block',
				height: 0,
				overflow: 'hidden',
				clip: 'rect(1px, 1px, 1px, 1px)',
				userSelect: 'none',
			},

			cursor: 'text',

			'&.ak-editor-expand__content--collapsed': {
				display: 'none',
			},
		},

		'.ak-editor-expand__title-input': {
			// sharedExpandStyles.titleInputStyles(),
			outline: 'none',
			border: 'none',
			// eslint-disable-next-line @atlaskit/design-system/use-tokens-typography
			fontSize: 'calc(14rem / 16)', // relativeFontSizeToBase16(14),
			// eslint-disable-next-line @atlaskit/design-system/use-tokens-typography
			lineHeight: 1.714,
			fontWeight: token('font.weight.regular'),
			color: token('color.text.subtlest'),
			background: 'transparent',
			display: 'flex',
			flex: 1,
			padding: `0 0 0 ${token('space.050', '4px')}`,
			width: '100%',
			'&::placeholder': {
				opacity: 1,
				color: token('color.text.subtlest'),
			},
		},

		'.ak-editor-expand__title-container': {
			// sharedExpandStyles.titleContainerStyles(),
			padding: 0,
			display: 'flex',
			// Omitting alignItems: 'flex-start' as it would be overridden
			background: 'none',
			border: 'none',
			// eslint-disable-next-line @atlaskit/design-system/use-tokens-typography
			fontSize: 'calc(14rem / 16)', // relativeFontSizeToBase16(14),
			width: '100%',
			color: token('color.text.subtle'),
			// Omitting overflow: 'hidden' as it would be overridden
			cursor: 'pointer',
			'&:focus': {
				outline: 0,
			},

			alignItems: 'center',
			overflow: 'visible',
		},

		'.ak-editor-expand__icon-button': {
			appearance: 'none',
			width: token('space.300', '24px'),
			height: token('space.300', '24px'),
			border: 'none',
			borderRadius: token('radius.small', '4px'),
			background: token('color.background.neutral.subtle'),
			padding: 0,
			margin: 0,
			display: 'flex',
			alignItems: 'center',
			justifyContent: 'center',
			cursor: 'pointer',

			'&:disabled': {
				cursor: 'not-allowed',
			},

			'&:focus-visible': {
				outline: `${token('border.width.focused')} solid ${token('color.border.focused')}`,
				outlineOffset: token('space.025', '2px'),
			},

			'&:hover:not(:disabled)': {
				background: token('color.background.neutral.subtle.hovered'),
			},

			'.ak-editor-expand__icon-svg': {
				color: token('color.icon.subtle'),
				transform: 'rotate(0deg)',
				// eslint-disable-next-line @atlaskit/ui-styling-standard/no-imported-style-values, @atlaskit/ui-styling-standard/no-unsafe-values
				transition: `transform 0.2s ${akEditorSwoopCubicBezier};`,
			},
		},

		'.ak-editor-expand__expanded': {
			background: token('color.background.neutral.subtle'),
			borderColor: token('color.border'),

			'.ak-editor-expand__content': {
				paddingTop: token('space.100', '8px'),
				// If fg('platform_editor_nested_dnd_styles_changes') then this needs to be extended
			},

			'.ak-editor-expand__icon-button': {
				'.ak-editor-expand__icon-svg': {
					transform: 'rotate(90deg)',
				},
			},
		},

		'.ak-editor-expand__input-container': {
			width: '100%',
		},

		'.ak-editor-expand:not(.ak-editor-expand__expanded)': {
			'.ak-editor-expand__content': {
				position: 'absolute',
				height: '1px',
				width: '1px',
				overflow: 'hidden',
				clip: 'rect(1px, 1px, 1px, 1px)',
				whiteSpace: 'nowrap',
			},

			'.ak-editor-expand__icon-container svg': {
				color: token('color.icon.subtle'),
				transform: 'rotate(0deg)',
			},

			'&:not(.ak-editor-selected-node):not(.danger)': {
				background: 'transparent',
				borderColor: 'transparent',

				'&:hover': {
					borderColor: token('color.border'),
					background: token('color.background.neutral.subtle'),
				},
			},
		},
	},
	expandStylesMixin_experiment_platform_editor_chromeless_expand_fix: {
		'.ProseMirror > .ak-editor-expand': {
			marginLeft: 0,
			marginRight: 0,
		},
	},
	expandStylesMixin_fg_platform_editor_nested_dnd_styles_changes: {
		'.ak-editor-content-area.appearance-full-page .ProseMirror > .ak-editor-expand__type-expand, .fabric-editor-breakout-mark-dom > .ak-editor-expand__type-expand':
			{
				marginLeft: token('space.negative.250'),
				marginRight: token('space.negative.250'),
			},

		'.ak-editor-expand__expanded': {
			'.ak-editor-expand__content': {
				// firstNodeWithNotMarginTop
				'> :nth-child(1 of :not(style, .ProseMirror-gapcursor, .ProseMirror-widget, span))': {
					marginTop: 0,
				},
				'> div.ak-editor-expand[data-node-type="nestedExpand"]': {
					marginTop: token('space.050'),
				},
			},
		},
	},
	expandStylesMixin_fg_platform_visual_refresh_icons: {
		'.ak-editor-expand__title-input': {
			// eslint-disable-next-line @atlaskit/design-system/use-tokens-typography
			lineHeight: 1,
			fontFamily: token('font.family.body'),
		},
	},
	expandStylesMixin_without_fg_platform_editor_nested_dnd_styles_changes: {
		'.ak-editor-expand': {
			'&.ak-editor-selected-node:not(.danger)': {
				// SelectionStyle.Border (with fg('platform_editor_nested_dnd_styles_changes'))
				// Fixes ED-15246: Trello card is visible through a border of a table border
				'&::after': {
					height: '100%',
					content: "'\\00a0'",
					background: token('color.border.selected'),
					position: 'absolute',
					right: '-1px',
					top: 0,
					bottom: 0,
					width: '1px',
					border: 'none',
					display: 'inline-block',
				},
			},
		},
	},
	expandDenseStyles: {
		// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors
		'.ak-editor-expand__title-input': {
			// eslint-disable-next-line @atlaskit/design-system/use-tokens-typography, @atlaskit/ui-styling-standard/no-unsafe-values
			fontSize: 'var(--ak-editor-base-font-size)',
		},
		// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors
		'.ak-editor-expand__title-container': {
			// eslint-disable-next-line @atlaskit/design-system/use-tokens-typography, @atlaskit/ui-styling-standard/no-unsafe-values
			fontSize: 'var(--ak-editor-base-font-size)',
		},
	},
	extensionStyles: {
		'.multiBodiedExtensionView-content-wrap': {
			'&.danger > span > .multiBodiedExtension--container': {
				boxShadow: `0 0 0 1px ${token('color.border.danger')}`,
				backgroundColor: token('color.background.danger'),
			},

			// ...extensionLabelStyles
			'&.danger > span > div > .extension-label': {
				backgroundColor: token('color.background.accent.red.subtler'),
				color: token('color.text.danger'),
				opacity: 1,
				boxShadow: 'none',
			},
			'&:not(.danger).ak-editor-selected-node > span > div > .extension-label': {
				backgroundColor: token('color.background.selected'),
				color: token('color.text.selected'),
				opacity: 1,
				boxShadow: 'none',
			},
			/* Targets the icon for bodied macro styling in button label */
			'&.danger > span > div > .extension-label > span': {
				display: 'inline',
			},
			'&:not(.danger).ak-editor-selected-node > span > div .extension-label > span': {
				display: 'inline',
			},
			/* Start of bodied extension edit toggle styles */
			'&.danger.ak-editor-selected-node > span > .extension-edit-toggle-container': {
				opacity: 1,
			},
			'&:not(.danger).ak-editor-selected-node > span > .extension-edit-toggle-container': {
				opacity: 1,
			},
			/* In view mode of the bodied macro, we never want to show the extension label */
			'&.danger.ak-editor-selected-node > span > div > .extension-label.always-hide-label': {
				opacity: 0,
			},
			'&:not(.danger).ak-editor-selected-node > span > div > .extension-label.always-hide-label': {
				opacity: 0,
			},
			/* .with-bodied-macro-live-page-styles class will only be added to bodied macros with the renderer mode gate enabled */
			'&:not(.danger).ak-editor-selected-node > span > div > .extension-label.with-bodied-macro-live-page-styles':
				{
					boxShadow: `0 0 0 1px ${token('color.border.selected')}`,
				},
			'&.danger.ak-editor-selected-node > span > div > .extension-label.with-bodied-macro-live-page-styles':
				{
					boxShadow: `0 0 0 1px ${token('color.border.danger')}`,
				},
			'&.danger.ak-editor-selected-node > span > .extension-edit-toggle-container > .extension-edit-toggle':
				{
					backgroundColor: token('color.background.accent.red.subtler'),
					color: token('color.text.danger'),
					boxShadow: 'none',
				},

			'&.danger > span > .with-danger-overlay': {
				backgroundColor: 'transparent',
				'.multiBodiedExtension--overlay': {
					// ...dangerOverlayStyles
					opacity: 0.3,
					backgroundColor: token('color.background.danger.hovered'),
				},
			},

			'&:not(.danger).ak-editor-selected-node': {
				'& > span > .multiBodiedExtension--container': {
					// eslint-disable-next-line @atlaskit/ui-styling-standard/no-unsafe-values, @atlaskit/design-system/no-invalid-css-map
					...boxShadowSelectionStyles,
					// eslint-disable-next-line @atlaskit/ui-styling-standard/no-unsafe-values, @atlaskit/design-system/no-invalid-css-map
					...blanketSelectionStyles,
					// eslint-disable-next-line @atlaskit/ui-styling-standard/no-unsafe-values, @atlaskit/design-system/no-invalid-css-map
					...hideNativeBrowserTextSelectionStyles,
				},
			},

			'.multiBodiedExtension--container': {
				width: '100%',
				maxWidth: '100%', // ensure width can't go over 100%
			},
		},

		'.inlineExtensionView-content-wrap': {
			'&.danger > span > .extension-container': {
				boxShadow: `0 0 0 1px ${token('color.border.danger')}`,
				backgroundColor: token('color.background.danger'),
			},

			'&.danger > span > .with-danger-overlay': {
				/* If the macro turned used to red before, not setting the background to be transparent will cause the
		danger state to have two layers of red which we don't want. */
				backgroundColor: 'transparent',
				'.extension-overlay': {
					// ...dangerOverlayStyles
					opacity: 0.3,
					backgroundColor: token('color.background.danger.hovered'),
				},
			},

			'&:not(.danger).ak-editor-selected-node': {
				'& > span > .extension-container': {
					// eslint-disable-next-line @atlaskit/ui-styling-standard/no-unsafe-values, @atlaskit/design-system/no-invalid-css-map
					...boxShadowSelectionStyles,
					// eslint-disable-next-line @atlaskit/ui-styling-standard/no-unsafe-values, @atlaskit/design-system/no-invalid-css-map
					...hideNativeBrowserTextSelectionStyles,
				},
			},

			// ...extensionLabelStyles
			'&.danger > span > div > .extension-label': {
				backgroundColor: token('color.background.accent.red.subtler'),
				color: token('color.text.danger'),
				opacity: 1,
				boxShadow: 'none',
			},
			'&:not(.danger).ak-editor-selected-node > span > div > .extension-label': {
				backgroundColor: token('color.background.selected'),
				color: token('color.text.selected'),
				opacity: 1,
				boxShadow: 'none',
			},
			/* Targets the icon for bodied macro styling in button label */
			'&.danger > span > div > .extension-label > span': {
				display: 'inline',
			},
			'&:not(.danger).ak-editor-selected-node > span > div .extension-label > span': {
				display: 'inline',
			},
			/* Start of bodied extension edit toggle styles */
			'&.danger.ak-editor-selected-node > span > .extension-edit-toggle-container': {
				opacity: 1,
			},
			'&:not(.danger).ak-editor-selected-node > span > .extension-edit-toggle-container': {
				opacity: 1,
			},
			/* In view mode of the bodied macro, we never want to show the extension label */
			'&.danger.ak-editor-selected-node > span > div > .extension-label.always-hide-label': {
				opacity: 0,
			},
			'&:not(.danger).ak-editor-selected-node > span > div > .extension-label.always-hide-label': {
				opacity: 0,
			},
			/* .with-bodied-macro-live-page-styles class will only be added to bodied macros with the renderer mode gate enabled */
			'&:not(.danger).ak-editor-selected-node > span > div > .extension-label.with-bodied-macro-live-page-styles':
				{
					boxShadow: `0 0 0 1px ${token('color.border.selected')}`,
				},
			'&.danger.ak-editor-selected-node > span > div > .extension-label.with-bodied-macro-live-page-styles':
				{
					boxShadow: `0 0 0 1px ${token('color.border.danger')}`,
				},
			'&.danger.ak-editor-selected-node > span > .extension-edit-toggle-container > .extension-edit-toggle':
				{
					backgroundColor: token('color.background.accent.red.subtler'),
					color: token('color.text.danger'),
					boxShadow: 'none',
				},
		},

		/* This is referenced in the toDOM of a bodied extension and is used to put
	label content into the bodied extension.
	We do this so that we don't serialise the label (which causes the label to be
	copied to the clipboard causing copy-paste issues). */
		'.bodied-extension-to-dom-label::after': {
			content: 'attr(data-bodied-extension-label)',
		},

		'.extensionView-content-wrap, .multiBodiedExtensionView-content-wrap, .bodiedExtensionView-content-wrap':
			{
				margin: `0.75rem 0`,

				'&:first-of-type': {
					marginTop: 0,
				},

				'&:last-of-type': {
					marginBottom: 0,
				},

				'&:not(.danger).ak-editor-selected-node': {
					'& > span > .extension-container': {
						// eslint-disable-next-line @atlaskit/ui-styling-standard/no-unsafe-values, @atlaskit/design-system/no-invalid-css-map
						...boxShadowSelectionStyles,
						// eslint-disable-next-line @atlaskit/ui-styling-standard/no-unsafe-values, @atlaskit/design-system/no-invalid-css-map
						...hideNativeBrowserTextSelectionStyles,
					},
				},

				'&.danger > span > .extension-container': {
					boxShadow: `0 0 0 1px ${token('color.border.danger')}`,
					backgroundColor: token('color.background.danger'),
				},

				// ...extensionLabelStyles
				'&.danger > span > div > .extension-label': {
					backgroundColor: token('color.background.accent.red.subtler'),
					color: token('color.text.danger'),
					opacity: 1,
					boxShadow: 'none',
				},
				'&:not(.danger).ak-editor-selected-node > span > div > .extension-label': {
					backgroundColor: token('color.background.selected'),
					color: token('color.text.selected'),
					opacity: 1,
					boxShadow: 'none',
				},
				/* Targets the icon for bodied macro styling in button label */
				'&.danger > span > div > .extension-label > span': {
					display: 'inline',
				},
				/** Targets legacy content header in LCM extension */
				'&.danger > span > .legacy-content-header': {
					boxShadow: `0 0 0 1px ${token('color.border.danger')}`,
					backgroundColor: `${token('color.background.danger')}`,

					'& .status-lozenge-span > span': {
						backgroundColor: `${token('color.background.accent.red.subtle.hovered')}`,
					},
				},
				'&:not(.danger).ak-editor-selected-node > span > div .extension-label > span': {
					display: 'inline',
				},
				/* Start of bodied extension edit toggle styles */
				'&.danger.ak-editor-selected-node > span > .extension-edit-toggle-container': {
					opacity: 1,
				},
				'&:not(.danger).ak-editor-selected-node > span > .extension-edit-toggle-container': {
					opacity: 1,
				},
				/* In view mode of the bodied macro, we never want to show the extension label */
				'&.danger.ak-editor-selected-node > span > div > .extension-label.always-hide-label': {
					opacity: 0,
				},
				'&:not(.danger).ak-editor-selected-node > span > div > .extension-label.always-hide-label':
					{
						opacity: 0,
					},
				/* .with-bodied-macro-live-page-styles class will only be added to bodied macros with the renderer mode gate enabled */
				'&:not(.danger).ak-editor-selected-node > span > div > .extension-label.with-bodied-macro-live-page-styles':
					{
						boxShadow: `0 0 0 1px ${token('color.border.selected')}`,
					},
				'&.danger.ak-editor-selected-node > span > div > .extension-label.with-bodied-macro-live-page-styles':
					{
						boxShadow: `0 0 0 1px ${token('color.border.danger')}`,
					},
				'&.danger.ak-editor-selected-node > span > .extension-edit-toggle-container > .extension-edit-toggle':
					{
						backgroundColor: token('color.background.accent.red.subtler'),
						color: token('color.text.danger'),
						boxShadow: 'none',
					},

				'&.danger > span > .with-danger-overlay': {
					backgroundColor: 'transparent',
					'.extension-overlay': {
						// ...dangerOverlayStyles
						opacity: 0.3,
						backgroundColor: token('color.background.danger.hovered'),
					},
				},

				'&.inline': {
					// wordWrap: 'break-all' was previously used here, but break-all is not a valid CSS property of word-wrap.
					// It was probably intended to be word-break: break-all, however I'm omitting it here for consistency with previous actual behavior.
				},
			},

		'.extensionView-content-wrap .extension-container': {
			overflow: 'hidden',

			/* Don't hide overflow for editors inside extensions. */
			'&:has(.extension-editable-area)': {
				overflow: 'visible',
			},
		},

		'.bodiedExtensionView-content-wrap .extensionView-content-wrap .extension-container': {
			width: '100%',
			maxWidth: '100%', // ensure width can't go over 100%
		},

		"[data-mark-type='fragment']": {
			'& > .extensionView-content-wrap, & > .bodiedExtensionView-content-wrap': {
				margin: '0.75rem 0',
			},

			"& > [data-mark-type='dataConsumer']": {
				'& > .extensionView-content-wrap, & > .bodiedExtensionView-content-wrap': {
					margin: '0.75rem 0',
				},
			},

			'&:first-child': {
				'& > .extensionView-content-wrap, & > .bodiedExtensionView-content-wrap': {
					marginTop: 0,
				},
				"& > [data-mark-type='dataConsumer']": {
					'& > .extensionView-content-wrap, & > .bodiedExtensionView-content-wrap': {
						marginTop: 0,
					},
				},
			},

			'&:nth-last-of-type(-n + 2):not(:first-of-type)': {
				'& > .extensionView-content-wrap, & > .bodiedExtensionView-content-wrap': {
					marginBottom: 0,
				},

				"& > [data-mark-type='dataConsumer']": {
					'& > .extensionView-content-wrap, & > .bodiedExtensionView-content-wrap': {
						marginBottom: 0,
					},
				},
			},
		},
	},
	// Dense content mode extensions styling fix - addresses EDITOR-1992
	// When cleaning up the experiment, move this logic into the base styles above
	// Used when (contentMode === 'compact' && expValEquals('confluence_compact_text_format', 'isEnabled', true))
	// OR (expValEquals('cc_editor_ai_content_mode', 'variant', 'test') && fg('platform_editor_content_mode_button_mvp'))
	extensionStylesDense: {
		// Table of Contents Macro
		'.extension-container [data-macro-name="toc"] * :not(.status-lozenge-span *)': {
			// eslint-disable-next-line @atlaskit/design-system/use-tokens-typography
			fontSize: 'var(--ak-editor-base-font-size)',
		},
		// Excerpt Include Macro
		'.extension-container .ak-excerpt-include :not([data-inline-card-lozenge] *, code, .status-lozenge-span *, .code-block *)':
			{
				// eslint-disable-next-line @atlaskit/design-system/use-tokens-typography
				fontSize: 'var(--ak-editor-base-font-size)',
			},
	},
	// Used when contentMode === 'compact' && (expValEquals('confluence_compact_text_format', 'isEnabled', true) || expValEquals('cc_editor_ai_content_mode', 'variant', 'test')))
	extensionStylesLegacyDense: {
		'.extension-container a span': {
			// eslint-disable-next-line @atlaskit/design-system/use-tokens-typography, @atlaskit/ui-styling-standard/no-imported-style-values, @atlaskit/ui-styling-standard/no-unsafe-values
			fontSize: `calc(${akEditorFullPageDenseFontSize}rem / 16)`,
		},
	},
	extensionDiffStyles: {
		'.show-diff-changed-decoration-node > span .extension-container': {
			// eslint-disable-next-line @atlaskit/ui-styling-standard/no-unsafe-values
			boxShadow: `0 0 0 var(--diff-decoration-marker-ring-width, 1px) var(--diff-decoration-marker-color)`,
		},
	},
	// Dense content mode extensions styling fix - addresses EDITOR-1992
	// Used when (expValEquals('platform_editor_bodiedextension_layoutshift_fix', 'isEnabled', true))
	bodiedExtensionLayoutShiftFix: {
		'.bodiedExtensionView-content-wrap': {
			'.bodiedExtension-content-outer-wrapper': {
				margin: '23px -1px -1px -1px', // Reserve space for lozenge (24px) then subtract 1px to account for the border of the inner wrapper preventing layoutshift
			},
			'.bodiedExtension-content-inner-wrapper': {
				margin: `0 ${token('space.negative.250')}`,
				padding: `${token('space.200')} ${token('space.250')}`,
				border: `${token('border.width')} solid ${token('color.border')}`,
				borderRadius: token('radius.small', '3px'),
			},
			'.extension-container': {
				// Remove styling when Prosemirror moves content inside

				'.bodiedExtension-content-outer-wrapper': {
					margin: '0',
				},
				'.bodiedExtension-content-inner-wrapper': {
					margin: 0,
					padding: 0,
					border: 'none',
					borderRadius: 0,
				},
			},
		},
	},
	findReplaceStyles: {
		'.search-match': {
			// eslint-disable-next-line @atlaskit/design-system/no-unsafe-design-token-usage
			borderRadius: token('radius.small', '3px'),
			backgroundColor: token('color.background.accent.teal.subtlest'),
			boxShadow: `${token('elevation.shadow.raised')}, inset 0 0 0 1px ${token(
				'color.border.input',
			)}`,
		},
		'.selected-search-match': {
			backgroundColor: token('color.background.accent.teal.subtle'),
		},
	},
	// TODO: ED-28370 - during platform_editor_find_and_replace_improvements clean up, rename this css object to findReplaceStyles
	findReplaceStylesNewWithA11Y: {
		// text - inactive match - light mode
		'.search-match-text': {
			borderRadius: token('space.050'),
			boxShadow: `
		inset 0 0 0 1px ${token('color.border.accent.magenta')},
		inset 0 0 0 5px ${token('color.background.accent.magenta.subtler')}
		`,
			// we need to use !important here as we need to override inline selection styles
			// eslint-disable-next-line @atlaskit/ui-styling-standard/no-important-styles
			backgroundColor: `${token('color.background.accent.magenta.subtler')} !important`,
			color: token('color.text'),
		},

		// text - active match - light mode
		'.search-match-text.selected-search-match': {
			boxShadow: `
		inset 0 0 0 1px ${token('color.background.accent.magenta.bolder.hovered')},
		inset 0 0 0 5px ${token('color.background.accent.magenta.subtlest.pressed')}
		`,
			// we need to use !important here as we need to override inline selection styles
			// eslint-disable-next-line @atlaskit/ui-styling-standard/no-important-styles
			backgroundColor: `${token('color.background.accent.magenta.subtlest.pressed')} !important`,
		},

		// text - inactive match - dark mode
		'.search-match-text.search-match-dark': {
			boxShadow: `
		inset 0 0 0 1px ${token('color.background.accent.magenta.bolder')},
		inset 0 0 0 5px ${token('color.background.accent.magenta.bolder.pressed')}
		`,
			// we need to use !important here as we need to override inline selection styles
			// eslint-disable-next-line @atlaskit/ui-styling-standard/no-important-styles
			backgroundColor: `${token('color.background.accent.magenta.bolder.pressed')} !important`,
			color: token('color.text.inverse'),
		},

		// text - active match - dark mode
		'.search-match-text.selected-search-match.search-match-dark': {
			boxShadow: `
		inset 0 0 0 1px ${token('color.background.accent.magenta.bolder')},
		inset 0 0 0 5px ${token('color.background.accent.magenta.bolder.hovered')}
		`,
			// we need to use !important here as we need to override inline selection styles
			// eslint-disable-next-line @atlaskit/ui-styling-standard/no-important-styles
			backgroundColor: `${token('color.background.accent.magenta.bolder.hovered')} !important`,
		},

		// block node - inactive match - light mode - without node selection
		'.search-match-block': {
			'[data-smart-link-container="true"], .loader-wrapper>div::after': {
				boxShadow: `
			inset 0 0 0 1px ${token('color.border.accent.magenta')},
			inset 0 0 0 5px ${token('color.background.accent.magenta.subtler')}
			`,
			},
			'.loader-wrapper>a, .hover-card-trigger-wrapper>a, .lozenge-wrapper, .editor-mention-primitive, .date-lozenger-container>span':
				{
					boxShadow: `
			0px 0px 0px 4px ${token('color.background.accent.magenta.subtler')},
			0px 0px 0px 5px ${token('color.border.accent.magenta')}
			`,
				},
		},

		// block node - active match - light mode - without node selection
		'.search-match-block.search-match-block-selected': {
			'[data-smart-link-container="true"], .loader-wrapper>div::after': {
				boxShadow: `
			inset 0 0 0 1px ${token('color.background.accent.magenta.bolder.hovered')},
			inset 0 0 0 4px ${token('color.background.accent.magenta.subtlest.pressed')}
			`,
			},
			'.loader-wrapper>a, .hover-card-trigger-wrapper>a, .lozenge-wrapper, .editor-mention-primitive, .date-lozenger-container>span':
				{
					boxShadow: `
			0px 0px 0px 4px ${token('color.background.accent.magenta.subtlest.pressed')},
			0px 0px 0px 5px ${token('color.background.accent.magenta.bolder.hovered')}
			`,
				},
		},

		// block node - inactive match - light mode - with node selection
		'.search-match-block.ak-editor-selected-node': {
			'.loader-wrapper>div::after': {
				boxShadow: `
			inset 0 0 0 1px ${token('color.border.accent.magenta')},
			inset 0 0 0 5px ${token('color.background.accent.magenta.subtler')},
			0 0 0 1px ${token('color.border.selected')}
			`,
			},
			'.loader-wrapper>a, .hover-card-trigger-wrapper>a, .lozenge-wrapper, .editor-mention-primitive, .date-lozenger-container>span':
				{
					boxShadow: `
			0 0 0 1px ${token('color.border.selected')},
			0px 0px 0px 4px ${token('color.background.accent.magenta.subtler')},
			0px 0px 0px 5px ${token('color.border.accent.magenta')}
			`,
				},
		},

		// block node - active match - light mode - with node selection
		'.search-match-block.search-match-block-selected.ak-editor-selected-node': {
			'[data-smart-link-container="true"], .loader-wrapper>div::after': {
				boxShadow: `
			inset 0 0 0 1px ${token('color.background.accent.magenta.bolder.hovered')},
			inset 0 0 0 4px ${token('color.background.accent.magenta.subtlest.pressed')},
			0 0 0 1px ${token('color.border.selected')}
			`,
			},
			'.loader-wrapper>a, .hover-card-trigger-wrapper>a, .lozenge-wrapper, .editor-mention-primitive, .date-lozenger-container>span':
				{
					boxShadow: `
			0 0 0 1px ${token('color.border.selected')},
			0px 0px 0px 4px ${token('color.background.accent.magenta.subtlest.pressed')},
			0px 0px 0px 5px ${token('color.background.accent.magenta.bolder.hovered')}
			`,
				},
		},

		// block node - inactive match - dark mode - without node selection
		'.search-match-block.search-match-dark': {
			'[data-smart-link-container="true"], .loader-wrapper>div::after': {
				boxShadow: `
			inset 0 0 0 1px ${token('color.background.accent.magenta.bolder')},
			inset 0 0 0 5px ${token('color.background.accent.magenta.bolder.pressed')}
			`,
			},
			'.loader-wrapper>a, .hover-card-trigger-wrapper>a, .lozenge-wrapper, .editor-mention-primitive, .date-lozenger-container>span':
				{
					boxShadow: `
			0px 0px 0px 4px ${token('color.background.accent.magenta.bolder.pressed')},
			0px 0px 0px 5px ${token('color.background.accent.magenta.bolder')}
			`,
				},
		},

		// block node - active match - dark mode - without node selection
		'.search-match-block.search-match-block-selected.search-match-dark': {
			'[data-smart-link-container="true"], .loader-wrapper>div::after': {
				boxShadow: `
			inset 0 0 0 1px ${token('color.background.accent.magenta.bolder')},
			inset 0 0 0 4px ${token('color.background.accent.magenta.bolder.hovered')}
			`,
			},
			'.loader-wrapper>a, .hover-card-trigger-wrapper>a, .lozenge-wrapper, .editor-mention-primitive, .date-lozenger-container>span':
				{
					boxShadow: `
			0px 0px 0px 4px ${token('color.background.accent.magenta.bolder.hovered')},
			0px 0px 0px 5px ${token('color.background.accent.magenta.bolder')}
			`,
				},
		},

		// block node - inactive match - dark mode - with node selection
		'.search-match-block.search-match-dark.ak-editor-selected-node': {
			'.loader-wrapper>div::after': {
				boxShadow: `
			inset 0 0 0 1px ${token('color.background.accent.magenta.bolder')},
			inset 0 0 0 5px ${token('color.background.accent.magenta.bolder.pressed')},
			0 0 0 1px ${token('color.border.selected')}
			`,
			},
			'.loader-wrapper>a, .hover-card-trigger-wrapper>a, .lozenge-wrapper, .editor-mention-primitive, .date-lozenger-container>span':
				{
					boxShadow: `
			0 0 0 1px ${token('color.border.selected')},
			0px 0px 0px 4px ${token('color.background.accent.magenta.bolder.pressed')},
			0px 0px 0px 5px ${token('color.background.accent.magenta.bolder')}
			`,
				},
		},

		// block node - active match - dark mode - with node selection
		'.search-match-block.search-match-block-selected.search-match-dark.ak-editor-selected-node': {
			'[data-smart-link-container="true"], .loader-wrapper>div::after': {
				boxShadow: `
			inset 0 0 0 1px ${token('color.background.accent.magenta.bolder')},
			inset 0 0 0 4px ${token('color.background.accent.magenta.bolder.hovered')},
			0 0 0 1px ${token('color.border.selected')}
			`,
			},
			'.loader-wrapper>a, .hover-card-trigger-wrapper>a, .lozenge-wrapper, .editor-mention-primitive, .date-lozenger-container>span':
				{
					boxShadow: `
			0 0 0 1px ${token('color.border.selected')},
			0px 0px 0px 4px ${token('color.background.accent.magenta.bolder.hovered')},
			0px 0px 0px 5px ${token('color.background.accent.magenta.bolder')}
			`,
				},
		},

		// expand title - inactive match - light mode
		'.search-match-expand-title > .ak-editor-expand__title-container > .ak-editor-expand__input-container':
			{
				borderRadius: token('space.050'),
				boxShadow: `
		inset 0 0 0 1px ${token('color.border.accent.magenta')},
		inset 0 0 0 5px ${token('color.background.accent.magenta.subtler')}
		`,
				backgroundColor: token('color.background.accent.magenta.subtler'),
				'.ak-editor-expand__title-input': {
					color: token('color.text'),
				},
			},

		// expand title - active match - light mode
		'.search-match-expand-title.selected-search-match > .ak-editor-expand__title-container > .ak-editor-expand__input-container':
			{
				boxShadow: `
		inset 0 0 0 1px ${token('color.background.accent.magenta.bolder.hovered')},
		inset 0 0 0 5px ${token('color.background.accent.magenta.subtlest.pressed')}
		`,
				backgroundColor: token('color.background.accent.magenta.subtlest.pressed'),
			},

		// expand title - inactive match - dark mode
		'.search-match-expand-title.search-match-dark > .ak-editor-expand__title-container > .ak-editor-expand__input-container':
			{
				boxShadow: `
		inset 0 0 0 1px ${token('color.background.accent.magenta.bolder')},
		inset 0 0 0 5px ${token('color.background.accent.magenta.bolder.pressed')}
		`,
				backgroundColor: token('color.background.accent.magenta.bolder.pressed'),
				'.ak-editor-expand__title-input': {
					color: token('color.text.inverse'),
				},
			},

		// expand title - active match - dark mode
		'.search-match-expand-title.selected-search-match.search-match-dark > .ak-editor-expand__title-container > .ak-editor-expand__input-container':
			{
				boxShadow: `
		inset 0 0 0 1px ${token('color.background.accent.magenta.bolder')},
		inset 0 0 0 5px ${token('color.background.accent.magenta.bolder.hovered')}
		`,
				backgroundColor: token('color.background.accent.magenta.bolder.hovered'),
			},
	},
	findReplaceStylesNewWithCodeblockColorContrastFix: {
		// eslint-disable-next-line @atlaskit/ui-styling-standard/no-unsafe-values, @atlaskit/ui-styling-standard/no-imported-style-values
		'.code-block .search-match-text.selected-search-match': {
			span: {
				// we need to use !important here as we need to override inline selection styles
				// eslint-disable-next-line @atlaskit/ui-styling-standard/no-important-styles
				color: `${token('color.text')} !important`,
			},
		},
	},
	findReplaceStylesWithCodeblockColorContrastFix: {
		// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors, @atlaskit/ui-styling-standard/no-unsafe-values, @atlaskit/ui-styling-standard/no-imported-style-values
		'.code-block .search-match.selected-search-match': {
			span: {
				// we need to use !important here as we need to override inline selection styles
				// eslint-disable-next-line @atlaskit/ui-styling-standard/no-important-styles
				color: `${token('color.text')} !important`,
			},
		},
	},
	findReplaceStylesWithRefSyncBlock: {
		// sync block (reference) - inactive match - light mode - without node selection
		'.search-match-block.ak-editor-sync-block': {
			borderRadius: token('space.050'),
			boxShadow: `inset 0 0 0 1px ${token('color.border.accent.magenta')}, inset 0 0 0 5px ${token('color.background.accent.magenta.subtler')}`,
			backgroundColor: token('color.background.accent.magenta.subtler'),
		},
		// sync block (reference) - active match - light mode - without node selection
		'.search-match-block.search-match-block-selected.ak-editor-sync-block': {
			boxShadow: `inset 0 0 0 1px ${token('color.background.accent.magenta.bolder.hovered')}, inset 0 0 0 5px ${token('color.background.accent.magenta.subtlest.pressed')}`,
			backgroundColor: token('color.background.accent.magenta.subtlest.pressed'),
		},
		// sync block (reference) - inactive match - light mode - with node selection
		'.search-match-block.ak-editor-sync-block.ak-editor-selected-node': {
			boxShadow: `inset 0 0 0 1px ${token('color.border.accent.magenta')}, inset 0 0 0 5px ${token('color.background.accent.magenta.subtler')}, 0 0 0 1px ${token('color.border.selected')}`,
			backgroundColor: token('color.background.accent.magenta.subtler'),
		},
		// sync block (reference) - active match - light mode - with node selection
		'.search-match-block.search-match-block-selected.ak-editor-sync-block.ak-editor-selected-node':
			{
				boxShadow: `0 0 0 1px ${token('color.border.focused')}`,
				backgroundColor: token('color.background.accent.magenta.subtlest.pressed'),
			},
		// sync block (reference) - inactive match - dark mode - without node selection
		'.search-match-block.search-match-dark.ak-editor-sync-block': {
			boxShadow: `inset 0 0 0 1px ${token('color.background.accent.magenta.bolder')}, inset 0 0 0 5px ${token('color.background.accent.magenta.bolder.pressed')}`,
			backgroundColor: token('color.background.accent.magenta.bolder.pressed'),
		},
		// sync block (reference) - active match - dark mode - without node selection
		'.search-match-block.search-match-block-selected.search-match-dark.ak-editor-sync-block': {
			boxShadow: `inset 0 0 0 1px ${token('color.background.accent.magenta.bolder')}, inset 0 0 0 4px ${token('color.background.accent.magenta.bolder.hovered')}`,
			backgroundColor: token('color.background.accent.magenta.bolder.hovered'),
		},
		// sync block (reference) - inactive match - dark mode - with node selection
		'.search-match-block.search-match-dark.ak-editor-sync-block.ak-editor-selected-node': {
			boxShadow: `inset 0 0 0 1px ${token('color.background.accent.magenta.bolder')}, inset 0 0 0 5px ${token('color.background.accent.magenta.bolder.pressed')}, 0 0 0 1px ${token('color.border.selected')}`,
			backgroundColor: token('color.background.accent.magenta.bolder.pressed'),
		},
		// sync block (reference) - active match - dark mode - with node selection
		'.search-match-block.search-match-block-selected.search-match-dark.ak-editor-sync-block.ak-editor-selected-node':
			{
				boxShadow: `0 0 0 1px ${token('color.border.focused')}`,
				backgroundColor: token('color.background.accent.magenta.bolder.hovered'),
			},
	},
	firstBlockNodeStyles: {
		// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors
		'.ProseMirror': {
			// eslint-disable-next-line @atlaskit/ui-styling-standard/no-imported-style-values,@atlaskit/ui-styling-standard/no-nested-selectors,@atlaskit/ui-styling-standard/no-unsafe-values
			[`> .${PanelSharedCssClassName.prefix}, > .${CodeBlockSharedCssClassName.CODEBLOCK_CONTAINER}, > .${SmartCardSharedCssClassName.BLOCK_CARD_CONTAINER}, > div[data-task-list-local-id], > div[data-layout-section], > .${expandClassNames.prefix}`]:
				{
					// eslint-disable-next-line @atlaskit/ui-styling-standard/no-unsafe-selectors
					'&:first-child': {
						marginTop: 0,
					},
				},

			// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors,@atlaskit/ui-styling-standard/no-unsafe-selectors
			'> hr:first-child, > .ProseMirror-widget:first-child + hr': {
				marginTop: 0,
			},
		},
	},
	firstCodeBlockWithNoMargin: {
		'.ProseMirror': {
			'.ak-editor-panel__content': {
				'> .code-block:first-child, > .ProseMirror-widget:first-child + .code-block, > .ProseMirror-widget:first-child + .ProseMirror-widget + .code-block':
					{
						// eslint-disable-next-line @atlaskit/design-system/use-tokens-space,@atlaskit/ui-styling-standard/no-important-styles
						margin: '0!important',
					},
			},
		},
	},
	firstCodeBlockWithNoMarginOld: {
		'.ProseMirror': {
			'.ak-editor-panel__content': {
				'> .code-block:first-child': {
					// eslint-disable-next-line @atlaskit/design-system/use-tokens-space,@atlaskit/ui-styling-standard/no-important-styles
					margin: '0!important',
				},
			},
		},
	},
	firstFloatingToolbarButtonStyles: {
		'button.first-floating-toolbar-button:focus': {
			// eslint-disable-next-line @atlaskit/ui-styling-standard/no-unsafe-values
			outline: `2px solid ${token('color.border.focused')}`,
		},
	},
	firstWrappedMediaStyles: {
		'.ProseMirror': {
			// Remove gap between first wrapped mediaSingle and its fellow wrapped mediaSingle
			// eslint-disable-next-line @atlaskit/ui-styling-standard/no-unsafe-selectors
			"& [layout^='wrap-']:has(+ [layout^='wrap-']), & [layout^='wrap-']:has(+ .ProseMirror-gapcursor + [layout^='wrap-'])":
				{
					// eslint-disable-next-line @atlaskit/ui-styling-standard/no-unsafe-values, @atlaskit/ui-styling-standard/no-imported-style-values
					[`& .${richMediaClassName}`]: {
						marginLeft: 0,
						marginRight: 0,
					},
				},
		},
	},
	fontSizeStyles: {
		'.ProseMirror': {
			'.fabric-editor-font-size': {
				"&[data-font-size='small']": {
					// eslint-disable-next-line @atlaskit/design-system/use-tokens-typography
					font: 'var(--editor-font-ugc-token-body-small)',
				},
			},

			// Apply font-size to the ::marker pseudo-element of list items that have a font-size mark.
			// Targeting ::marker directly avoids setting font on the <li> itself, which would cascade
			// into nested lists and compound the sizing at each nesting level.
			// eslint-disable-next-line @atlaskit/ui-styling-standard/no-unsafe-selectors
			"li:has(> .fabric-editor-font-size[data-font-size='small'])::marker": {
				// eslint-disable-next-line @atlaskit/design-system/use-tokens-typography
				font: 'var(--editor-font-ugc-token-body-small)',
			},

			// For blockTaskItem nodes: propagate font-size to the task container so the
			// checkbox and layout align with the content size. Reset on the inner mark to avoid
			// double-applying.
			// eslint-disable-next-line @atlaskit/ui-styling-standard/no-unsafe-selectors
			"[data-prosemirror-node-name='blockTaskItem']:has(.fabric-editor-font-size[data-font-size='small'])":
				{
					// eslint-disable-next-line @atlaskit/design-system/use-tokens-typography
					font: 'var(--editor-font-ugc-token-body-small)',

					// Reset the inner block mark so the font value is not applied twice
					'.fabric-editor-font-size': {
						font: 'inherit',
					},
				},
		},
	},
	fullPageEditorStyles: {
		flexGrow: 1,
		height: '100%',
		overflowY: 'scroll',
		position: 'relative',
		display: 'flex',
		flexDirection: 'column',
		scrollBehavior: 'smooth',
	},
	gapCursorStyles: {
		'.ProseMirror': {
			// eslint-disable-next-line @atlaskit/ui-styling-standard/no-unsafe-values
			'&.ProseMirror-hide-gapcursor': {
				// Clean this up with platform_synced_block
				caretColor: 'transparent',
			},

			'.ProseMirror-gapcursor': {
				display: 'none',
				pointerEvents: 'none',
				position: 'relative',

				'& span': {
					caretColor: 'transparent',
					position: 'absolute',
					height: '100%',
					width: '100%',
					display: 'block',
				},

				'& span::after': {
					// eslint-disable-next-line @atlaskit/ui-styling-standard/no-unsafe-values
					animationName: gapCursorBlink,
					animationDuration: `1s`,
					animationTimingFunction: `step-start`,
					animationIterationCount: `infinite`,
					borderLeft: '1px solid',
					content: "''",
					display: 'block',
					position: 'absolute',
					top: 0,
					height: '100%',
				},
				'&.-left span::after': {
					left: token('space.negative.050'),
				},
				'&.-right span::after': {
					right: token('space.negative.050'),
				},
				'& span[layout="full-width"], & span[layout="wide"], & span[layout="fixed-width"]': {
					// eslint-disable-next-line @atlaskit/design-system/use-tokens-space
					marginLeft: '50%',
					transform: 'translateX(-50%)',
				},
				'&[layout="wrap-right"]': {
					float: 'right',
				},

				/* fix vertical alignment of gap cursor */
				// eslint-disable-next-line @atlaskit/ui-styling-standard/no-unsafe-values
				[fixVerticalAlignmentSelector]: {
					marginTop: 0,
				},
			},
			'&.ProseMirror-focused .ProseMirror-gapcursor': {
				display: 'block',
				borderColor: 'transparent',
			},
		},

		/* This hack below is for two images aligned side by side */
		// eslint-disable-next-line @atlaskit/ui-styling-standard/no-unsafe-values
		[gapCursorTwoImagesSideBySideFixSelector]: {
			clear: 'none',
		},

		// eslint-disable-next-line @atlaskit/ui-styling-standard/no-unsafe-values
		[gapCursorMarginFixSelector]: {
			marginRight: 0,
			marginLeft: 0,
			marginBottom: 0,
		},

		// eslint-disable-next-line @atlaskit/ui-styling-standard/no-unsafe-values
		[gapCursorFloatLeftFixSelector]: {
			float: 'left',
		},

		// eslint-disable-next-line @atlaskit/ui-styling-standard/no-unsafe-values
		[gapCursorAfterPseudoSelector]: {
			visibility: 'hidden',
			display: 'block',
			// eslint-disable-next-line @atlaskit/design-system/use-tokens-typography
			fontSize: 0,
			content: "' '",
			clear: 'both',
			height: 0,
		},

		// eslint-disable-next-line @atlaskit/ui-styling-standard/no-unsafe-values
		[gapCursorMarginDeepChildrenFixSelector]: {
			marginTop: 0,
		},
	},
	gapCursorStylesVisibilityFix: {
		// Hide native caret when gap cursor widget is present (no class toggle = no VC90 mutation)
		'.ProseMirror': {
			// eslint-disable-next-line @atlaskit/ui-styling-standard/no-unsafe-selectors
			'&:has(.ProseMirror-gapcursor)': {
				caretColor: 'transparent',
			},
		},
	},
	gridStyles: {
		'.gridParent': {
			width: `calc(100% + 24px)`,
			marginLeft: token('space.negative.150'),
			marginRight: token('space.negative.150'),
			transform: 'scale(1)',
			zIndex: 2,
		},

		'.gridContainer': {
			position: 'fixed',
			height: '100vh',
			width: '100%',
			pointerEvents: 'none',
		},

		'.gridLine': {
			borderLeft: `${token('border.width')} solid ${token('color.border')}`,
			display: 'inline-block',
			boxSizing: 'border-box',
			height: '100%',
			// eslint-disable-next-line @atlaskit/design-system/use-tokens-space
			marginLeft: '-1px',
			transitionProperty: 'border-color',
			transitionDuration: '0.15s',
			transitionTimingFunction: 'linear',
			zIndex: 0,
		},

		'.highlight': {
			borderLeft: `1px solid ${token('color.border.focused')}`,
		},
	},
	hideCursorWhenHideSelectionStyles: {
		// Hide cursor when hide selection styles are applied
		// https://github.com/ProseMirror/prosemirror-view/blob/f37ebb29befdbde3cd194fe13fe17b78e743d2f2/style/prosemirror.css#L24
		'.ProseMirror-hideselection': {
			caretColor: 'transparent',
		},
	},
	hideSelectionStyles: {
		// Hide selection styles for ProseMirror editor
		'.ProseMirror-hideselection': {
			'*::selection': {
				background: 'transparent',
			},
			// eslint-disable-next-line @atlaskit/ui-styling-standard/no-unsafe-selectors
			'*::-moz-selection': {
				background: 'transparent',
			},
		},
	},
	hyperLinkFloatingToolbarStyles: {
		'.hyperlink-floating-toolbar': {
			padding: 0,
		},
	},
	indentationStyles: {
		'.ProseMirror': {
			'.fabric-editor-indentation-mark': {
				"&[data-level='1']": {
					// eslint-disable-next-line @atlaskit/design-system/use-tokens-space
					marginLeft: 30,
				},

				"&[data-level='2']": {
					// eslint-disable-next-line @atlaskit/design-system/use-tokens-space
					marginLeft: 60,
				},

				"&[data-level='3']": {
					// eslint-disable-next-line @atlaskit/design-system/use-tokens-space
					marginLeft: 90,
				},

				"&[data-level='4']": {
					// eslint-disable-next-line @atlaskit/design-system/use-tokens-space
					marginLeft: 120,
				},

				"&[data-level='5']": {
					// eslint-disable-next-line @atlaskit/design-system/use-tokens-space
					marginLeft: 150,
				},

				"&[data-level='6']": {
					// eslint-disable-next-line @atlaskit/design-system/use-tokens-space
					marginLeft: 180,
				},
			},
		},
	},
	InlineNodeViewSharedStyles: {
		'.ProseMirror': {
			'.inlineNodeView': {
				display: 'inline',
				userSelect: 'all',
				whiteSpace: 'nowrap',
				// eslint-disable-next-line @atlaskit/ui-styling-standard/no-unsafe-selectors
				'& > *:not(.zeroWidthSpaceContainer)': {
					whiteSpace: 'pre-wrap',
				},
				'& > .assistive': {
					userSelect: 'none',
				},
			},
			'&.ua-safari': {
				'.inlineNodeView': {
					// eslint-disable-next-line @atlaskit/ui-styling-standard/no-unsafe-selectors
					'&::selection, *::selection': {
						background: 'transparent',
					},
				},
			},
			'&.ua-chrome .inlineNodeView > span': {
				userSelect: 'none',
			},
			'.inlineNodeViewAddZeroWidthSpace': {
				'&::after': {
					content: "'\u200b'", // ZERO_WIDTH_SPACE
				},
			},
		},
	},
	/**
	 * Base styles for layout
	 */
	layoutBaseStyles: {
		'.ProseMirror': {
			'[data-layout-section]': {
				margin: `${token('space.100')} -12px 0`,
				transition: 'border-color 0.3s cubic-bezier(0.15, 1, 0.3, 1)',
				cursor: 'pointer',

				// Inner cursor located 26px from left
				'[data-layout-column]': {
					flex: 1,
					position: 'relative',
					minWidth: 0,
					/* disable 4 borders when in view mode and advanced layouts is on */
					border: `${token('border.width')} solid ${token('color.border')}`,
					borderRadius: token('radius.small'),
					padding: token('space.150'),
					boxSizing: 'border-box',
					'> div': {
						'> .embedCardView-content-wrap:first-of-type .rich-media-item': {
							marginTop: 0,
						},
						'> .mediaSingleView-content-wrap:first-of-type .rich-media-item': {
							marginTop: 0,
						},
						'> .ProseMirror-gapcursor.-right:first-child + .mediaSingleView-content-wrap .rich-media-item, > style:first-child + .ProseMirror-gapcursor.-right + .mediaSingleView-content-wrap .rich-media-item, > .ProseMirror-gapcursor.-right:first-of-type + .embedCardView-content-wrap .rich-media-item':
							{
								marginTop: 0,
							},
						'> .ProseMirror-gapcursor:first-child + span + .mediaSingleView-content-wrap .rich-media-item, > style:first-child + .ProseMirror-gapcursor + span + .mediaSingleView-content-wrap .rich-media-item':
							{
								marginTop: 0,
							},
						// Prevent first DecisionWrapper's margin-top: 8px from shifting decisions down and shrinking layout's node selectable area (leniency margin)
						"> [data-node-type='decisionList']": {
							'li:first-of-type [data-decision-wrapper]': {
								marginTop: 0,
							},
						},
					},

					// Make the 'content' fill the entire height of the layout column to allow click handler of layout section nodeview to target only data-layout-column
					'[data-layout-content]': {
						height: '100%',
						cursor: 'text',

						'.mediaGroupView-content-wrap': {
							clear: 'both',
						},
					},

					// Keep the editable content wrapper stretched so blank column space remains a text hit area.
					// Apply vertical alignment to the wrapper contents rather than shrinking the wrapper itself.
					'&[data-valign="middle"] > [data-layout-content], &[data-valign="bottom"] > [data-layout-content]':
						{
							display: 'flex',
							flexDirection: 'column',
						},

					'&[data-valign="middle"] > [data-layout-content]': {
						justifyContent: 'center',
					},

					'&[data-valign="bottom"] > [data-layout-content]': {
						justifyContent: 'flex-end',
					},
				},
			},
		},

		// hide separator when element is dragging on top of a layout column
		'[data-blocks-drop-target-container] ~ [data-layout-column] > [data-layout-content]::before': {
			display: 'none',
		},

		'.fabric-editor--full-width-mode .ProseMirror': {
			'[data-layout-section]': {
				'.pm-table-container': {
					margin: '0 2px',
				},
			},
		},
	},
	/**
	 * Base styles overrides for layout columns when advanced layouts experiment is on
	 */
	layoutBaseStylesAdvanced: {
		'.ProseMirror [data-layout-section] [data-layout-column]': {
			border: 0,
		},
	},
	/**
	 * Spacing overrides when platform_editor_nested_dnd_styles_changes is on
	 */
	// TODO: EDF-123 - Migrate away from gridSize
	// Recommendation: Replace directly with 7px
	// Ignored via go/ees007
	layoutBaseStylesFixesUnderNestedDnDFG: {
		'.ProseMirror [data-layout-section]': {
			margin: `${token('space.100')} -20px 0`,
		},

		'.ProseMirror [data-layout-section] [data-layout-column]': {
			padding: '12px 20px',
		},
	},
	/**
	 * Spacing overrides when platform_editor_nested_dnd_styles_changes is on,
	 * excluding layouts inside bodied sync blocks
	 */
	layoutBaseStylesFixesUnderNestedDnDFGExcludingBodiedSync: {
		// Apply -20px margin to all sections
		'.ProseMirror [data-layout-section]': {
			margin: `${token('space.100')} -20px 0`,
		},

		// Reset to default margin when inside bodied sync block
		'.ProseMirror [data-prosemirror-node-name="bodiedSyncBlock"] [data-layout-section]': {
			margin: `${token('space.100')} -12px 0`,
		},

		'.ProseMirror [data-layout-section] [data-layout-column]': {
			padding: '12px 20px',
		},
	},
	// on exp 'platform_editor_table_excerpts_fix' cleanup, merge this style to the one above
	layoutBaseStylesWithTableExcerptsFix: {
		'.ProseMirror': {
			'[data-layout-section]': {
				'[data-layout-column]': {
					'> div': {
						'.pm-table-container': {
							// eslint-disable-next-line @atlaskit/ui-styling-standard/no-important-styles
							width: '100% !important',
						},
					},
				},
			},
		},
	},
	/**
	 * Styles for the column resize divider widget DOM elements.
	 * Mirrors the pm-breakout-resize-handle-* pattern from resizerStyles.ts.
	 * Applied only when advanced_layouts experiment is on.
	 */
	layoutColumnDividerStyles: {
		'.layout-column-divider': {
			// Negative margin removes the applied 'gap' from the parent's flex box
			// eslint-disable-next-line @atlaskit/design-system/use-tokens-space
			marginInline: '-15px 0px',
			flexShrink: 0,
			boxSizing: 'content-box',
			cursor: 'col-resize',
			position: 'relative',
			zIndex: 2,
			alignSelf: 'stretch',
			display: 'flex',
			alignItems: 'center',
			justifyContent: 'center',

			'&:hover .layout-column-divider-rail': {
				background: token('color.background.selected'),
			},

			'&:hover .layout-column-divider-thumb': {
				background: token('color.border.focused'),
			},
		},

		// Rail and thumb styles intentionally mirror the breakout resize handle
		// (see .pm-breakout-resize-handle-rail and .pm-breakout-resize-handle-thumb in resizerStyles.ts).
		// If updating these styles, consider keeping both in sync.
		'.layout-column-divider-rail': {
			width: 7,
			height: '100%',
			display: 'flex',
			alignItems: 'center',
			justifyContent: 'center',
			borderRadius: token('radius.small'),
			transition: 'background-color 0.2s',
			pointerEvents: 'none',
		},

		'.layout-column-divider-thumb': {
			minWidth: 3,
			height: 'clamp(27px, calc(100% - 32px), 96px)',
			background: token('color.border'),
			borderRadius: token('radius.medium'),
			pointerEvents: 'none',
			position: 'sticky',
			top: token('space.150'),
			bottom: token('space.150'),
		},
	},
	/**
	 * Override divider marginInline when platform_editor_nested_dnd_styles_changes is on,
	 * since the layout section/column spacing changes.
	 */
	layoutColumnDividerStylesNestedDnD: {
		'.layout-column-divider': {
			// eslint-disable-next-line @atlaskit/design-system/use-tokens-space
			marginInline: '0 -7px',
		},
	},
	/*
	 * marginTop fixes when platform_editor_nested_dnd_styles_changes is on
	 */
	layoutColumnMartinTopFixesNew: {
		'.ProseMirror [data-layout-section] [data-layout-column] > div': {
			'> :nth-child(1 of :not(style, .ProseMirror-gapcursor, .ProseMirror-widget, span))': {
				marginTop: 0,
			},
		},
	},
	/*
	 * marginTop fixes when platform_editor_nested_dnd_styles_changes is off
	 */
	layoutColumnMartinTopFixesOld: {
		'.ProseMirror [data-layout-section] [data-layout-column] > div': {
			'> :not(style):first-child, > style:first-child + *': {
				marginTop: 0,
			},

			'> .ProseMirror-gapcursor:first-child + *, > style:first-child + .ProseMirror-gapcursor + *':
				{
					marginTop: 0,
				},

			'> .ProseMirror-gapcursor:first-child + span + *': {
				marginTop: 0,
			},
		},
	},
	/**
	 * Layout column resize styles for the platform_editor_layout_column_resize_handle experiment
	 */
	layoutColumnResizeStyles: {
		'.ProseMirror [data-layout-section]': {
			'> [data-layout-column][style*="--column-width"]': {
				// Also ensure flex-grow and flex-shrink are reset when using custom width
				flex: 'var(--column-resize-flex, 1)',
				// Support CSS custom property for smooth resizing during drag
				// When --column-resize-width is set, use it; otherwise fall back to the original flex-basis
				// Using attribute selector for higher specificity than inline styles
				flexBasis: 'var(--column-resize-width, var(--column-width))',
			},
		},
	},
	/**
	 * Responsive styles for layout columns when advanced layouts experiment is on
	 */
	layoutColumnResponsiveStyles: {
		'.ProseMirror [data-layout-section]': {
			display: 'flex',
			flexDirection: 'row',
			gap: token('space.100'),

			'& > *': {
				flex: 1,
				minWidth: 0,
			},

			'& > .unsupportedBlockView-content-wrap': {
				minWidth: 'initial',
			},
		},

		// Ignored via go/DSP-18766
		'.layout-section-container': {
			containerType: 'inline-size',
			containerName: 'layout-area',
		},
	},
	/**
	 * Layout columns styles when advanced layouts experiment is on
	 */
	layoutColumnStylesAdvanced: {
		'.ProseMirror [data-layout-section]': {
			'> [data-layout-column]': {
				margin: '0 4px',
			},

			'> [data-layout-column]:first-of-type': {
				marginLeft: 0,
			},

			'> [data-layout-column]:last-of-type': {
				marginRight: 0,
			},

			'@media screen and (max-width: 1024px)': {
				'[data-layout-column] + [data-layout-column]': {
					margin: 0,
				},
			},

			'> [data-layout-column].ak-editor-selected-node:not(.danger)': {
				...blanketSelectionStyles,
				...hideNativeBrowserTextSelectionStyles,
				// layout column selection shorter after layout border has been removed
				'::before': {
					width: 'calc(100% - 8px)',
					left: 4,
					borderRadius: token('radius.small', '3px'),
				},
			},
		},
	},
	/**
	 * Layout columns styles when advanced layouts experiment is off
	 */
	layoutColumnStylesNotAdvanced: {
		'.ProseMirror [data-layout-section]': {
			'[data-layout-column] + [data-layout-column]': {
				// eslint-disable-next-line @atlaskit/design-system/use-tokens-space
				marginLeft: 8,
			},

			'@media screen and (max-width: 1024px)': {
				'[data-layout-column] + [data-layout-column]': {
					marginLeft: 0,
				},
			},
		},
	},
	/**
	 * Base responsive styles for layout
	 */
	// jest warning: JSDOM version (22) doesn't support the new @container CSS rule
	layoutResponsiveBaseStyles: {
		// chosen breakpoints in container queries are to make sure layout responsiveness in editor aligns with renderer
		// not resized layout in full-width editor
		'.fabric-editor--full-width-mode .ProseMirror > .layoutSectionView-content-wrap': {
			'[data-layout-section]': {
				[editorAreaLayoutFullWidthMaxWidthContainerQuery]: {
					flexDirection: 'column',
				},
			},
			'&.selected, &:hover, &.selected.danger, &.ak-editor-selected-node:not(.danger)': {
				'[data-layout-column]:not(:first-of-type)': {
					[editorAreaLayoutFullWidthMaxWidthContainerQuery]: {
						// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors
						'[data-layout-content]::before': {
							content: "''",
							// eslint-disable-next-line @atlaskit/ui-styling-standard/no-unsafe-values
							borderTop: `1px solid ${token('color.border')}`,
							position: 'absolute',
							width: 'calc(100% - 32px)',
							// eslint-disable-next-line @atlaskit/design-system/use-tokens-space
							marginTop: -13,
							// clear styles for column separator
							borderLeft: 'unset',
							marginLeft: 'unset',
							height: 'unset',
						},
					},
				},
			},
		},
		// not resized layout in fixed-width editor
		'.ak-editor-content-area:not(.fabric-editor--full-width-mode) .ProseMirror > .layoutSectionView-content-wrap':
			{
				'[data-layout-section]': {
					[editorAreaLayoutFixedWidthMaxWidthContainerQuery]: {
						flexDirection: 'column',
					},
				},
				'&.selected, &:hover, &.selected.danger, &.ak-editor-selected-node:not(.danger)': {
					'[data-layout-column]:not(:first-of-type)': {
						[editorAreaLayoutFixedWidthMaxWidthContainerQuery]: {
							// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors
							'[data-layout-content]::before': {
								content: "''",
								// eslint-disable-next-line @atlaskit/ui-styling-standard/no-unsafe-values
								borderTop: `1px solid ${token('color.border')}`,
								position: 'absolute',
								width: 'calc(100% - 32px)',
								// eslint-disable-next-line @atlaskit/design-system/use-tokens-space
								marginTop: -13,
								// clear styles for column separator
								borderLeft: 'unset',
								marginLeft: 'unset',
								height: 'unset',
							},
						},
					},
				},
			},
		// resized layout in full/fixed-width editor
		'.ProseMirror .fabric-editor-breakout-mark .layoutSectionView-content-wrap': {
			'[data-layout-section]': {
				[editorAreaLayoutResizedMaxWidthContainerQuery]: {
					flexDirection: 'column',
				},
			},
			'&.selected, &:hover, &.selected.danger, &.ak-editor-selected-node:not(.danger)': {
				'[data-layout-column]:not(:first-of-type)': {
					[editorAreaLayoutResizedMaxWidthContainerQuery]: {
						// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors
						'[data-layout-content]::before': {
							content: "''",
							// eslint-disable-next-line @atlaskit/ui-styling-standard/no-unsafe-values
							borderTop: `1px solid ${token('color.border')}`,
							position: 'absolute',
							width: 'calc(100% - 32px)',
							// eslint-disable-next-line @atlaskit/design-system/use-tokens-space
							marginTop: -13,
							// clear styles for column separator
							borderLeft: 'unset',
							marginLeft: 'unset',
							height: 'unset',
						},
					},
				},
			},
		},
	},
	/**
	 * Responsive styles for layout in view mode
	 */
	layoutResponsiveStylesForView: {
		// chosen breakpoints in container queries are to make sure layout responsiveness in editor aligns with renderer
		// not resized layout in full-width editor
		'.fabric-editor--full-width-mode .ProseMirror > .layoutSectionView-content-wrap': {
			'&.selected, &:hover, &.selected.danger, &.ak-editor-selected-node:not(.danger)': {
				'[data-layout-column]:not(:first-of-type)': {
					[editorAreaLayoutFullWidthMaxWidthContainerQuery]: {
						'[data-layout-content]::before': {
							borderTop: 0,
						},
					},
				},
			},
		},

		// not resized layout in fixed-width editor
		'.ak-editor-content-area:not(.fabric-editor--full-width-mode) .ProseMirror > .layoutSectionView-content-wrap':
			{
				'&.selected, &:hover, &.selected.danger, &.ak-editor-selected-node:not(.danger)': {
					'[data-layout-column]:not(:first-of-type)': {
						[editorAreaLayoutFixedWidthMaxWidthContainerQuery]: {
							'[data-layout-content]::before': {
								borderTop: 0,
							},
						},
					},
				},
			},

		// resized layout in full/fixed-width editor
		'.ProseMirror .fabric-editor-breakout-mark .layoutSectionView-content-wrap': {
			'&.selected, &:hover, &.selected.danger, &.ak-editor-selected-node:not(.danger)': {
				'[data-layout-column]:not(:first-of-type)': {
					[editorAreaLayoutResizedMaxWidthContainerQuery]: {
						'[data-layout-content]::before': {
							borderTop: 0,
						},
					},
				},
			},
		},
	},
	/**
	 * Layout section styles when advanced layouts experiment is on
	 */
	layoutSectionStylesAdvanced: {
		'.ProseMirror .layout-section-container [data-layout-section]': {
			'> .ProseMirror-widget': {
				flex: 'none',
				// eslint-disable-next-line @atlaskit/ui-styling-standard/no-important-styles
				display: 'contents !important',

				'&[data-blocks-drag-handle-container] div': {
					// eslint-disable-next-line @atlaskit/ui-styling-standard/no-important-styles
					display: 'contents !important',
				},

				'&[data-blocks-drop-target-container]': {
					// eslint-disable-next-line @atlaskit/ui-styling-standard/no-important-styles
					display: 'block !important',
					margin: token('space.negative.050'),

					'[data-drop-target-for-element]': {
						position: 'absolute',
					},
				},

				// Column resize divider: always in DOM, hidden via opacity by default
				'&.layout-column-divider': {
					// eslint-disable-next-line @atlaskit/ui-styling-standard/no-important-styles
					display: 'block !important',
					flex: 'none',
					opacity: 0,
					transition: 'opacity 0.2s',
				},

				'& + [data-layout-column]': {
					margin: 0,
				},
			},

			'> [data-layout-column]': {
				margin: 0,
			},
		},

		// On hover: fade in drag divider and hide the 1px separator
		'.ProseMirror .layoutSectionView-content-wrap:hover .layout-section-container [data-layout-section]':
			{
				'> .ProseMirror-widget.layout-column-divider': {
					opacity: 1,
				},
				'> .ProseMirror-widget.layout-column-divider ~ [data-layout-column] [data-layout-content]::before':
					{
						// eslint-disable-next-line @atlaskit/ui-styling-standard/no-important-styles
						display: 'none !important',
					},
			},
	},
	/**
	 * Layout section styles when advanced layouts experiment is off
	 */
	layoutSectionStylesNotAdvanced: {
		// Ignored via go/DSP-18766
		'.ProseMirror [data-layout-section]': {
			position: 'relative',
			display: 'flex',
			flexDirection: 'row',

			// Ignored via go/DSP-18766
			'& > *': {
				flex: 1,
				minWidth: 0,
			},

			// Ignored via go/DSP-18766
			'& > .unsupportedBlockView-content-wrap': {
				minWidth: 'initial',
			},

			'& > .layout-column-divider': {
				flex: 'none',
			},

			// Ignored via go/DSP-18766
			'@media screen and (max-width: 1024px)': {
				flexDirection: 'column',
			},
		},
	},
	/**
	 * Selected styles for layout when advanced layouts experiment is on
	 */
	layoutSelectedStylesAdvanced: {
		'.ProseMirror': {
			'[data-layout-section], .layoutSectionView-content-wrap': {
				"&.selected, [data-empty-layout='true'], &:hover, &.selected.danger [data-layout-section], &.ak-editor-selected-node:not(.danger) [data-layout-section]":
					{
						'[data-layout-column]:not(:first-of-type) [data-layout-content]::before': {
							content: "''",
							borderLeft: `1px solid ${token('color.border')}`,
							position: 'absolute',
							height: 'calc(100% - 24px)',
							// eslint-disable-next-line @atlaskit/design-system/use-tokens-space
							marginLeft: -25,
						},
					},

				'&.selected.danger [data-layout-section]': {
					backgroundColor: token('color.background.danger'),
					boxShadow: `0 0 0 1px ${token('color.border.danger')}`,
					borderRadius: token('radius.small'),
				},

				'&.ak-editor-selected-node:not(.danger) [data-layout-section]': {
					boxShadow: `0 0 0 1px ${token('color.border.selected')}`,
					borderRadius: token('radius.small'),
					backgroundColor: token('color.background.selected'),
					'[data-layout-column]': {
						...blanketSelectionStyles,
						...hideNativeBrowserTextSelectionStyles,
						border: 0,
						'::before': {
							backgroundColor: 'transparent',
						},
					},
				},
			},
		},
	},
	// Fix for layoutSelectedStylesAdvanced that addresses an issue where the delete indicator
	// sometimes doesn't appear when inside a synced block.
	// Separated as a distinct style to allow feature-gating without affecting module-level styles.
	// This prevents style inconsistencies before the feature flag is initialized.
	layoutSelectedStylesAdvancedFix: {
		'.ProseMirror': {
			'[data-layout-section], .layoutSectionView-content-wrap': {
				'&.selected.danger [data-layout-section]': {
					boxShadow: `inset 0 0 0 1px ${token('color.border.danger')}`,
				},

				'&.ak-editor-selected-node:not(.danger) [data-layout-section]': {
					boxShadow: `inset 0 0 0 1px ${token('color.border.selected')}`,
				},
			},
		},
	},
	/**
	 * Layout in view mode styles for selected state when advanced layouts experiment is on.
	 */
	layoutSelectedStylesForViewAdvanced: {
		'.ProseMirror': {
			'[data-layout-section], .layoutSectionView-content-wrap': {
				"&.selected, [data-empty-layout='true'], &:hover, &.selected.danger [data-layout-section], &.ak-editor-selected-node:not(.danger) [data-layout-section]":
					{
						'[data-layout-column]:not(:first-of-type) [data-layout-content]::before': {
							borderLeft: 0,
						},
					},

				'&.selected.danger [data-layout-section]': {
					boxShadow: `0 0 0 0 ${token('color.border.danger')}`,
				},

				'&.ak-editor-selected-node:not(.danger) [data-layout-section]': {
					boxShadow: `0 0 0 0 ${token('color.border.selected')}`,
				},
			},
		},
	},
	/**
	 * Layout in view mode styles for selected state when advanced layouts experiment is off.
	 */
	layoutSelectedStylesForViewNotAdvanced: {
		'.ProseMirror': {
			'[data-layout-section], .layoutSectionView-content-wrap': {
				'&.selected [data-layout-column], &:hover [data-layout-column]': {
					border: 0,
				},
			},
		},
	},
	/**
	 * Selected styles for layout when advanced layouts experiment is off
	 */
	// TODO: DSP-4441 - Remove the border styles below once design tokens have been enabled and fallbacks are no longer triggered.
	//       This is because the default state already uses the same token and, as such, the hover style won't change anything.
	//       https://product-fabric.atlassian.net/browse/DSP-4441
	layoutSelectedStylesNotAdvanced: {
		'.ProseMirror': {
			'[data-layout-section], .layoutSectionView-content-wrap': {
				// Shows the border when cursor is inside a layout
				'&.selected [data-layout-column], &:hover [data-layout-column]': {
					border: `1px solid ${token('color.border')}`,
				},

				'&.selected.danger [data-layout-column]': {
					backgroundColor: token('color.background.danger'),
					borderColor: token('color.border.danger'),
				},

				'&.ak-editor-selected-node:not(.danger)': {
					'[data-layout-column]': {
						...borderSelectionStyles,
						...blanketSelectionStyles,
						...hideNativeBrowserTextSelectionStyles,
						'::after': {
							backgroundColor: 'transparent',
						},
					},
				},
			},
		},
	},
	/*
	 * Layout in view mode styles, overrides over layout base styles
	 */
	layoutStylesForView: {
		'.ProseMirror': {
			'[data-layout-section]': {
				cursor: 'default',

				'[data-layout-column]': {
					border: 0,
				},
			},
		},
	},
	linkingVisualRefreshV1Styles: {
		// Constant variables here has been inlined in css from EditorContentContainer, if you need to make
		// update here, please also update packages/editor/editor-core/src/ui/EditorContentContainer/styles/smartCardStyles.ts
		// SmartCardSharedCssClassName.BLOCK_CARD_CONTAINER = 'blockCardView-content-wrap'
		// SmartCardSharedCssClassName.DATASOURCE_CONTAINER = 'datasourceView-content-wrap'
		'.blockCardView-content-wrap:not(.datasourceView-content-wrap)': {
			// EDM-11991: Fix list plugin adding padding to ADS AvatarGroup
			'ul, ol': {
				paddingLeft: 'inherit',
			},
		},
	},
	linkStyles: {
		'.ProseMirror a.blockLink': {
			display: 'block',
		},
		'.ProseMirror a[data-prosemirror-mark-name="link"]': {
			textDecoration: 'underline',
		},
		'.ProseMirror a[data-prosemirror-mark-name="link"]:hover': {
			textDecoration: 'none',
		},
	},
	listDangerStyles: {
		// only apply danger styles to the outermost list to avoid nested danger styles for lists within lists
		// eslint-disable-next-line @atlaskit/ui-styling-standard/no-unsafe-values
		['.ProseMirror :is(ul, ol, div[data-node-type="actionList"]):not(:is(ul, ol, div[data-node-type="actionList"]) *).ak-editor-selected-node:not(.ak-editor-selected-node *).danger']:
			{
				background: token('color.background.danger'),
			},
	},
	listItemHiddenMarkerStyles: {
		'.ProseMirror': {
			// Hide markers and remove spacing for wrapper list items (items containing only nested lists)
			// eslint-disable-next-line @atlaskit/ui-styling-standard/no-unsafe-selectors
			'li:has(> ul:only-child), li:has(> ol:only-child)': {
				// eslint-disable-next-line @atlaskit/ui-styling-standard/no-important-styles
				listStyleType: 'none !important',
				// eslint-disable-next-line @atlaskit/ui-styling-standard/no-important-styles
				marginTop: '0 !important',
				// eslint-disable-next-line @atlaskit/ui-styling-standard/no-important-styles
				marginBottom: '0 !important',
			},
			// Remove margin from nested lists inside wrapper list items to avoid double spacing
			// eslint-disable-next-line @atlaskit/ui-styling-standard/no-unsafe-selectors
			'li:has(> ul:only-child) > ul, li:has(> ol:only-child) > ol': {
				// eslint-disable-next-line @atlaskit/ui-styling-standard/no-important-styles
				marginTop: '0 !important',
			},
			// Remove top margin from nested taskLists not preceded by a sibling taskItem.
			// The base rule (tasksAndDecisionsStyles) sets margin-top on all nested taskLists,
			// but with flexible indentation a taskList can be the first child with no taskItem above.
			'div[data-task-list-local-id] > div[data-task-list-local-id]': {
				// eslint-disable-next-line @atlaskit/ui-styling-standard/no-important-styles
				marginTop: '0 !important',
			},
			// Restore margin when a nested taskList follows a taskItem
			'div[data-task-local-id] + div[data-task-list-local-id]': {
				// eslint-disable-next-line @atlaskit/ui-styling-standard/no-important-styles
				marginTop: `${token('space.050')} !important`,
			},
		},
	},
	listSelectedNodeStyles: {
		// only apply selected styles to the outermost list to avoid nested selection styles for lists within lists
		// eslint-disable-next-line @atlaskit/ui-styling-standard/no-unsafe-values
		['.ProseMirror :is(ul, ol, div[data-node-type="actionList"]):not(:is(ul, ol, div[data-node-type="actionList"]) *).ak-editor-selected-node:not(.ak-editor-selected-node *)']:
			{
				background: token('color.background.accent.blue.subtler'),
				WebkitUserSelect: 'text',

				'&::selection, *::selection': {
					backgroundColor: 'transparent',
				},

				'&::-moz-selection, *::-moz-selection': {
					backgroundColor: 'transparent',
				},
			},
	},
	listsStyles: {
		'.ProseMirror': {
			/* =============== INDENTATION SPACING ========= */

			'ul, ol': {
				boxSizing: 'border-box',
				paddingLeft: `var(--ed--list--item-counter--padding, 24px)`,
			},

			// Firefox does not handle empty block element inside li tag.
			// If there is not block element inside li tag,	then firefox sets inherited height to li
			// However, if there is any block element and if it's empty	(or has empty inline element) then
			// firefox sets li tag height to zero.
			//
			// More details at
			// https://product-fabric.atlassian.net/wiki/spaces/~455502413/pages/3149365890/ED-14110+Investigation
			'&.ua-firefox': {
				'ul, ol': {
					'li p:empty, li p > span:empty': {
						display: 'inline-block',
					},
				},
			},

			'.ak-ol, .ak-ul': {
				// Ensures list item content adheres to the list's margin instead
				// of filling the entire block row. This is important to allow
				// clicking interactive elements which are floated next to a list.
				//
				// For some history and context on this block, see PRs related to tickets.:
				// @see ED-6551 - original issue.
				// @see ED-7015 - follow up issue.
				// @see ED-7447 - flow-root change.
				//
				// @see https://css-tricks.com/display-flow-root/
				//
				// For older browsers the do not support flow-root. */
				// stylelint-disable declaration-block-no-duplicate-properties */
				display: 'flow-root',
				/* stylelint-enable declaration-block-no-duplicate-properties */
			},

			/* =============== INDENTATION AESTHETICS ========= */

			// We support nested lists up to six levels deep.

			/*  ======== LEGACY LISTS ======== */
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

			/* ======== PREDICTABLE LISTS ======== */
			"ol[data-indent-level='1'], ol[data-indent-level='4']": {
				listStyleType: 'decimal',
			},
			"ol[data-indent-level='2'], ol[data-indent-level='5']": {
				listStyleType: 'lower-alpha',
			},
			"ol[data-indent-level='3'], ol[data-indent-level='6']": {
				listStyleType: 'lower-roman',
			},
			"ul[data-indent-level='1'], ul[data-indent-level='4']": {
				listStyleType: 'disc',
			},
			"ul[data-indent-level='2'], ul[data-indent-level='5']": {
				listStyleType: 'circle',
			},
			"ul[data-indent-level='3'], ul[data-indent-level='6']": {
				listStyleType: 'square',
			},

			// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors -- Ignored via go/DSP-18766
			li: {
				position: 'relative',
				// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors, @atlaskit/ui-styling-standard/no-unsafe-selectors
				'& > p:not(:first-child)': {
					// eslint-disable-next-line @atlaskit/ui-styling-standard/no-unsafe-values
					margin: `${token('space.050')} 0 0 0`,
				},
				/* In SSR the above rule will apply to all p tags because first-child would be a style tag.
				The following rule resets the first p tag back to its original margin
				defined in packages/editor/editor-common/src/styles/shared/paragraph.ts */
				// eslint-disable-next-line @atlaskit/ui-styling-standard/no-unsafe-selectors
				'& > style:first-child + p': {
					// eslint-disable-next-line @atlaskit/ui-styling-standard/no-unsafe-values
					marginTop: blockNodesVerticalMargin,
				},
			},
		},
	},
	listsStylesMarginLayoutShiftFix: {
		// These styles are to fix a layout shift issue that occurs when aui-reset.less CSS is applied post-hydration.
		// It overrides the design system bundle.css list margins, which in turn causes the lists to shift vertically.
		'.ProseMirror': {
			// Root lists: 12px top margin (design system value), except first content child. Uses :not(:nth-child(1 of ...)) to exclude first content lists.
			// A more complex selector is used here to ensure this style is not applied to block quotes and panels, as they do not have a margin-top property already, and this will incorrectly add a margin-top to them.
			// This is unlike tables and expands, which do have a margin-top property already, and this style would not change their top margin, even without the :not(:nth-child(1 of ...)) selector.
			// This targeted approach reduces the blast radius of the fix. Instead of modifying numerous existing styles, we add this single selector until the issue with bundle.css & aui-reset.less is fixed.
			// eslint-disable-next-line @atlaskit/ui-styling-standard/no-unsafe-selectors, @atlaskit/ui-styling-standard/no-unsafe-values
			'ul:not(li > ul):not(:nth-child(1 of :not(style, .ProseMirror-gapcursor, .ProseMirror-widget, span))), ol:not(li > ol):not(:nth-child(1 of :not(style, .ProseMirror-gapcursor, .ProseMirror-widget, span)))':
				{
					marginTop: `var(--ds-space-150, 12px)`,
				},

			// Nested lists: 4px top margin (design system value)
			// Applies to both OL and UL nested inside list items
			'li > ol, li > ul': {
				marginTop: `var(--ds-space-050, 4px)`,
			},
		},
	},
	listsStylesSafariFix: {
		/* This prevents https://product-fabric.atlassian.net/browse/ED-20924 */
		// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors, @atlaskit/ui-styling-standard/no-unsafe-values, @atlaskit/ui-styling-standard/no-imported-style-values
		'.ProseMirror:not(.blockCardView-content-wrap) > li::before': {
			content: '" "',
			// eslint-disable-next-line @atlaskit/design-system/use-tokens-typography, @atlaskit/ui-styling-standard/no-imported-style-values, @atlaskit/ui-styling-standard/no-unsafe-values
			lineHeight: akEditorLineHeight,
		},
		// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors, @atlaskit/ui-styling-standard/no-unsafe-values, @atlaskit/ui-styling-standard/no-imported-style-values
		[listsStylesSafariFixMultiSelector]: {
			// eslint-disable-next-line @atlaskit/ui-styling-standard/no-important-styles, @atlaskit/ui-styling-standard/no-imported-style-values, @atlaskit/ui-styling-standard/no-unsafe-values
			marginTop: `-${akEditorLineHeight}em !important`,
		},
	},
	listsDenseStyles: {
		'.ProseMirror': {
			// Adjacent list items
			'li + li': {
				// eslint-disable-next-line @atlaskit/ui-styling-standard/no-unsafe-values, @atlaskit/ui-styling-standard/no-imported-style-values
				marginTop: `max(0px, calc((var(--ak-editor-base-font-size, ${akEditorFullPageDefaultFontSize}px) - ${akEditorFullPageDenseFontSize}px) * (4 / 3)))`,
			},
			// Nested lists directly under an li (unordered and ordered)
			'li > ul, li > ol, .ak-ul li > ul, .ak-ul li > ol, .ak-ol li > ul, .ak-ol li > ol': {
				// eslint-disable-next-line @atlaskit/ui-styling-standard/no-unsafe-values, @atlaskit/ui-styling-standard/no-imported-style-values
				marginTop: `max(0px, calc((var(--ak-editor-base-font-size, ${akEditorFullPageDefaultFontSize}px) - ${akEditorFullPageDenseFontSize}px) * (4 / 3)))`,
			},
		},
	},
	maxModeReizeFixStyles: {
		'.fabric-editor--max-width-mode': {
			'--ak-editor--line-length':
				'min(calc(100cqw - var(--ak-editor--large-gutter-padding) * 2), var(--ak-editor--max-width-layout-width))',
			/* in max width appearances it's not possible to rely on cqw because it doesn't account for the page scrollbar, which depends on users system settings */
			'--ak-editor--breakout-fallback-width': '100%',
			'--ak-editor--breakout-min-width': '0px',
		},
	},
	mediaAlignmentStyles: {
		'.fabric-editor-block-mark[class^="fabric-editor-align"]': {
			// eslint-disable-next-line @atlaskit/ui-styling-standard/no-important-styles
			clear: 'none',
		},
		'.fabric-editor-align-end': {
			textAlign: 'right',
		},
		'.fabric-editor-align-start': {
			textAlign: 'left',
		},
		'.fabric-editor-align-center': {
			textAlign: 'center',
		},
		'.fabric-editor--full-width-mode': {
			'.pm-table-container': {
				'.code-block, .extension-container, .multiBodiedExtension--container': {
					maxWidth: '100%',
				},
			},
		},
	},
	mediaCaptionStyles: {
		'.mediaSingleView-content-wrap': {
			'span#caption-placeholder': {
				// eslint-disable-next-line @atlaskit/design-system/use-tokens-typography
				fontSize: 'var(--ak-editor-base-font-size)',
			},
		},
	},
	mediaDangerStyles: {
		'.ProseMirror': {
			'.mediaInlineView-content-wrap.ak-editor-selected-node.danger': {
				' .media-inline-image-wrapper': {
					// eslint-disable-next-line @atlaskit/ui-styling-standard/no-unsafe-values, @atlaskit/design-system/no-invalid-css-map
					...dangerBorderStyles,
				},
				'>span> span[role="button"]': {
					// eslint-disable-next-line @atlaskit/ui-styling-standard/no-unsafe-values, @atlaskit/design-system/no-invalid-css-map
					...dangerBorderStyles,
				},
			},

			'.mediaGroupView-content-wrap.danger #newFileExperienceWrapper': {
				// eslint-disable-next-line @atlaskit/ui-styling-standard/no-unsafe-values, @atlaskit/design-system/no-invalid-css-map
				...dangerBorderStyles,
			},
		},
	},
	mediaGroupStyles: {
		'.mediaGroupView-content-wrap ul': {
			padding: 0,
		},
	},
	mediaStyles: {
		'.ProseMirror': {
			'li .rich-media-item': {
				margin: 0,
			},

			'&.ua-chrome li > .mediaSingleView-content-wrap::before': {
				content: "''",
				display: 'block',
				height: 0,
			},

			'&.ua-firefox': {
				'.mediaSingleView-content-wrap': {
					userSelect: 'none',
				},
				'.captionView-content-wrap': {
					userSelect: 'text',
				},
			},

			".mediaSingleView-content-wrap[layout^='wrap-']": {
				position: 'relative',
				zIndex: 2,
				maxWidth: '100%',
				clear: 'inherit',
			},

			".mediaSingleView-content-wrap[layout='center']": {
				clear: 'both',
			},

			'table .rich-media-item': {
				marginTop: token('space.150'),
				marginBottom: token('space.150'),
				clear: 'both',

				'&.image-wrap-left[data-layout], &.image-wrap-right[data-layout]': {
					clear: 'none',

					'&:first-child': {
						marginTop: token('space.150'),
					},
				},
			},

			'.rich-media-item.image-wrap-right + .rich-media-item.image-wrap-left': {
				clear: 'both',
			},

			'.rich-media-item.image-wrap-left + .rich-media-item.image-wrap-right, .rich-media-item.image-wrap-right + .rich-media-item.image-wrap-left, .rich-media-item.image-wrap-left + .rich-media-item.image-wrap-left, .rich-media-item.image-wrap-right + .rich-media-item.image-wrap-right':
				{
					marginRight: 0,
					marginLeft: 0,
				},

			'@media all and (max-width: 410px)': {
				"div.mediaSingleView-content-wrap[layout='wrap-left'], div.mediaSingleView-content-wrap[data-layout='wrap-left'], div.mediaSingleView-content-wrap[layout='wrap-right'], div.mediaSingleView-content-wrap[data-layout='wrap-right']":
					{
						float: 'none',
						overflow: 'auto',
						margin: `${token('space.150')} 0`,
					},
			},

			"& [layout='full-width'] .rich-media-item, & [layout='wide'] .rich-media-item": {
				// eslint-disable-next-line @atlaskit/design-system/use-tokens-space
				marginLeft: '50%',
				transform: 'translateX(-50%)',
			},

			".media-extended-resize-experience[layout^='wrap-']": {
				// eslint-disable-next-line @atlaskit/ui-styling-standard/no-important-styles
				overflow: 'visible !important',
			},

			"& [layout^='wrap-'] + [layout^='wrap-']": {
				clear: 'none',

				"& + p, & + div[class^='fabric-editor-align'], & + ul, & + ol, & + h1, & + h2, & + h3, & + h4, & + h5, & + h6":
					{
						// eslint-disable-next-line @atlaskit/ui-styling-standard/no-important-styles
						clear: 'both !important' as 'both',
					},

				'& .rich-media-item': {
					marginLeft: 0,
					marginRight: 0,
				},
			},

			'.media-inline-image-wrapper': {
				height: 22,
				transform: 'translateY(-2px)',
			},

			h1: {
				"> .mediaInlineView-content-wrap > .media-inline-image-wrapper, > :is(a, span[data-mark-type='border']) .mediaInlineView-content-wrap > .media-inline-image-wrapper, > .media-inline-image-wrapper, > :is(a, span[data-mark-type='border']) .media-inline-image-wrapper":
					{
						height: 36,
						transform: 'translateY(-3px)',
					},
			},

			h2: {
				"> .mediaInlineView-content-wrap > .media-inline-image-wrapper, > :is(a, span[data-mark-type='border']) .mediaInlineView-content-wrap > .media-inline-image-wrapper, > .media-inline-image-wrapper, > :is(a, span[data-mark-type='border']) .media-inline-image-wrapper":
					{
						height: 31,
						transform: 'translateY(-3px)',
					},
			},

			h3: {
				"> .mediaInlineView-content-wrap > .media-inline-image-wrapper, > :is(a, span[data-mark-type='border']) .mediaInlineView-content-wrap > .media-inline-image-wrapper, > .media-inline-image-wrapper, > :is(a, span[data-mark-type='border']) .media-inline-image-wrapper":
					{
						height: 25,
						transform: 'translateY(-2px)',
					},
			},

			h4: {
				"> .mediaInlineView-content-wrap > .media-inline-image-wrapper, > :is(a, span[data-mark-type='border']) .mediaInlineView-content-wrap > .media-inline-image-wrapper, > .media-inline-image-wrapper, > :is(a, span[data-mark-type='border']) .media-inline-image-wrapper":
					{
						height: 23,
						transform: 'translateY(-2px)',
					},
			},

			h5: {
				"> .mediaInlineView-content-wrap > .media-inline-image-wrapper, > :is(a, span[data-mark-type='border']) .mediaInlineView-content-wrap > .media-inline-image-wrapper, > .media-inline-image-wrapper, > :is(a, span[data-mark-type='border']) .media-inline-image-wrapper":
					{
						height: 20,
						transform: 'translateY(-2px)',
					},
			},

			h6: {
				"> .mediaInlineView-content-wrap > .media-inline-image-wrapper, > :is(a, span[data-mark-type='border']) .mediaInlineView-content-wrap > .media-inline-image-wrapper, > .media-inline-image-wrapper, > :is(a, span[data-mark-type='border']) .media-inline-image-wrapper":
					{
						height: 18,
						transform: 'translateY(-2px)',
					},
			},

			".mediaSingleView-content-wrap[layout='wrap-left']": {
				float: 'left',
			},

			".mediaSingleView-content-wrap[layout='wrap-right']": {
				float: 'right',
			},

			".mediaSingleView-content-wrap[layout='wrap-right'] + .mediaSingleView-content-wrap[layout='wrap-left']":
				{
					clear: 'both',
				},

			'& > .mediaSingleView-content-wrap': {
				'.richMedia-resize-handle-right': {
					// eslint-disable-next-line @atlaskit/design-system/use-tokens-space
					marginRight: '-12px',
				},
				'.richMedia-resize-handle-left': {
					// eslint-disable-next-line @atlaskit/design-system/use-tokens-space
					marginLeft: '-12px',
				},
			},
		},

		'.pm-alt-text-alt-text-floating-toolbar': {
			padding: 0,
		},

		'.richMedia-resize-handle-right, .richMedia-resize-handle-left': {
			display: 'flex',
			flexDirection: 'column',
			justifyContent: 'center',
		},

		'.richMedia-resize-handle-right': {
			alignItems: 'flex-end',
			paddingRight: token('space.150'),
			// eslint-disable-next-line @atlaskit/design-system/use-tokens-space
			marginRight: '-4px',
		},

		'.richMedia-resize-handle-left': {
			alignItems: 'flex-start',
			paddingLeft: token('space.150'),
			// eslint-disable-next-line @atlaskit/design-system/use-tokens-space
			marginLeft: '-4px',
		},

		'.richMedia-resize-handle-right::after, .richMedia-resize-handle-left::after': {
			content: "' '",
			display: 'flex',
			width: 3,
			height: 64,
			borderRadius: token('radius.medium'),
		},

		'.rich-media-item:hover .richMedia-resize-handle-left::after, .rich-media-item:hover .richMedia-resize-handle-right::after':
			{
				background: token('color.border'),
			},

		'.ak-editor-selected-node .richMedia-resize-handle-right::after, .ak-editor-selected-node .richMedia-resize-handle-left::after, .rich-media-item .richMedia-resize-handle-right:hover::after, .rich-media-item .richMedia-resize-handle-left:hover::after, .rich-media-item.is-resizing .richMedia-resize-handle-right::after, .rich-media-item.is-resizing .richMedia-resize-handle-left::after':
			{
				background: token('color.border.focused'),
			},

		'.__resizable_base__': {
			// eslint-disable-next-line @atlaskit/ui-styling-standard/no-important-styles
			left: 'unset !important',
			// eslint-disable-next-line @atlaskit/ui-styling-standard/no-important-styles
			width: 'auto !important',
			// eslint-disable-next-line @atlaskit/ui-styling-standard/no-important-styles
			height: 'auto !important',
		},

		'.danger > div > div > .media-card-frame, .danger > span > a': {
			backgroundColor: token('color.background.danger'),
			boxShadow: `0px 0px 0px 2px, ${token('color.border.danger')}`,
			transition: 'background-color 0s, box-shadow 0s',
		},

		'.danger': {
			'.rich-media-item .media-file-card-view::after': {
				border: `1px solid ${token('color.border.danger')}`,
			},

			'.rich-media-item .media-card-inline-player::after': {
				border: `1px solid ${token('color.border.danger')}`,
			},

			'.rich-media-item .new-file-experience-wrapper': {
				// eslint-disable-next-line @atlaskit/ui-styling-standard/no-important-styles
				boxShadow: `0 0 0 1px ${token('color.border.danger')} !important`,
			},

			'.richMedia-resize-handle-right::after, .richMedia-resize-handle-left::after': {
				// eslint-disable-next-line @atlaskit/ui-styling-standard/no-important-styles
				background: `${token('color.icon.danger')} !important`,
			},

			'.resizer-handle-thumb': {
				// eslint-disable-next-line @atlaskit/ui-styling-standard/no-important-styles
				background: `${token('color.icon.danger')} !important`,
			},

			'div div .media-card-frame, .inlineCardView-content-wrap > span > a': {
				backgroundColor: `${token('color.blanket.danger')}`,
				transition: `background-color 0s`,
			},

			'div div .media-card-frame::after': {
				boxShadow: 'none',
			},
		},

		'.warning': {
			'.rich-media-item .media-file-card-view::after': {
				border: `1px solid ${token('color.border.warning')}`,
			},

			'.rich-media-item .media-card-inline-player::after': {
				border: `1px solid ${token('color.border.warning')}`,
			},

			'.rich-media-item .new-file-experience-wrapper': {
				// eslint-disable-next-line @atlaskit/ui-styling-standard/no-important-styles
				boxShadow: `0 0 0 1px ${token('color.border.warning')} !important`,
			},

			'.resizer-handle-thumb': {
				// eslint-disable-next-line @atlaskit/ui-styling-standard/no-important-styles
				background: `${token('color.icon.warning')} !important`,
			},
		},

		'.media-filmstrip-list-item': {
			cursor: 'pointer',
		},

		'.mediaGroupView-content-wrap.ak-editor-selected-node #newFileExperienceWrapper': {
			boxShadow: `0 0 0 1px ${token('color.border.selected')}`,
		},

		'.ak-editor-no-interaction #newFileExperienceWrapper': {
			boxShadow: 'none',
		},
	},
	mentionDangerStyles: {
		// eslint-disable-next-line @atlaskit/ui-styling-standard/no-unsafe-values
		'.ak-editor-selected-node:not(.search-match-block).danger': {
			'> .editor-mention-primitive, > .editor-mention-primitive.mention-self, > .editor-mention-primitive.mention-restricted':
				{
					...dangerBorderStyles,
					...dangerBackgroundStyles,
				},
		},
	},
	mentionNodeStyles: {
		'.editor-mention-primitive': {
			display: 'inline',
			borderRadius: token('radius.full'),
			cursor: 'pointer',
			padding: '1px 0.3em 1px 0.23em',
			// To match `packages/elements/mention/src/components/Mention/PrimitiveMention.tsx` implementation
			// we match the line height exactly
			// eslint-disable-next-line @atlaskit/design-system/use-tokens-typography
			lineHeight: '1.714',
			fontWeight: token('font.weight.regular'),
			wordBreak: 'break-word',
			background: token('color.background.neutral'),
			border: '1px solid transparent',
			color: token('color.text.subtle'),

			'&:hover': {
				background: token('color.background.neutral.hovered'),
			},
			'&:active': {
				background: token('color.background.neutral.pressed'),
			},
		},

		'.editor-mention-primitive.mention-restricted': {
			background: 'transparent',
			border: `1px solid ${token('color.border.bold')}`,
			color: token('color.text'),

			'&:hover': {
				background: 'transparent',
			},
			'&:active': {
				background: 'transparent',
			},
		},

		'.editor-mention-primitive.mention-self': {
			background: token('color.background.brand.bold'),
			border: '1px solid transparent',
			color: token('color.text.inverse'),

			'&:hover': {
				background: token('color.background.brand.bold.hovered'),
			},
			'&:active': {
				background: token('color.background.brand.bold.pressed'),
			},
		},
	},
	mentionsSelectionStyles: {
		'.danger': {
			'.editor-mention-primitive': {
				// eslint-disable-next-line @atlaskit/ui-styling-standard/no-unsafe-values, @atlaskit/ui-styling-standard/no-imported-style-values
				boxShadow: `0 0 0 1px ${token('color.border.danger')}`,
				backgroundColor: token('color.background.danger'),
			},
		},
		// eslint-disable-next-line @atlaskit/ui-styling-standard/no-unsafe-values
		'.ak-editor-selected-node': {
			'> .editor-mention-primitive, > .editor-mention-primitive.mention-self, > .editor-mention-primitive.mention-restricted':
				{
					...boxShadowSelectionStyles,
					...backgroundSelectionStyles,
					...hideNativeBrowserTextSelectionStyles,
					...mentionsSelectedColor,
					// Explicitly override hover/active states to prevent mentionNodeStyles hover
					// from winning over the selection background in Compiled's atomic CSS (source order issue)
					'&:hover, &:active': {
						...backgroundSelectionStyles,
					},
				},
		},
	},
	mentionsSelectionStylesWithSearchMatch: {
		'.danger': {
			'.editor-mention-primitive': {
				// eslint-disable-next-line @atlaskit/ui-styling-standard/no-unsafe-values, @atlaskit/ui-styling-standard/no-imported-style-values
				boxShadow: `0 0 0 1px ${token('color.border.danger')}`,
				backgroundColor: token('color.background.danger'),
			},
		},
		// eslint-disable-next-line @atlaskit/ui-styling-standard/no-unsafe-values
		'.ak-editor-selected-node': {
			'> .editor-mention-primitive, > .editor-mention-primitive.mention-self, > .editor-mention-primitive.mention-restricted':
				{
					...backgroundSelectionStyles,
					...hideNativeBrowserTextSelectionStyles,
					...mentionsSelectedColor,
					// Explicitly override hover/active states to prevent mentionNodeStyles hover
					// from winning over the selection background in Compiled's atomic CSS (source order issue)
					'&:hover, &:active': {
						...backgroundSelectionStyles,
					},
				},
		},
		// eslint-disable-next-line @atlaskit/ui-styling-standard/no-unsafe-values
		'.ak-editor-selected-node:not(.search-match-block)': {
			'> .editor-mention-primitive, > .editor-mention-primitive.mention-self, > .editor-mention-primitive.mention-restricted':
				{
					...boxShadowSelectionStyles,
				},
		},
	},
	mentionsStyles: {
		// eslint-disable-next-line @atlaskit/ui-styling-standard/no-unsafe-values
		'.mentionView-content-wrap': {
			// TODO: ED-28075 - refactor selection styles to unblock Compiled CSS migration
			// eslint-disable-next-line @atlaskit/ui-styling-standard/no-unsafe-values
			'&.ak-editor-selected-node [data-mention-id] > span': {
				...boxShadowSelectionStyles,
				...backgroundSelectionStyles,
				...mentionsSelectedColor,
			},
		},
		'.danger': {
			// eslint-disable-next-line @atlaskit/ui-styling-standard/no-unsafe-values
			'.mentionView-content-wrap.ak-editor-selected-node': {
				'> span > span > span': {
					// eslint-disable-next-line @atlaskit/ui-styling-standard/no-unsafe-values, @atlaskit/ui-styling-standard/no-imported-style-values
					boxShadow: `0 0 0 1px ${token('color.border.danger')}`,
					backgroundColor: token('color.background.danger'),
				},
			},
			// eslint-disable-next-line @atlaskit/ui-styling-standard/no-unsafe-values
			'.mentionView-content-wrap > span > span > span': {
				backgroundColor: token('color.background.neutral'),
				color: token('color.text.subtle'),
			},
		},
	},
	nestedPanelBorderStylesMixin: {
		'.ProseMirror': {
			'.ak-editor-panel': {
				// Support nested panel
				'.ak-editor-panel__content .ak-editor-panel': {
					border: `1px solid ${token('color.border')}`,
				},
			},
		},
	},
	nestedPanelDangerStyles: {
		'.ProseMirror': {
			/* Danger when nested node */
			'.danger .ak-editor-panel': {
				'&[data-panel-type="info"]': {
					backgroundColor: token('color.blanket.danger'),

					'.ak-editor-panel__icon[data-panel-type="info"]': {
						color: `${token('color.icon.danger')}`,
					},
				},
				'&[data-panel-type="note"]': {
					backgroundColor: token('color.blanket.danger'),

					'.ak-editor-panel__icon[data-panel-type="note"]': {
						color: `${token('color.icon.danger')}`,
					},
				},
				'&[data-panel-type="success"]': {
					backgroundColor: token('color.blanket.danger'),

					'.ak-editor-panel__icon[data-panel-type="success"]': {
						color: `${token('color.icon.danger')}`,
					},
				},
				'&[data-panel-type="warning"]': {
					backgroundColor: token('color.blanket.danger'),

					'.ak-editor-panel__icon[data-panel-type="warning"]': {
						color: `${token('color.icon.danger')}`,
					},
				},
				'&[data-panel-type="error"]': {
					backgroundColor: token('color.blanket.danger'),

					'.ak-editor-panel__icon[data-panel-type="error"]': {
						color: `${token('color.icon.danger')}`,
					},
				},
			},
		},
	},
	panelStyles: {
		'.ProseMirror': {
			'.ak-editor-panel': {
				cursor: 'pointer',

				/* Danger when top level node */
				'&.danger': {
					boxShadow: `0 0 0 1px ${token('color.border.danger')}`,
					// eslint-disable-next-line @atlaskit/ui-styling-standard/no-important-styles
					backgroundColor: `${token('color.background.danger')} !important`,

					'.ak-editor-panel__icon': {
						// eslint-disable-next-line @atlaskit/ui-styling-standard/no-important-styles
						color: `${token('color.icon.danger')} !important`,
					},
				},

				// panelSharedStyles()
				// panelSharedStylesWithoutPrefix()
				borderRadius: token('radius.small', '3px'),
				margin: `${token('space.150')} 0 0`,
				paddingTop: token('space.100'),
				paddingRight: token('space.200'),
				paddingBottom: token('space.100'),
				paddingLeft: token('space.100'),
				minWidth: '48px',
				display: 'flex',
				position: 'relative',
				alignItems: 'normal',
				wordBreak: 'break-word',

				// mainDynamicStyles(PanelType.INFO)
				// > getPanelTypeBackground(PanelType.INFO)
				backgroundColor: token('color.background.accent.blue.subtlest'),
				color: 'inherit',

				'.ak-editor-panel__icon': {
					flexShrink: 0,
					height: token('space.300'),
					width: token('space.300'),
					boxSizing: 'content-box',
					paddingRight: token('space.100'),
					textAlign: 'center',
					userSelect: 'none',
					MozUserSelect: 'none',
					WebkitUserSelect: 'none',
					msUserSelect: 'none',
					// eslint-disable-next-line @atlaskit/design-system/use-tokens-space
					marginTop: '0.1em',

					'> span': {
						verticalAlign: 'middle',
						display: 'inline-flex',
					},

					'.emoji-common-emoji-sprite': {
						verticalAlign: '-2px', // -(8*3-20)/2 [px]
					},

					'.emoji-common-emoji-image': {
						verticalAlign: '-3px', // panelEmojiSpriteVerticalAlignment - 1 [px]

						/* Vertical align only works for inline-block elements in Firefox */
						// eslint-disable-next-line @atlaskit/ui-styling-standard/no-unsafe-selectors
						'@-moz-document url-prefix()': {
							img: {
								display: 'inline-block',
							},
						},
					},
				},

				'.ak-editor-panel__content': {
					margin: `${token('space.025')} 0 ${token('space.025')}`,
					flex: '1 0 0',
					/*
					https://ishadeed.com/article/min-max-css/#setting-min-width-to-zero-with-flexbox
					The default value for min-width is auto, which is computed to zero.
					When an element is a flex item, the value of min-width doesn’t compute to zero.
					The minimum size of a flex item is equal to the size of its contents.
				*/
					minWidth: 0,
				},

				'&[data-panel-type="note"]': {
					// mainDynamicStyles(PanelType.NOTE)
					backgroundColor: token('color.background.accent.purple.subtlest'),
					color: 'inherit',
				},
				'&[data-panel-type="tip"]': {
					// mainDynamicStyles(PanelType.TIP)
					backgroundColor: token('color.background.accent.green.subtlest'),
					color: 'inherit',
				},
				'&[data-panel-type="warning"]': {
					// mainDynamicStyles(PanelType.WARNING)
					backgroundColor: token('color.background.accent.yellow.subtlest'),
					color: 'inherit',
				},
				'&[data-panel-type="error"]': {
					// mainDynamicStyles(PanelType.ERROR)
					backgroundColor: token('color.background.accent.red.subtlest'),
					color: 'inherit',
				},
				'&[data-panel-type="success"]': {
					// mainDynamicStyles(PanelType.SUCCESS)
					backgroundColor: token('color.background.accent.green.subtlest'),
					color: 'inherit',
				},
			},

			'.ak-editor-panel__content': {
				cursor: 'text',
			},

			/* Danger when nested node */
			'.danger .ak-editor-panel': {
				'&[data-panel-type]': {
					backgroundColor: token('color.blanket.danger'),

					'.ak-editor-panel__icon': {
						color: token('color.icon.danger'),
					},
				},
			},
		},

		// eslint-disable-next-line @atlaskit/ui-styling-standard/no-unsafe-selectors
		'.ak-editor-panel.ak-editor-selected-node:not(.danger)': {
			// getSelectionStyles([SelectionStyle.BoxShadow, SelectionStyle.Blanket]),
			// SelectionStyle.BoxShadow
			boxShadow: `0 0 0 1px ${token('color.border.selected')}`,
			borderColor: 'transparent',
			// SelectionStyle.Blanket
			position: 'relative',
			// Fixes ED-9263, where emoji or inline card in panel makes selection go outside the panel
			// in Safari. Looks like it's caused by user-select: all in the emoji element
			WebkitUserSelect: 'text',
			'&::before': {
				position: 'absolute',
				content: '""',
				left: 0,
				right: 0,
				top: 0,
				bottom: 0,
				width: '100%',
				pointerEvents: 'none',
				zIndex: 12, // akEditorSmallZIndex
				backgroundColor: token('color.blanket.selected'),
			},
			// hideNativeSelectionStyles
			'&::selection, *::selection': {
				backgroundColor: 'transparent',
			},
			// eslint-disable-next-line @atlaskit/ui-styling-standard/no-unsafe-selectors
			'&::-moz-selection, *::-moz-selection': {
				backgroundColor: 'transparent',
			},
		},
	},
	panelStylesMixin: {
		'.ProseMirror': {
			'.ak-editor-panel': {
				'&[data-panel-type="info"]': {
					// getIconStyles(PanelType.INFO),
					'.ak-editor-panel__icon[data-panel-type="info"]': {
						color: token('color.icon.information'),
					},
				},
				'&[data-panel-type="note"]': {
					// getIconStyles(PanelType.NOTE),
					'.ak-editor-panel__icon[data-panel-type="note"]': {
						color: token('color.icon.discovery'),
					},
				},
				'&[data-panel-type="tip"]': {
					// getIconStyles(PanelType.TIP),
					'.ak-editor-panel__icon[data-panel-type="tip"]': {
						color: token('color.icon.success'),
					},
				},
				'&[data-panel-type="warning"]': {
					// getIconStyles(PanelType.WARNING),
					'.ak-editor-panel__icon[data-panel-type="warning"]': {
						color: token('color.icon.warning'),
					},
				},
				'&[data-panel-type="error"]': {
					// getIconStyles(PanelType.ERROR),
					'.ak-editor-panel__icon[data-panel-type="error"]': {
						color: token('color.icon.danger'),
					},
				},
				'&[data-panel-type="success"]': {
					// getIconStyles(PanelType.SUCCESS),
					'.ak-editor-panel__icon[data-panel-type="success"]': {
						color: token('color.icon.success'),
					},
				},
			},
		},
	},
	panelStylesMixin_fg_platform_editor_nested_dnd_styles_changes: {
		'.ProseMirror': {
			'.ak-editor-panel': {
				'&.ak-editor-panel__no-icon': {
					paddingRight: token('space.150'),
					paddingLeft: token('space.150'),
				},
			},
		},
		'.ak-editor-content-area.appearance-full-page .ProseMirror': {
			'.ak-editor-panel .ak-editor-panel__icon': {
				paddingRight: token('space.150'),
			},
			'.ak-editor-panel.ak-editor-panel__no-icon': {
				paddingLeft: token('space.250'),
				paddingRight: token('space.250'),
			},
		},
		/* Don't want extra padding for inline editor (nested) */
		'.ak-editor-content-area .ak-editor-content-area .ProseMirror': {
			'.ak-editor-panel .ak-editor-panel__icon': {
				paddingRight: token('space.100'),
			},
			'.ak-editor-panel.ak-editor-panel__no-icon': {
				paddingRight: token('space.150'),
				paddingLeft: token('space.150'),
			},
		},
	},
	panelViewStyles: {
		'.panelView-content-wrap': {
			boxSizing: 'border-box',
		},
	},
	paragraphStylesOld: {
		'.ProseMirror p': {
			// eslint-disable-next-line @atlaskit/design-system/use-tokens-typography
			fontSize: '1em',
			// eslint-disable-next-line @atlaskit/design-system/use-tokens-typography
			lineHeight: 1.714,
			fontWeight: token('font.weight.regular'),
			marginTop: blockNodesVerticalMargin,
			marginBottom: 0,
			// eslint-disable-next-line @atlaskit/design-system/use-tokens-typography
			letterSpacing: '-0.005em',
		},
	},
	// When both platform_editor_content_mode_button_mvp & confluence_compact_text_format are cleaned up,
	// simplify the name/ use the other paragraph style name
	paragraphStylesOldWithScaledMargin: {
		'.ProseMirror p': {
			// eslint-disable-next-line @atlaskit/design-system/use-tokens-typography
			fontSize: '1em',
			// eslint-disable-next-line @atlaskit/design-system/use-tokens-typography
			lineHeight: 1.714,
			fontWeight: token('font.weight.regular'),
			marginTop: scaledBlockNodesVerticalMargin,
			marginBottom: 0,
			// eslint-disable-next-line @atlaskit/design-system/use-tokens-typography
			letterSpacing: '-0.005em',
		},
	},
	paragraphStylesUGCRefreshed: {
		'.ProseMirror p': {
			// The `editor.font.body` token is used for the UGC typography theme.
			// We don't use `editorUGCToken('editor.font.body')` here because we want to build this styles statically.
			// See platform/packages/editor/editor-common/src/ugc-tokens/get-editor-ugc-token.tsx
			// eslint-disable-next-line @atlaskit/design-system/use-tokens-typography
			font: 'normal 400 1em/1.714 "Atlassian Sans", ui-sans-serif, -apple-system, BlinkMacSystemFont, "Segoe UI", Ubuntu, "Helvetica Neue", sans-serif',
			marginTop: blockNodesVerticalMargin,
			marginBottom: 0,
		},
	},
	// When both platform_editor_content_mode_button_mvp & confluence_compact_text_format are cleaned up,
	// simplify the name/ use the other paragraph style name
	paragraphStylesWithScaledMargin: {
		'.ProseMirror p': {
			// The `editor.font.body` token is used for the UGC typography theme.
			// We don't use `editorUGCToken('editor.font.body')` here because we want to build this styles statically.
			// See platform/packages/editor/editor-common/src/ugc-tokens/get-editor-ugc-token.tsx
			// eslint-disable-next-line @atlaskit/design-system/use-tokens-typography
			font: 'normal 400 1em/1.714 "Atlassian Sans", ui-sans-serif, -apple-system, BlinkMacSystemFont, "Segoe UI", Ubuntu, "Helvetica Neue", sans-serif',
			marginTop: scaledBlockNodesVerticalMargin,
			marginBottom: 0,
		},
	},
	placeholderOverflowStyles: {
		// eslint-disable-next-line @atlaskit/ui-styling-standard/no-unsafe-selectors
		'.ProseMirror p:has(.placeholder-decoration-hide-overflow)': {
			overflow: 'hidden',
			whiteSpace: 'nowrap',
			textOverflow: 'ellipsis',
		},
	},
	placeholderStyles: {
		'.ProseMirror .placeholder-decoration': {
			color: token('color.text.subtlest'),
			width: '100%',
			pointerEvents: 'none',
			userSelect: 'none',
			'.placeholder-android': {
				pointerEvents: 'none',
				outline: 'none',
				userSelect: 'none',
				position: 'absolute',
			},
		},
		'.ProseMirror .placeholder-decoration-fade-in': {
			animationName: placeholderFadeInKeyframes,
			animationDuration: `300ms`,
			animationTimingFunction: `ease-out`,
			animationFillMode: `forwards`,
		},
	},
	placeholderTextStyles: {
		'.ProseMirror span[data-placeholder]': {
			color: token('color.text.subtlest'),
			display: 'inline',
		},
		'.ProseMirror span.pm-placeholder': {
			display: 'inline',
			color: token('color.text.subtlest'),
		},
		'.ProseMirror span.pm-placeholder__text': {
			display: 'inline',
			color: token('color.text.subtlest'),
		},
		'.ProseMirror span.pm-placeholder.ak-editor-selected-node': {
			...backgroundSelectionStyles,
			...hideNativeBrowserTextSelectionStyles,
		},
		'.ProseMirror span.pm-placeholder__text[data-placeholder]::after': {
			color: token('color.text.subtlest'),
			cursor: 'text',
			content: 'attr(data-placeholder)',
			display: 'inline',
		},
		'.ProseMirror': {
			'.ProseMirror-fake-text-cursor': {
				display: 'inline',
				pointerEvents: 'none',
				position: 'relative',
			},
			'.ProseMirror-fake-text-cursor::after': {
				content: '""',
				display: 'inline',
				top: 0,
				position: 'absolute',
				borderRight: `1px solid ${token('color.border')}`,
			},
			'.ProseMirror-fake-text-selection': {
				display: 'inline',
				pointerEvents: 'none',
				position: 'relative',
				// Follow the system highlight colour to match native text selection
				backgroundColor: 'Highlight',
				// We should also match the text colour to the system highlight text colour.
				// That way if the system highlight background is dark, the text will still be readable.
				color: 'HighlightText',
			},
		},
	},
	// As part of controls work, we add placeholder `Search` to quick insert command
	// This style is to prevent `/Search` being wrapped if it's triggered at the end of the line
	placeholderWrapStyles: {
		// eslint-disable-next-line @atlaskit/ui-styling-standard/no-unsafe-selectors
		'.ProseMirror mark[data-type-ahead-query="true"]:has(.placeholder-decoration-wrap)': {
			whiteSpace: 'nowrap',
		},
	},
	pragmaticResizerStyles: {
		'.fabric-editor-breakout-mark': {
			'&:has([data-prosemirror-node-name="expand"]), &:has([data-prosemirror-node-name="layoutSection"])':
				{
					'> .pm-breakout-resize-handle-container--left': {
						left: '-25px',
					},
					'> .pm-breakout-resize-handle-container--right': {
						right: '-25px',
					},
				},
			'&:has([data-prosemirror-node-name="expand"])': {
				'> .pm-breakout-resize-handle-container': {
					height: 'calc(100% - 4px)',
				},
			},
			'&:has([data-prosemirror-node-name="layoutSection"])': {
				'> .pm-breakout-resize-handle-container': {
					height: 'calc(100% - 8px)',
				},
			},
			'&:has(.first-node-in-document)': {
				'> .pm-breakout-resize-handle-container': {
					height: '100%',
				},
			},
		},
		'.pm-breakout-resize-handle-container': {
			position: 'relative',
			alignSelf: 'end',
			gridRow: 1,
			gridColumn: 1,
			height: '100%',
			width: 7,
		},
		'.pm-breakout-resize-handle-container--left': {
			justifySelf: 'start',
		},
		'.pm-breakout-resize-handle-container--right': {
			justifySelf: 'end',
		},
		'.pm-breakout-resize-handle-rail': {
			position: 'relative',
			display: 'flex',
			alignItems: 'center',
			justifyContent: 'center',
			height: '100%',
			cursor: 'col-resize',
			borderRadius: token('radius.small'),
			transition: 'background-color 0.2s, visibility 0.2s, opacity 0.2s',
			zIndex: 2,
			opacity: 0,
			'&:hover': {
				background: token('color.background.selected'),
				'.pm-breakout-resize-handle-thumb': {
					background: token('color.border.focused'),
				},
			},
		},
		'.pm-breakout-resize-handle-container--active': {
			background: token('color.background.selected'),
			'.pm-breakout-resize-handle-thumb': {
				background: token('color.border.focused'),
			},
		},
		'.pm-breakout-resize-handle-hit-box': {
			position: 'absolute',
			top: 0,
			bottom: 0,
			left: -20,
			right: -20,
			zIndex: 0,
		},
		'.pm-breakout-resize-handle-thumb': {
			minWidth: 3,
			height: 'clamp(27px, calc(100% - 32px), 96px)',
			background: token('color.border'),
			borderRadius: token('radius.medium'),
			position: 'sticky',
			top: token('space.150'),
			bottom: token('space.150'),
		},
	},
	pragmaticResizerStylesCodeBlockLegacy: {
		'.fabric-editor-breakout-mark': {
			'&:has([data-prosemirror-node-name="codeBlock"])': {
				'> .pm-breakout-resize-handle-container--left': {
					left: '-5px',
				},
				'> .pm-breakout-resize-handle-container--right': {
					right: '-5px',
				},
				'> .pm-breakout-resize-handle-container': {
					height: 'calc(100% - 12px)',
				},
			},
			'&:has(.first-node-in-document)': {
				'> .pm-breakout-resize-handle-container': {
					height: '100%',
				},
			},
		},
	},
	pragmaticResizerStylesCodeBlockSyncedBlockPatch: {
		'.fabric-editor-breakout-mark': {
			'&:has(> .fabric-editor-breakout-mark-dom > [data-prosemirror-node-name="codeBlock"])': {
				'> .pm-breakout-resize-handle-container--left': {
					left: '-5px',
				},
				'> .pm-breakout-resize-handle-container--right': {
					right: '-5px',
				},
				'> .pm-breakout-resize-handle-container': {
					height: 'calc(100% - 12px)',
				},
			},
			'&:has(.first-node-in-document.first-node-in-document)': {
				'> .pm-breakout-resize-handle-container': {
					height: '100%',
				},
			},
		},
	},
	pragmaticResizerStylesForTooltip: {
		'.pm-breakout-resize-handle-rail-wrapper': {
			display: 'flex',
			alignItems: 'center',
			justifyContent: 'center',
			height: '100%',
			cursor: 'col-resize',
			borderRadius: token('radius.small'),
			zIndex: 2,
			'[role="presentation"]': {
				height: '100%',
				width: '100%',
			},
			'.pm-breakout-resize-handle-rail-inside-tooltip': {
				height: '100%',
			},
		},
	},
	pragmaticResizerStylesSyncedBlock: {
		'.fabric-editor-breakout-mark': {
			'&:has([data-prosemirror-node-name="syncBlock"]), &:has([data-prosemirror-node-name="bodiedSyncBlock"])':
				{
					'> .pm-breakout-resize-handle-container--left': {
						left: '-24px',
					},
					'> .pm-breakout-resize-handle-container--right': {
						right: '-24px',
					},
					'> .pm-breakout-resize-handle-container': {
						height: 'calc(100% - 12px)',
					},
				},
		},
	},
	pragmaticResizerStylesWithReducedEditorGutter: {
		// eslint-disable-next-line @atlaskit/ui-styling-standard/no-container-queries
		'@container editor-area (max-width: 600px)': {
			'.fabric-editor-breakout-mark': {
				'&:has([data-prosemirror-node-name="expand"]), &:has([data-prosemirror-node-name="layoutSection"])':
					{
						'> .pm-breakout-resize-handle-container': {
							opacity: 0,
							visibility: 'hidden',
						},
					},
				'&:has([data-prosemirror-node-name="layoutSection"])': {
					'.resizer-item': {
						willChange: 'width',
						'&:hover, &.display-handle': {
							'& > .resizer-handle-wrapper > .resizer-handle': {
								visibility: 'hidden',
								opacity: 0,
							},
						},
					},
				},
			},
		},
	},
	pragmaticStylesLayoutFirstNodeResizeHandleFix: {
		'.fabric-editor-breakout-mark': {
			'&:has([data-prosemirror-node-name="layoutSection"].first-node-in-document)': {
				'> .pm-breakout-resize-handle-container': {
					height: 'calc(100% - 8px)',
				},
			},
		},
	},
	resizerStyles: {
		'.resizer-item': {
			willChange: 'width',
			'&:hover, &.display-handle': {
				'& > .resizer-handle-wrapper > .resizer-handle': {
					visibility: 'visible',
					opacity: 1,
				},
			},
			'&.is-resizing': {
				'& .resizer-handle-thumb': {
					background: token('color.border.focused'),
				},
			},
			'&.resizer-handle-danger': {
				'& .resizer-handle-thumb': {
					transition: 'none',
					background: token('color.icon.danger'),
				},
			},
		},
		'.resizer-handle': {
			display: 'flex',
			visibility: 'hidden',
			opacity: 0,
			flexDirection: 'column',
			justifyContent: 'center',
			alignItems: 'center',
			width: 7,
			transition: 'visibility 0.2s, opacity 0.2s',
			"& div[role='presentation']": {
				width: '100%',
				height: '100%',
				display: 'flex',
				flexDirection: 'column',
				justifyContent: 'center',
				alignItems: 'center',
				marginTop: token('space.negative.200'),
				whiteSpace: 'normal',
			},
			'&.left': {
				alignItems: 'flex-start',
			},
			'&.right': {
				alignItems: 'flex-end',
			},
			'&.small': {
				'& .resizer-handle-thumb': {
					height: 43,
				},
			},
			'&.medium': {
				'& .resizer-handle-thumb': {
					height: 64,
				},
			},
			'&.large': {
				'& .resizer-handle-thumb': {
					height: 96,
				},
			},
			'&.clamped': {
				'& .resizer-handle-thumb': {
					height: 'clamp(43px, calc(100% - 32px), 96px)',
				},
			},
			'&.sticky': {
				'& .resizer-handle-thumb': {
					position: 'sticky',
					top: token('space.150'),
					bottom: token('space.150'),
				},
			},
			'&:hover': {
				'& .resizer-handle-thumb': {
					background: token('color.border.focused'),
				},
				'& .resizer-handle-track': {
					visibility: 'visible',
					opacity: 0.5,
				},
			},
		},
		'.resizer-handle-thumb': {
			content: "' '",
			display: 'flex',
			width: 3,
			margin: `0 ${token('space.025')}`,
			height: 64,
			transition: 'background-color 0.2s',
			borderRadius: token('radius.medium'),
			border: 0,
			padding: 0,
			zIndex: 2,
			outline: 'none',
			minHeight: 24,
			background: token('color.border'),
			'&:hover': {
				cursor: 'col-resize',
			},
			'&:focus': {
				background: token('color.border.selected'),
				'&::after': {
					content: "''",
					position: 'absolute',
					top: token('space.negative.050'),
					right: token('space.negative.050'),
					bottom: token('space.negative.050'),
					left: token('space.negative.050'),
					border: `${token('border.width.selected')} solid ${token('color.border.focused')}`,
					borderRadius: 'inherit',
					zIndex: -1,
				},
			},
		},
		'.resizer-handle-track': {
			visibility: 'hidden',
			position: 'absolute',
			width: 7,
			height: 'calc(100% - 40px)',
			borderRadius: token('radius.small'),
			opacity: 0,
			transition: 'background-color 0.2s, visibility 0.2s, opacity 0.2s',
			'&.none': {
				background: 'none',
			},
			'&.shadow': {
				background: token('color.background.selected'),
			},
			'&.full-height': {
				background: token('color.background.selected'),
				height: '100%',
				minHeight: 36,
			},
		},
		'.ak-editor-selected-node': {
			'& .resizer-handle-thumb': {
				background: token('color.border.focused'),
			},
		},
		'.ak-editor-no-interaction .ak-editor-selected-node .resizer-handle:not(:hover) .resizer-handle-thumb':
			{
				background: token('color.border'),
			},
		'.resizer-hover-zone': {
			position: 'relative',
			display: 'flow-root',
			width: '100%',
			'&.resizer-is-extended': {
				padding: `0 ${token('space.150')}`,
				left: token('space.negative.150'),
			},
		},
		'table .resizer-hover-zone, table .resizer-hover-zone.resizer-is-extended': {
			padding: 'unset',
			left: 'unset',
		},
	},
	/**
	 * Bottom-handle styles for the vertical-resize feature shipped under the
	 * `databases-native-embeds-v2` experiment
	 */
	resizerBottomHandleStyles: {
		'.resizer-handle.bottom': {
			flexDirection: 'row',
			alignItems: 'flex-end',
			width: '100%',
			height: 7,
			'& .resizer-handle-thumb': {
				width: 64,
				height: 3,
				minWidth: 24,
				minHeight: 0,
				marginTop: token('space.025'),
				marginRight: 0,
				marginBottom: token('space.025'),
				marginLeft: 0,
				'&:hover': {
					cursor: 'row-resize',
				},
			},
			'& .resizer-handle-track': {
				width: 'calc(100% - 40px)',
				height: 7,
			},
			'& .resizer-handle-track.full-height': {
				width: '100%',
				height: 7,
				minWidth: 36,
				minHeight: 0,
			},
		},
		'.resizer-handle.small.bottom .resizer-handle-thumb': {
			width: 43,
			height: 3,
		},
		'.resizer-handle.medium.bottom .resizer-handle-thumb': {
			width: 64,
			height: 3,
		},
		'.resizer-handle.large.bottom .resizer-handle-thumb': {
			width: 96,
			height: 3,
		},
		'.resizer-handle.clamped.bottom .resizer-handle-thumb': {
			width: 'clamp(43px, calc(100% - 32px), 96px)',
			height: 3,
		},
	},
	ruleStyles: {
		'.ProseMirror hr': {
			border: 'none',
			backgroundColor: token('color.border'),
			height: '2px',
			// eslint-disable-next-line @atlaskit/design-system/use-tokens-shape
			borderRadius: '1px', // this should use token('radius.full') but cannot since the element has padding which increases its height beyond 2px
			cursor: 'pointer',
			// eslint-disable-next-line @atlaskit/platform/expand-spacing-shorthand
			padding: `${token('space.050')} 0`,
			// eslint-disable-next-line @atlaskit/platform/expand-spacing-shorthand
			margin: `${token('space.300')} 0`,
			backgroundClip: 'content-box',
		},
		// eslint-disable-next-line @atlaskit/ui-styling-standard/no-unsafe-values, @atlaskit/ui-styling-standard/no-imported-style-values
		'.ProseMirror hr.ak-editor-selected-node': {
			outline: 'none',
			backgroundColor: token('color.border.selected'),
		},
	},
	scaledEmojiStyles: {
		'.ProseMirror .emojiView-content-wrap': {
			display: 'inline-block',
		},
		'.ProseMirror :is(.emoji-common-emoji-sprite, .emoji-common-emoji-image)': {
			background: 'no-repeat transparent',
			display: 'inline-block',
			height: `${defaultEmojiHeight}px`,
			minHeight: `${defaultEmojiHeight}px`,
			minWidth: `${defaultEmojiHeight}px`,
			maxHeight: `${scaledEmojiHeightH1}px`,
			maxWidth: `${scaledEmojiHeightH1}px`,
			cursor: 'pointer',
			verticalAlign: 'middle',
			userSelect: 'all',
		},
		'.ProseMirror .ak-editor-selected-node': {
			'.emoji-common-emoji-sprite, .emoji-common-emoji-image': {
				// eslint-disable-next-line @atlaskit/ui-styling-standard/no-unsafe-values, @atlaskit/design-system/no-invalid-css-map
				...emojiSelectionStyles,
				// eslint-disable-next-line @atlaskit/ui-styling-standard/no-imported-style-values, @atlaskit/design-system/no-invalid-css-map, @atlaskit/ui-styling-standard/no-unsafe-values
				...blanketSelectionStyles,
				// eslint-disable-next-line @atlaskit/ui-styling-standard/no-imported-style-values, @atlaskit/design-system/no-invalid-css-map, @atlaskit/ui-styling-standard/no-unsafe-values
				...boxShadowSelectionStyles,
				// eslint-disable-next-line @atlaskit/ui-styling-standard/no-imported-style-values, @atlaskit/design-system/no-invalid-css-map, @atlaskit/ui-styling-standard/no-unsafe-values
				...hideNativeBrowserTextSelectionStyles,
			},
		},
		'.ProseMirror h1 :is(.emoji-common-emoji-sprite, .emoji-common-emoji-image, .emoji-common-placeholder)':
			{
				height: `${scaledEmojiHeightH1}px`,
				width: `${scaledEmojiHeightH1}px`,
			},
		'.ProseMirror h2 :is(.emoji-common-emoji-sprite, .emoji-common-emoji-image, .emoji-common-placeholder)':
			{
				height: `${scaledEmojiHeightH2}px`,
				width: `${scaledEmojiHeightH2}px`,
			},
		'.ProseMirror h3 :is(.emoji-common-emoji-sprite, .emoji-common-emoji-image, .emoji-common-placeholder)':
			{
				height: `${scaledEmojiHeightH3}px`,
				width: `${scaledEmojiHeightH3}px`,
			},
		'.ProseMirror h4 :is(.emoji-common-emoji-sprite, .emoji-common-emoji-image, .emoji-common-placeholder)':
			{
				height: `${scaledEmojiHeightH4}px`,
				width: `${scaledEmojiHeightH4}px`,
			},
		'.ProseMirror :is(h5, h6, p) .emoji-common-placeholder': {
			height: `${defaultEmojiHeight}px`,
			width: `${defaultEmojiHeight}px`,
		},
	},
	scaledEmojiDenseStyles: {
		'.ProseMirror :is(.emoji-common-emoji-sprite, .emoji-common-emoji-image)': {
			width: defaultDenseEmojiHeight,
			height: defaultDenseEmojiHeight,
			minHeight: defaultDenseEmojiHeight,
			minWidth: defaultDenseEmojiHeight,
			maxHeight: `${denseEmojiHeightH1}px`,
			maxWidth: `${denseEmojiHeightH1}px`,
			img: {
				width: '100%',
				height: '100%',
				objectFit: 'contain',
			},
		},
		// Scale panel icon in dense mode
		'.ProseMirror .ak-editor-panel .ak-editor-panel__icon': {
			height: token('space.250'),
			width: token('space.250'),
		},
		'.ProseMirror h1 :is(.emoji-common-emoji-sprite, .emoji-common-emoji-image)': {
			height: `${denseEmojiHeightH1}px`,
			width: `${denseEmojiHeightH1}px`,
		},
		'.ProseMirror h2 :is(.emoji-common-emoji-sprite, .emoji-common-emoji-image)': {
			height: `${denseEmojiHeightH2}px`,
			width: `${denseEmojiHeightH2}px`,
		},
		'.ProseMirror h3 :is(.emoji-common-emoji-sprite, .emoji-common-emoji-image)': {
			height: `${denseEmojiHeightH3}px`,
			width: `${denseEmojiHeightH3}px`,
		},
		'.ProseMirror h4 :is(.emoji-common-emoji-sprite, .emoji-common-emoji-image)': {
			height: `${denseEmojiHeightH4}px`,
			width: `${denseEmojiHeightH4}px`,
		},
		'.ProseMirror h1 .emoji-common-placeholder': {
			height: `${denseEmojiHeightH1}px`,
			width: `${denseEmojiHeightH1}px`,
		},
		'.ProseMirror h2 .emoji-common-placeholder': {
			height: `${denseEmojiHeightH2}px`,
			width: `${denseEmojiHeightH2}px`,
		},
		'.ProseMirror h3 .emoji-common-placeholder': {
			height: `${denseEmojiHeightH3}px`,
			width: `${denseEmojiHeightH3}px`,
		},
		'.ProseMirror h4 .emoji-common-placeholder': {
			height: `${denseEmojiHeightH4}px`,
			width: `${denseEmojiHeightH4}px`,
		},
		'.ProseMirror :is(h5, h6, p) .emoji-common-placeholder': {
			height: `${defaultDenseEmojiHeight}px`,
			width: `${defaultDenseEmojiHeight}px`,
		},
	},
	scrollbarStyles: {
		msOverflowStyle: '-ms-autohiding-scrollbar',
		// eslint-disable-next-line @atlaskit/ui-styling-standard/no-unsafe-selectors
		'&::-webkit-scrollbar-corner': {
			display: 'none',
		},
		// eslint-disable-next-line @atlaskit/ui-styling-standard/no-unsafe-selectors
		'&::-webkit-scrollbar-thumb': {
			// eslint-disable-next-line @atlaskit/ui-styling-standard/no-unsafe-values
			backgroundColor: token('color.background.neutral.subtle'),
		},
		// eslint-disable-next-line @atlaskit/ui-styling-standard/no-unsafe-selectors
		'&:hover::-webkit-scrollbar-thumb': {
			backgroundColor: token('color.background.neutral.bold'),
			borderRadius: token('radius.large'),
		},
		// eslint-disable-next-line @atlaskit/ui-styling-standard/no-unsafe-selectors
		'&::-webkit-scrollbar-thumb:hover': {
			backgroundColor: token('color.background.neutral.bold.hovered'),
		},
	},
	selectedNodeStyles: {
		'.ProseMirror-selectednode': {
			outline: 'none',
		},
		// eslint-disable-next-line @atlaskit/ui-styling-standard/no-unsafe-selectors
		'.ProseMirror-selectednode:empty': {
			outline: `2px solid ${token('color.border.focused')}`,
		},
	},
	selectionToolbarAnimationStyles: {
		"[aria-label='Selection toolbar']": {
			animationName: fadeIn,
			animationDuration: `0.2s`,
			animationTimingFunction: `cubic-bezier(0.6, 0, 0, 1)`,
		},
	},
	shadowStyles: {
		'.ProseMirror': {
			'& .right-shadow::before, .right-shadow::after, .left-shadow::before, .left-shadow::after': {
				display: 'none',
				position: 'absolute',
				pointerEvents: 'none',
				zIndex: 2,
				width: 8,
				content: "''",
				height: 'calc(100%)',
			},

			'& .right-shadow, .left-shadow': {
				position: 'relative',
			},

			'& .left-shadow::before': {
				background: `linear-gradient(to left, transparent 0, ${token(
					'elevation.shadow.overflow.spread',
				)} 140% ), linear-gradient( to right, ${token(
					'elevation.shadow.overflow.perimeter',
				)} 0px, transparent 1px)`,
				top: 0,
				left: 0,
				display: 'block',
			},

			'& .right-shadow::after': {
				background: `linear-gradient(to right, transparent 0, ${token(
					'elevation.shadow.overflow.spread',
				)} 140% ), linear-gradient( to left, ${token(
					'elevation.shadow.overflow.perimeter',
				)} 0px, transparent 1px)`,
				right: 0,
				top: 0,
				display: 'block',
			},

			'& .sentinel-left': {
				height: '100%',
				width: 0,
				minWidth: 0,
			},

			'& .sentinel-right': {
				height: '100%',
				width: 0,
				minWidth: 0,
			},
		},
	},
	showDiffDeletedNodeStyles: {
		// Constant variables here has been inlined in css from EditorContentContainer, if you need to make
		// update here, please also update packages/editor/editor-core/src/ui/EditorContentContainer/styles/smartCardStyles.ts
		// SmartCardSharedCssClassName.EMBED_CARD_CONTAINER = 'embedCardView-content-wrap'
		// SmartCardSharedCssClassName.LOADER_WRAPPER = 'loader-wrapper'
		'.embedCardView-content-wrap': {
			'&.show-diff-deleted-node .loader-wrapper > div::after': {
				// eslint-disable-next-line @atlaskit/ui-styling-standard/no-unsafe-values
				boxShadow: `0 0 0 1px ${token('color.border.accent.gray')}`,
				borderColor: 'transparent',
			},
			'&.show-diff-deleted-node-traditional .loader-wrapper > div::after': {
				// eslint-disable-next-line @atlaskit/ui-styling-standard/no-unsafe-values
				boxShadow: `0 0 0 1px ${token('color.border.accent.red')}`,
				borderColor: 'transparent',
			},
			'&.show-diff-deleted-node-traditional.show-diff-deleted-outline-new .loader-wrapper > div::after':
				{
					// eslint-disable-next-line @atlaskit/ui-styling-standard/no-unsafe-values
					boxShadow: `0 0 0 4px ${token('color.background.accent.red.subtlest')}`,
					borderColor: 'transparent',
				},
			'&.show-diff-deleted-node-traditional.show-diff-deleted-active .loader-wrapper > div::after':
				{
					// eslint-disable-next-line @atlaskit/ui-styling-standard/no-unsafe-values
					boxShadow: `0 0 0 4px ${token('color.background.accent.red.subtler.pressed')}`,
					borderColor: 'transparent',
				},
			'&.show-diff-deleted-node.show-diff-deleted-active .loader-wrapper > div::after': {
				// eslint-disable-next-line @atlaskit/ui-styling-standard/no-unsafe-values
				boxShadow: `0 0 0 4px ${token('color.background.accent.red.subtler.pressed')}`,
				borderColor: 'transparent',
			},
			'&.show-diff-deleted-node .loader-wrapper': {
				opacity: 0.6,
			},
		},
		'.show-diff-deleted-node .media-card-wrapper': {
			'& > div': {
				// eslint-disable-next-line @atlaskit/ui-styling-standard/no-unsafe-values
				boxShadow: `0 0 0 1px ${token('color.border.accent.gray')}`,
				borderRadius: token('radius.small'),
				opacity: 0.6,
			},
		},
		'.show-diff-deleted-node-traditional .media-card-wrapper': {
			'& > div': {
				// eslint-disable-next-line @atlaskit/ui-styling-standard/no-unsafe-values
				boxShadow: `0 0 0 1px ${token('color.border.accent.red')}`,
				borderRadius: token('radius.small'),
			},
		},
		'.show-diff-deleted-node-traditional.show-diff-deleted-outline-new .media-card-wrapper': {
			'& > div': {
				// eslint-disable-next-line @atlaskit/ui-styling-standard/no-unsafe-values
				boxShadow: `0 0 0 4px ${token('color.background.accent.red.subtlest')}`,
				borderRadius: token('radius.small'),
			},
		},
		'.show-diff-deleted-node-traditional.show-diff-deleted-active .media-card-wrapper': {
			'& > div': {
				// eslint-disable-next-line @atlaskit/ui-styling-standard/no-unsafe-values
				boxShadow: `0 0 0 4px ${token('color.background.accent.red.subtler.pressed')}`,
				borderRadius: token('radius.small'),
			},
		},
		'.show-diff-deleted-node.show-diff-deleted-active .media-card-wrapper': {
			'& > div': {
				// eslint-disable-next-line @atlaskit/ui-styling-standard/no-unsafe-values
				boxShadow: `0 0 0 4px ${token('color.background.accent.red.subtler.pressed')}`,
				borderRadius: token('radius.small'),
				opacity: 0.6,
			},
		},
		'[data-prosemirror-node-name="blockquote"].show-diff-deleted-node': {
			textDecoration: 'line-through',
		},
		'[data-prosemirror-node-name="blockquote"].show-diff-deleted-node-traditional': {
			textDecoration: 'line-through',
			textDecorationColor: token('color.border.accent.red'),
		},
		'[data-prosemirror-node-name="embedCard"].show-diff-deleted-node-traditional': {
			textDecoration: 'line-through',
			textDecorationColor: token('color.border.accent.red'),
		},
	},
	showDiffDeletedNodeStylesNew: {
		// Constant variables here has been inlined in css from EditorContentContainer, if you need to make
		// update here, please also update packages/editor/editor-core/src/ui/EditorContentContainer/styles/smartCardStyles.ts
		// SmartCardSharedCssClassName.EMBED_CARD_CONTAINER = 'embedCardView-content-wrap'
		// SmartCardSharedCssClassName.LOADER_WRAPPER = 'loader-wrapper'
		'.embedCardView-content-wrap': {
			'&.show-diff-deleted-node .loader-wrapper > div::after': {
				// eslint-disable-next-line @atlaskit/ui-styling-standard/no-unsafe-values
				boxShadow: `0 0 0 1px ${token('color.border.accent.red')}`,
				borderColor: 'transparent',
			},
			'&.show-diff-deleted-node-traditional .loader-wrapper > div::after': {
				// eslint-disable-next-line @atlaskit/ui-styling-standard/no-unsafe-values
				boxShadow: `0 0 0 1px ${token('color.border.accent.red')}`,
				borderColor: 'transparent',
			},
			'&.show-diff-deleted-node-traditional.show-diff-deleted-outline-new .loader-wrapper > div::after':
				{
					// eslint-disable-next-line @atlaskit/ui-styling-standard/no-unsafe-values
					boxShadow: `0 0 0 4px ${token('color.background.accent.red.subtlest')}`,
					borderColor: 'transparent',
				},
			'&.show-diff-deleted-node-traditional.show-diff-deleted-active .loader-wrapper > div::after':
				{
					// eslint-disable-next-line @atlaskit/ui-styling-standard/no-unsafe-values
					boxShadow: `0 0 0 4px ${token('color.background.accent.red.subtler.pressed')}`,
					borderColor: 'transparent',
				},
			'&.show-diff-deleted-node.show-diff-deleted-active .loader-wrapper > div::after': {
				// eslint-disable-next-line @atlaskit/ui-styling-standard/no-unsafe-values
				boxShadow: `0 0 0 4px ${token('color.background.accent.red.subtler.pressed')}`,
				borderColor: 'transparent',
			},
			'&.show-diff-deleted-node .loader-wrapper': {
				opacity: 0.8,
			},
		},
		'.show-diff-deleted-node .media-card-wrapper': {
			'& > div': {
				// eslint-disable-next-line @atlaskit/ui-styling-standard/no-unsafe-values
				boxShadow: `0 0 0 1px ${token('color.border.accent.red')}`,
				borderRadius: token('radius.small'),
				opacity: 0.8,
			},
		},
		'.show-diff-deleted-node-traditional .media-card-wrapper': {
			'& > div': {
				// eslint-disable-next-line @atlaskit/ui-styling-standard/no-unsafe-values
				boxShadow: `0 0 0 var(--diff-decoration-marker-ring-width, 1px) ${token(
					'color.border.accent.red',
				)}`,
				borderRadius: token('radius.small'),
			},
		},
		'.show-diff-deleted-node-traditional.show-diff-deleted-outline-new .media-card-wrapper': {
			'& > div': {
				// eslint-disable-next-line @atlaskit/ui-styling-standard/no-unsafe-values
				boxShadow: `0 0 0 4px ${token('color.background.accent.red.subtlest')}`,
				borderRadius: token('radius.small'),
			},
		},
		'.show-diff-deleted-node-traditional.show-diff-deleted-active .media-card-wrapper': {
			'& > div': {
				// eslint-disable-next-line @atlaskit/ui-styling-standard/no-unsafe-values
				boxShadow: `0 0 0 4px ${token('color.background.accent.red.subtler.pressed')}`,
				borderRadius: token('radius.small'),
			},
		},
		'.show-diff-deleted-node.show-diff-deleted-active .media-card-wrapper': {
			'& > div': {
				// eslint-disable-next-line @atlaskit/ui-styling-standard/no-unsafe-values
				boxShadow: `0 0 0 4px ${token('color.background.accent.red.subtler.pressed')}`,
				borderRadius: token('radius.small'),
				opacity: 0.8,
			},
		},
		'[data-prosemirror-node-name="blockquote"].show-diff-deleted-node': {
			textDecoration: 'line-through',
		},
		'[data-prosemirror-node-name="blockquote"].show-diff-deleted-node-traditional': {
			textDecoration: 'line-through',
			textDecorationColor: token('color.border.accent.red'),
		},
		'[data-prosemirror-node-name="embedCard"].show-diff-deleted-node-traditional': {
			textDecoration: 'line-through',
			textDecorationColor: token('color.border.accent.red'),
		},
	},
	smartCardDiffStyles: {
		// Constant variables here has been inlined in css from EditorContentContainer, if you need to make
		// update here, please also update packages/editor/editor-core/src/ui/EditorContentContainer/styles/smartCardStyles.ts
		// SmartCardSharedCssClassName.EMBED_CARD_CONTAINER = 'embedCardView-content-wrap'
		// SmartCardSharedCssClassName.LOADER_WRAPPER = 'loader-wrapper'
		'.embedCardView-content-wrap': {
			'&[data-testid="show-diff-changed-decoration-node"] .loader-wrapper > div::after': {
				// eslint-disable-next-line @atlaskit/ui-styling-standard/no-unsafe-values
				boxShadow: `0 0 0 var(--diff-decoration-marker-ring-width, 1px) var(--diff-decoration-marker-color)`,
				borderColor: 'transparent',
			},
		},
	},
	smartCardStyles: {
		// Constant variables here has been inlined in css from EditorContentContainer, if you need to make
		// update here, please also update packages/editor/editor-core/src/ui/EditorContentContainer/styles/smartCardStyles.ts
		// SmartCardSharedCssClassName.INLINE_CARD_CONTAINER = 'inlineCardView-content-wrap'
		// SmartCardSharedCssClassName.BLOCK_CARD_CONTAINER = 'blockCardView-content-wrap'
		// SmartCardSharedCssClassName.DATASOURCE_CONTAINER = 'datasourceView-content-wrap'
		// SmartCardSharedCssClassName.EMBED_CARD_CONTAINER = 'embedCardView-content-wrap'
		// SmartCardSharedCssClassName.LOADER_WRAPPER = 'loader-wrapper'
		// FLOATING_TOOLBAR_LINKPICKER_CLASSNAME = 'card-floating-toolbar--link-picker'
		// DATASOURCE_INNER_CONTAINER_CLASSNAME = 'datasourceView-content-inner-wrap'
		'.inlineCardView-content-wrap': {
			maxWidth: 'calc(100% - 20px)',
			verticalAlign: 'top',
			wordBreak: 'break-all',

			'.card-with-comment': {
				background: token('color.background.accent.yellow.subtler'),
				borderBottom: `${token('border.width.selected')} solid ${token(
					'color.border.accent.yellow',
				)}`,
				boxShadow: token('elevation.shadow.overlay'),
			},

			'.card': {
				paddingLeft: token('space.025'),
				paddingRight: token('space.025'),
				paddingTop: token('space.100'),
				paddingBottom: token('space.100'),
				marginBottom: token('space.negative.100'),

				'.loader-wrapper > a:focus': {
					// eslint-disable-next-line @atlaskit/ui-styling-standard/no-unsafe-values, @atlaskit/design-system/no-invalid-css-map
					...boxShadowSelectionStyles,
					// eslint-disable-next-line @atlaskit/ui-styling-standard/no-unsafe-values, @atlaskit/design-system/no-invalid-css-map
					...hideNativeBrowserTextSelectionStyles,
				},
			},

			'&.ak-editor-selected-node .loader-wrapper > a': {
				// eslint-disable-next-line @atlaskit/ui-styling-standard/no-unsafe-values, @atlaskit/design-system/no-invalid-css-map
				...boxShadowSelectionStyles,
				// eslint-disable-next-line @atlaskit/ui-styling-standard/no-unsafe-values, @atlaskit/design-system/no-invalid-css-map
				...hideNativeBrowserTextSelectionStyles,
			},

			'.loader-wrapper > a': {
				// EDM-1717: box-shadow Safari fix start
				zIndex: 1,
				position: 'relative',
			},

			'&.danger': {
				'.loader-wrapper > a': {
					// eslint-disable-next-line @atlaskit/ui-styling-standard/no-unsafe-values
					boxShadow: `0 0 0 1px ${token('color.border.danger')}`,
					// EDM-1717: box-shadow Safari fix start
					zIndex: 2,
					// EDM-1717: box-shadow Safari fix end
				},
			},
		},

		'.blockCardView-content-wrap': {
			display: 'block',
			margin: '0.75rem 0 0',
			// eslint-disable-next-line @atlaskit/ui-styling-standard/no-unsafe-values
			maxWidth: `${8 * 95}px`,

			'&.ak-editor-selected-node .loader-wrapper > div': {
				// eslint-disable-next-line @atlaskit/ui-styling-standard/no-unsafe-values, @atlaskit/design-system/no-invalid-css-map
				...boxShadowSelectionStyles,
				// eslint-disable-next-line @atlaskit/ui-styling-standard/no-unsafe-values, @atlaskit/design-system/no-invalid-css-map
				...hideNativeBrowserTextSelectionStyles,
				borderRadius: token('radius.large', '8px'),
			},

			'&.danger': {
				'.loader-wrapper > div': {
					// eslint-disable-next-line @atlaskit/ui-styling-standard/no-important-styles, @atlaskit/ui-styling-standard/no-unsafe-values
					boxShadow: `0 0 0 1px ${token('color.border.danger')} !important`,
				},
			},
		},

		'.datasourceView-content-wrap.blockCardView-content-wrap': {
			maxWidth: '100%',
			display: 'flex',
			justifyContent: 'center',

			'.datasourceView-content-inner-wrap': {
				cursor: 'pointer',
				backgroundColor: token('color.background.neutral.subtle'),
				borderRadius: token('radius.large', '8px'),
				border: `1px solid ${token('color.border')}`,
				overflow: 'hidden',
			},

			'&.ak-editor-selected-node': {
				'.datasourceView-content-inner-wrap': {
					// eslint-disable-next-line @atlaskit/ui-styling-standard/no-unsafe-values, @atlaskit/design-system/no-invalid-css-map
					...boxShadowSelectionStyles,
					// eslint-disable-next-line @atlaskit/ui-styling-standard/no-unsafe-values, @atlaskit/design-system/no-invalid-css-map
					...hideNativeBrowserTextSelectionStyles,

					'input::selection': {
						backgroundColor: token('color.background.selected.hovered'),
					},

					'input::-moz-selection': {
						backgroundColor: token('color.background.selected.hovered'),
					},
				},
			},

			'&.danger': {
				'.datasourceView-content-inner-wrap': {
					// eslint-disable-next-line @atlaskit/ui-styling-standard/no-unsafe-values
					boxShadow: `0 0 0 1px ${token('color.border.danger')}`,
				},
			},
		},

		'.embedCardView-content-wrap': {
			'.loader-wrapper > div': {
				cursor: 'pointer',

				'&::after': {
					transition: 'box-shadow 0s',
				},
			},

			'&.ak-editor-selected-node .loader-wrapper > div::after': {
				// eslint-disable-next-line @atlaskit/ui-styling-standard/no-unsafe-values, @atlaskit/design-system/no-invalid-css-map
				...boxShadowSelectionStyles,
				// eslint-disable-next-line @atlaskit/ui-styling-standard/no-unsafe-values, @atlaskit/design-system/no-invalid-css-map
				...hideNativeBrowserTextSelectionStyles,
			},

			'&.danger': {
				'.media-card-frame::after': {
					// eslint-disable-next-line @atlaskit/ui-styling-standard/no-important-styles, @atlaskit/ui-styling-standard/no-unsafe-values
					boxShadow: `0 0 0 1px ${token('color.border.danger')} !important`,
					// eslint-disable-next-line @atlaskit/ui-styling-standard/no-important-styles, @atlaskit/ui-styling-standard/no-unsafe-values
					background: `${token('color.background.danger')} !important`,
				},

				'.richMedia-resize-handle-right::after, .richMedia-resize-handle-left::after': {
					background: token('color.border.danger'),
				},
			},
		},

		'.card-floating-toolbar--link-picker': {
			padding: 0,
		},
	},
	smartCardStylesWithSearchMatch: {
		// Constant variables here has been inlined in css from EditorContentContainer, if you need to make
		// update here, please also update packages/editor/editor-core/src/ui/EditorContentContainer/styles/smartCardStyles.ts
		// SmartCardSharedCssClassName.INLINE_CARD_CONTAINER = 'inlineCardView-content-wrap'
		// SmartCardSharedCssClassName.BLOCK_CARD_CONTAINER = 'blockCardView-content-wrap'
		// SmartCardSharedCssClassName.DATASOURCE_CONTAINER = 'datasourceView-content-wrap'
		// SmartCardSharedCssClassName.EMBED_CARD_CONTAINER = 'embedCardView-content-wrap'
		// SmartCardSharedCssClassName.LOADER_WRAPPER = 'loader-wrapper'
		// FLOATING_TOOLBAR_LINKPICKER_CLASSNAME = 'card-floating-toolbar--link-picker'
		// DATASOURCE_INNER_CONTAINER_CLASSNAME = 'datasourceView-content-inner-wrap'
		'.inlineCardView-content-wrap': {
			maxWidth: 'calc(100% - 20px)',
			verticalAlign: 'top',
			wordBreak: 'break-all',

			'.card-with-comment': {
				background: token('color.background.accent.yellow.subtler'),
				// eslint-disable-next-line @atlaskit/ui-styling-standard/no-unsafe-values
				borderBottom: `2px solid ${token('color.border.accent.yellow')}`,
				boxShadow: token('elevation.shadow.overlay'),
			},

			'.card': {
				paddingLeft: token('space.025'),
				paddingRight: token('space.025'),
				paddingTop: token('space.100'),
				paddingBottom: token('space.100'),
				marginBottom: token('space.negative.100'),

				'.loader-wrapper > a:focus': {
					// eslint-disable-next-line @atlaskit/ui-styling-standard/no-unsafe-values, @atlaskit/design-system/no-invalid-css-map
					...boxShadowSelectionStyles,
					// eslint-disable-next-line @atlaskit/ui-styling-standard/no-unsafe-values, @atlaskit/design-system/no-invalid-css-map
					...hideNativeBrowserTextSelectionStyles,
				},
			},

			'&.ak-editor-selected-node .loader-wrapper > a': {
				// eslint-disable-next-line @atlaskit/ui-styling-standard/no-unsafe-values, @atlaskit/design-system/no-invalid-css-map
				...hideNativeBrowserTextSelectionStyles,
			},

			'&.ak-editor-selected-node:not(.search-match-block) .loader-wrapper > a': {
				// eslint-disable-next-line @atlaskit/ui-styling-standard/no-unsafe-values, @atlaskit/design-system/no-invalid-css-map
				...boxShadowSelectionStyles,
			},

			'.loader-wrapper > a': {
				// EDM-1717: box-shadow Safari fix start
				zIndex: 1,
				position: 'relative',
			},

			'&.danger': {
				'.loader-wrapper > a': {
					// eslint-disable-next-line @atlaskit/ui-styling-standard/no-unsafe-values
					boxShadow: `0 0 0 1px ${token('color.border.danger')}`,
					// EDM-1717: box-shadow Safari fix start
					zIndex: 2,
					// EDM-1717: box-shadow Safari fix end
				},
			},
		},

		'.blockCardView-content-wrap': {
			display: 'block',
			margin: '0.75rem 0 0',
			// eslint-disable-next-line @atlaskit/ui-styling-standard/no-unsafe-values
			maxWidth: `${8 * 95}px`,

			'&.ak-editor-selected-node .loader-wrapper > div': {
				// eslint-disable-next-line @atlaskit/ui-styling-standard/no-unsafe-values, @atlaskit/design-system/no-invalid-css-map
				...boxShadowSelectionStyles,
				// eslint-disable-next-line @atlaskit/ui-styling-standard/no-unsafe-values, @atlaskit/design-system/no-invalid-css-map
				...hideNativeBrowserTextSelectionStyles,

				borderRadius: token('radius.large', '8px'),
			},

			'&.danger': {
				'.loader-wrapper > div': {
					// eslint-disable-next-line @atlaskit/ui-styling-standard/no-important-styles, @atlaskit/ui-styling-standard/no-unsafe-values
					boxShadow: `0 0 0 1px ${token('color.border.danger')} !important`,
				},
			},
		},

		'.datasourceView-content-wrap.blockCardView-content-wrap': {
			maxWidth: '100%',
			display: 'flex',
			justifyContent: 'center',

			'.datasourceView-content-inner-wrap': {
				cursor: 'pointer',
				backgroundColor: token('color.background.neutral.subtle'),
				borderRadius: token('radius.large', '8px'),
				border: `1px solid ${token('color.border')}`,
				overflow: 'hidden',
			},

			'&.ak-editor-selected-node': {
				'.datasourceView-content-inner-wrap': {
					// eslint-disable-next-line @atlaskit/ui-styling-standard/no-unsafe-values, @atlaskit/design-system/no-invalid-css-map
					...boxShadowSelectionStyles,
					// eslint-disable-next-line @atlaskit/ui-styling-standard/no-unsafe-values, @atlaskit/design-system/no-invalid-css-map
					...hideNativeBrowserTextSelectionStyles,

					'input::selection': {
						backgroundColor: token('color.background.selected.hovered'),
					},

					'input::-moz-selection': {
						backgroundColor: token('color.background.selected.hovered'),
					},
				},
			},

			'&.danger': {
				'.datasourceView-content-inner-wrap': {
					// eslint-disable-next-line @atlaskit/ui-styling-standard/no-unsafe-values
					boxShadow: `0 0 0 1px ${token('color.border.danger')}`,
				},
			},
		},

		'.embedCardView-content-wrap': {
			'.loader-wrapper > div': {
				cursor: 'pointer',

				'&::after': {
					transition: 'box-shadow 0s',
				},
			},

			'&.ak-editor-selected-node .loader-wrapper > div::after': {
				// eslint-disable-next-line @atlaskit/ui-styling-standard/no-unsafe-values, @atlaskit/design-system/no-invalid-css-map
				...hideNativeBrowserTextSelectionStyles,
			},

			'&.ak-editor-selected-node:not(.search-match-block) .loader-wrapper > div::after': {
				// eslint-disable-next-line @atlaskit/ui-styling-standard/no-unsafe-values, @atlaskit/design-system/no-invalid-css-map
				...boxShadowSelectionStyles,
			},

			'&.danger': {
				'.media-card-frame::after': {
					// eslint-disable-next-line @atlaskit/ui-styling-standard/no-important-styles, @atlaskit/ui-styling-standard/no-unsafe-values
					boxShadow: `0 0 0 1px ${token('color.border.danger')} !important`,
					// eslint-disable-next-line @atlaskit/ui-styling-standard/no-important-styles, @atlaskit/ui-styling-standard/no-unsafe-values
					background: `${token('color.background.danger')} !important`,
				},

				'.richMedia-resize-handle-right::after, .richMedia-resize-handle-left::after': {
					background: token('color.border.danger'),
				},
			},
		},

		'.card-floating-toolbar--link-picker': {
			padding: 0,
		},
	},
	smartCardStylesWithSearchMatchAndBlockMenuDangerStyles: {
		// Constant variables here has been inlined in css from EditorContentContainer, if you need to make
		// update here, please also update packages/editor/editor-core/src/ui/EditorContentContainer/styles/smartCardStyles.ts
		// SmartCardSharedCssClassName.INLINE_CARD_CONTAINER = 'inlineCardView-content-wrap'
		// SmartCardSharedCssClassName.BLOCK_CARD_CONTAINER = 'blockCardView-content-wrap'
		// SmartCardSharedCssClassName.DATASOURCE_CONTAINER = 'datasourceView-content-wrap'
		// SmartCardSharedCssClassName.EMBED_CARD_CONTAINER = 'embedCardView-content-wrap'
		// SmartCardSharedCssClassName.LOADER_WRAPPER = 'loader-wrapper'
		// FLOATING_TOOLBAR_LINKPICKER_CLASSNAME = 'card-floating-toolbar--link-picker'
		// DATASOURCE_INNER_CONTAINER_CLASSNAME = 'datasourceView-content-inner-wrap'
		'.inlineCardView-content-wrap': {
			maxWidth: 'calc(100% - 20px)',
			verticalAlign: 'top',
			wordBreak: 'break-all',

			'.card-with-comment': {
				background: token('color.background.accent.yellow.subtler'),
				// eslint-disable-next-line @atlaskit/ui-styling-standard/no-unsafe-values
				borderBottom: `2px solid ${token('color.border.accent.yellow')}`,
				boxShadow: token('elevation.shadow.overlay'),
			},

			'.card': {
				paddingLeft: token('space.025'),
				paddingRight: token('space.025'),
				paddingTop: token('space.100'),
				paddingBottom: token('space.100'),
				marginBottom: token('space.negative.100'),

				'.loader-wrapper > a:focus': {
					// eslint-disable-next-line @atlaskit/ui-styling-standard/no-unsafe-values, @atlaskit/design-system/no-invalid-css-map
					...boxShadowSelectionStyles,
					// eslint-disable-next-line @atlaskit/ui-styling-standard/no-unsafe-values, @atlaskit/design-system/no-invalid-css-map
					...hideNativeBrowserTextSelectionStyles,
				},
			},

			'&.ak-editor-selected-node .loader-wrapper > a': {
				// eslint-disable-next-line @atlaskit/ui-styling-standard/no-unsafe-values, @atlaskit/design-system/no-invalid-css-map
				...hideNativeBrowserTextSelectionStyles,
			},

			'&.ak-editor-selected-node:not(.search-match-block):not(.danger) .loader-wrapper > a': {
				// eslint-disable-next-line @atlaskit/ui-styling-standard/no-unsafe-values, @atlaskit/design-system/no-invalid-css-map
				...boxShadowSelectionStyles,
			},

			'.loader-wrapper > a': {
				// EDM-1717: box-shadow Safari fix start
				zIndex: 1,
				position: 'relative',
			},

			'&.danger': {
				'.loader-wrapper > a': {
					// eslint-disable-next-line @atlaskit/ui-styling-standard/no-unsafe-values
					boxShadow: `0 0 0 1px ${token('color.border.danger')}`,
					// EDM-1717: box-shadow Safari fix start
					zIndex: 2,
					// EDM-1717: box-shadow Safari fix end
				},
			},
		},

		'.blockCardView-content-wrap': {
			display: 'block',
			margin: '0.75rem 0 0',
			// eslint-disable-next-line @atlaskit/ui-styling-standard/no-unsafe-values
			maxWidth: `${8 * 95}px`,

			'&.ak-editor-selected-node .loader-wrapper > div': {
				// eslint-disable-next-line @atlaskit/ui-styling-standard/no-unsafe-values, @atlaskit/design-system/no-invalid-css-map
				...boxShadowSelectionStyles,
				// eslint-disable-next-line @atlaskit/ui-styling-standard/no-unsafe-values, @atlaskit/design-system/no-invalid-css-map
				...hideNativeBrowserTextSelectionStyles,

				borderRadius: token('radius.large', '8px'),
			},

			'&.danger': {
				'.loader-wrapper > div': {
					// eslint-disable-next-line @atlaskit/ui-styling-standard/no-important-styles, @atlaskit/ui-styling-standard/no-unsafe-values
					boxShadow: `0 0 0 1px ${token('color.border.danger')} !important`,
				},
			},
		},

		'.datasourceView-content-wrap.blockCardView-content-wrap': {
			maxWidth: '100%',
			display: 'flex',
			justifyContent: 'center',

			'.datasourceView-content-inner-wrap': {
				cursor: 'pointer',
				backgroundColor: token('color.background.neutral.subtle'),
				borderRadius: token('radius.large', '8px'),
				border: `1px solid ${token('color.border')}`,
				overflow: 'hidden',
			},

			'&.ak-editor-selected-node': {
				'.datasourceView-content-inner-wrap': {
					// eslint-disable-next-line @atlaskit/ui-styling-standard/no-unsafe-values, @atlaskit/design-system/no-invalid-css-map
					...boxShadowSelectionStyles,
					// eslint-disable-next-line @atlaskit/ui-styling-standard/no-unsafe-values, @atlaskit/design-system/no-invalid-css-map
					...hideNativeBrowserTextSelectionStyles,

					'input::selection': {
						backgroundColor: token('color.background.selected.hovered'),
					},

					'input::-moz-selection': {
						backgroundColor: token('color.background.selected.hovered'),
					},
				},
			},

			'&.danger': {
				'.datasourceView-content-inner-wrap': {
					// eslint-disable-next-line @atlaskit/ui-styling-standard/no-unsafe-values
					boxShadow: `0 0 0 1px ${token('color.border.danger')}`,
				},
			},
		},

		'.embedCardView-content-wrap': {
			'.loader-wrapper > div': {
				cursor: 'pointer',

				'&::after': {
					transition: 'box-shadow 0s',
				},
			},

			'&.ak-editor-selected-node .loader-wrapper > div::after': {
				// eslint-disable-next-line @atlaskit/ui-styling-standard/no-unsafe-values, @atlaskit/design-system/no-invalid-css-map
				...hideNativeBrowserTextSelectionStyles,
			},

			'&.ak-editor-selected-node:not(.search-match-block) .loader-wrapper > div::after': {
				// eslint-disable-next-line @atlaskit/ui-styling-standard/no-unsafe-values, @atlaskit/design-system/no-invalid-css-map
				...boxShadowSelectionStyles,
			},

			'&.danger': {
				'.media-card-frame::after': {
					// eslint-disable-next-line @atlaskit/ui-styling-standard/no-important-styles, @atlaskit/ui-styling-standard/no-unsafe-values
					boxShadow: `0 0 0 1px ${token('color.border.danger')} !important`,
					// eslint-disable-next-line @atlaskit/ui-styling-standard/no-important-styles, @atlaskit/ui-styling-standard/no-unsafe-values
					background: `${token('color.background.danger')} !important`,
				},

				'.richMedia-resize-handle-right::after, .richMedia-resize-handle-left::after': {
					background: token('color.border.danger'),
				},
			},
		},

		'.card-floating-toolbar--link-picker': {
			padding: 0,
		},
	},
	smartCardStylesWithSearchMatchAndPreviewPanelResponsiveness: {
		// Constant variables here has been inlined in css from EditorContentContainer, if you need to make
		// update here, please also update packages/editor/editor-core/src/ui/EditorContentContainer/styles/smartCardStyles.ts
		// SmartCardSharedCssClassName.EMBED_CARD_CONTAINER = 'embedCardView-content-wrap'
		// SmartCardSharedCssClassName.LOADER_WRAPPER = 'loader-wrapper'
		// Uses editorAreaNarrowPageContainerQuery = `@container editor-area (max-width: ${akEditorFullPageNarrowBreakout}px)`
		[editorAreaNarrowPageContainerQuery]: {
			'.embedCardView-content-wrap': {
				marginTop: token('space.150'),
			},

			'.embedCardView-content-wrap.ak-editor-selected-node .loader-wrapper > div': {
				// eslint-disable-next-line @atlaskit/ui-styling-standard/no-unsafe-values, @atlaskit/design-system/no-invalid-css-map
				...boxShadowSelectionStyles,
				// eslint-disable-next-line @atlaskit/ui-styling-standard/no-unsafe-values, @atlaskit/design-system/no-invalid-css-map
				...hideNativeBrowserTextSelectionStyles,
				borderRadius: token('radius.large', '8px'),
			},
		},
	},
	smartLinksInLivePagesStyles: {
		// Constant variables here has been inlined in css from EditorContentContainer, if you need to make
		// update here, please also update packages/editor/editor-core/src/ui/EditorContentContainer/styles/smartCardStyles.ts
		// SmartCardSharedCssClassName.BLOCK_CARD_CONTAINER = 'blockCardView-content-wrap'
		// SmartCardSharedCssClassName.EMBED_CARD_CONTAINER = 'embedCardView-content-wrap'
		// SmartCardSharedCssClassName.LOADER_WRAPPER = 'loader-wrapper'
		'.blockCardView-content-wrap': {
			'.loader-wrapper > div': {
				cursor: 'pointer',

				a: {
					cursor: 'auto',
				},
			},
		},

		'.embedCardView-content-wrap': {
			'.loader-wrapper > div': {
				a: {
					cursor: 'auto',
				},
			},
		},
	},
	syncBlockFirstNodeStyles: {
		// eslint-disable-next-line @atlaskit/ui-styling-standard/no-imported-style-values, @atlaskit/ui-styling-standard/no-unsafe-values
		'.ProseMirror > .fabric-editor-breakout-mark:first-child': {
			// eslint-disable-next-line @atlaskit/ui-styling-standard/no-imported-style-values, @atlaskit/ui-styling-standard/no-unsafe-values
			[`.${SyncBlockSharedCssClassName.prefix}, .${BodiedSyncBlockSharedCssClassName.prefix}`]: {
				marginTop: 0,
			},
		},
	},
	syncBlockTextSelectionStyles: {
		'.ak-editor-sync-block__renderer': {
			// Show text cursor to indicate content is selectable
			cursor: 'text',
			// Remove browser focus outline on the contentEditable renderer wrapper
			outline: 'none',
			// Hide the blinking insertion caret. contentEditable="true" is set on
			// the renderer to enable text selection, but the content is read-only.
			caretColor: 'transparent',
			// Override cursor: pointer set by the editor's layout styles on
			// [data-layout-section] elements rendered inside the sync block content.
			'[data-layout-section]': {
				cursor: 'text',
			},
		},
		// Suppress ProseMirror's selected-node box-shadow and backgroundColor on emojis inside
		// the contentEditable renderer wrapper.
		'.ProseMirror .ak-editor-selected-node .ak-editor-sync-block__renderer': {
			'span[data-emoji-id], span[data-emoji-id] span': {
				// eslint-disable-next-line @atlaskit/ui-styling-standard/no-important-styles
				boxShadow: 'none !important',
				'&::before': {
					// eslint-disable-next-line @atlaskit/ui-styling-standard/no-important-styles
					backgroundColor: 'transparent !important',
				},
			},
		},
	},
	syncBlockOverflowStyles: {
		'.ProseMirror': {
			// eslint-disable-next-line @atlaskit/ui-styling-standard/no-unsafe-values, @atlaskit/ui-styling-standard/no-imported-style-values
			[`.${BodiedSyncBlockSharedCssClassName.content}`]: {
				// Contain floated elements (wrap-left/wrap-right) within synced block borders
				// Use display: flow-root to create a block formatting context without clipping other content e.g. telepointers
				display: 'flow-root',
			},
			// eslint-disable-next-line @atlaskit/ui-styling-standard/no-unsafe-values, @atlaskit/ui-styling-standard/no-imported-style-values
			[`.${SyncBlockSharedCssClassName.renderer}`]: {
				// Contain floated elements (wrap-left/wrap-right) within synced block borders
				// Use display: flow-root to create a block formatting context without clipping other content e.g. telepointers
				display: 'flow-root',
			},
		},
	},
	syncBlockStyles: {
		'.ProseMirror': {
			// eslint-disable-next-line @atlaskit/ui-styling-standard/no-unsafe-values, @atlaskit/ui-styling-standard/no-imported-style-values
			[`.${SyncBlockSharedCssClassName.prefix}, .${BodiedSyncBlockSharedCssClassName.prefix}`]: {
				marginRight: `-19px`,
				marginLeft: `-19px`,
			},
		},
	},
	syncBlockStylesBase: {
		'@property --angle': {
			syntax: '"<angle>"',
			initialValue: '0deg',
			inherits: 'false',
		},
		'.ProseMirror': {
			// eslint-disable-next-line @atlaskit/ui-styling-standard/no-unsafe-values, @atlaskit/ui-styling-standard/no-imported-style-values
			[`.${SyncBlockSharedCssClassName.prefix}, .${BodiedSyncBlockSharedCssClassName.prefix}`]: {
				position: 'relative',
				cursor: 'pointer',
				borderRadius: token('radius.small', '3px'),
				marginBottom: 0,
				marginTop: token('space.075'),
				paddingBlock: token('space.150'),
				color: 'inherit',

				/* Hover state */
				'&:hover': {
					// eslint-disable-next-line @atlaskit/design-system/ensure-design-token-usage
					boxShadow: `0px 0px 0px 1px ${token('color.border')}`,
					transition: 'box-shadow 200ms ease-in',

					// eslint-disable-next-line @atlaskit/ui-styling-standard/no-unsafe-values, @atlaskit/ui-styling-standard/no-imported-style-values
					[`.${SyncBlockLabelSharedCssClassName.labelClassName}`]: {
						opacity: 1,
						visibility: 'visible',
						transition: 'opacity 200ms ease-in, visibility 200ms ease-in',
					},
				},

				/* Selection state when cursor inside sync block */
				// eslint-disable-next-line @atlaskit/ui-styling-standard/no-unsafe-values, @atlaskit/ui-styling-standard/no-imported-style-values
				[`&.${BodiedSyncBlockSharedCssClassName.selectionInside}`]: {
					boxShadow: `0 0 0 1px ${token('color.border')}`,

					// eslint-disable-next-line @atlaskit/ui-styling-standard/no-unsafe-values, @atlaskit/ui-styling-standard/no-imported-style-values
					[`.${SyncBlockLabelSharedCssClassName.labelClassName}`]: {
						opacity: 1,
						visibility: 'visible',
					},
				},

				/* Node selection state */
				'&.ak-editor-selected-node': {
					boxShadow: `0 0 0 1px ${token('color.border.focused')}`,

					// eslint-disable-next-line @atlaskit/ui-styling-standard/no-unsafe-values, @atlaskit/ui-styling-standard/no-imported-style-values
					[`.${SyncBlockLabelSharedCssClassName.labelClassName}`]: {
						opacity: 1,
						visibility: 'visible',
						backgroundColor: token('color.background.selected'),
						top: '-14px',
						paddingBottom: token('space.050'),
						paddingTop: token('space.050'),
						'> span': {
							// eslint-disable-next-line @atlaskit/ui-styling-standard/no-important-styles
							color: `${token('color.text.selected')} !important`,
						},
					},
				},

				/* Danger state */
				'&.danger': {
					boxShadow: `0 0 0 1px ${token('color.border.danger')}`,

					'.ak-editor-panel__icon': {
						// eslint-disable-next-line @atlaskit/ui-styling-standard/no-important-styles
						color: `${token('color.icon.danger')} !important`,
					},

					// eslint-disable-next-line @atlaskit/ui-styling-standard/no-unsafe-values, @atlaskit/ui-styling-standard/no-imported-style-values
					[`.${SyncBlockLabelSharedCssClassName.labelClassName}`]: {
						backgroundColor: token('color.background.danger'),
						top: '-14px',
						paddingBottom: token('space.050'),
						paddingTop: token('space.050'),
						'> span': {
							// eslint-disable-next-line @atlaskit/ui-styling-standard/no-important-styles
							color: `${token('color.text.danger')} !important`,
						},
					},
				},

				/* Node disabled state */
				// eslint-disable-next-line @atlaskit/ui-styling-standard/no-unsafe-values, @atlaskit/ui-styling-standard/no-imported-style-values
				[`&.${SyncBlockStateCssClassName.disabledClassName}`]: {
					backgroundColor: token('color.background.disabled'),
					boxShadow: `0 0 0 1px ${token('color.border.disabled')}`,
					userSelect: 'none',

					// eslint-disable-next-line @atlaskit/ui-styling-standard/no-unsafe-values, @atlaskit/ui-styling-standard/no-imported-style-values
					[`.${SyncBlockLabelSharedCssClassName.labelClassName}`]: {
						backgroundColor: token('elevation.surface'),

						'&::before': {
							border: 'none',
						},
					},
				},

				/* Creation loading state */
				// eslint-disable-next-line @atlaskit/ui-styling-standard/no-unsafe-values, @atlaskit/ui-styling-standard/no-imported-style-values
				[`&.${SyncBlockStateCssClassName.creationLoadingClassName}`]: {
					animationName: syncBlockCreationLoadingKeyframes,
					animationDuration: '2s',
					animationTimingFunction: 'linear',
					animationIterationCount: 'infinite',
					border: '1px solid transparent',
					background: `linear-gradient(${token('elevation.surface')}, ${token('elevation.surface')}) padding-box, conic-gradient(from var(--angle), #1868DB, ${token('color.background.accent.purple.subtlest.pressed')}, #3279E0, #1868DB) border-box`,
					backgroundClip: 'padding-box, border-box',

					boxShadow: 'none',
					transition: 'box-shadow 200ms ease-in',

					// eslint-disable-next-line @atlaskit/ui-styling-standard/no-unsafe-values, @atlaskit/ui-styling-standard/no-imported-style-values
					[`.${SyncBlockLabelSharedCssClassName.labelClassName}`]: {
						display: 'none',
					},
				},

				/* Error state */
				/* In error state sync block should have disabled background colour */
				// eslint-disable-next-line @atlaskit/ui-styling-standard/no-unsafe-values, @atlaskit/ui-styling-standard/no-imported-style-values
				[`:has(.${SyncBlockSharedCssClassName.error})`]: {
					backgroundColor: token('color.background.disabled'),
				},

				// eslint-disable-next-line @atlaskit/ui-styling-standard/no-unsafe-values, @atlaskit/ui-styling-standard/no-imported-style-values
				[`:has(.${SyncBlockSharedCssClassName.loading})`]: {
					boxShadow: `0 0 0 1px ${token('color.border')}`,

					// eslint-disable-next-line @atlaskit/ui-styling-standard/no-unsafe-values, @atlaskit/ui-styling-standard/no-imported-style-values
					[`.${SyncBlockLabelSharedCssClassName.labelClassName}`]: {
						opacity: 0,
						visibility: 'hidden',
					},
				},

				/* Live doc view mode state */
				// eslint-disable-next-line @atlaskit/ui-styling-standard/no-unsafe-values, @atlaskit/ui-styling-standard/no-imported-style-values
				[`&.${SyncBlockStateCssClassName.viewModeClassName}`]: {
					boxShadow: 'none',
					backgroundColor: 'unset',

					// eslint-disable-next-line @atlaskit/ui-styling-standard/no-unsafe-values, @atlaskit/ui-styling-standard/no-imported-style-values
					[`.${SyncBlockLabelSharedCssClassName.labelClassName}`]: {
						opacity: 0,
						visibility: 'hidden',
					},
				},

				/* Dragging state */
				// eslint-disable-next-line @atlaskit/ui-styling-standard/no-unsafe-values, @atlaskit/ui-styling-standard/no-imported-style-values
				[`&.${SyncBlockStateCssClassName.draggingClassName}`]: {
					boxShadow: `0 0 0 1px ${token('color.border')}`,

					// eslint-disable-next-line @atlaskit/ui-styling-standard/no-unsafe-values, @atlaskit/ui-styling-standard/no-imported-style-values
					[`.${SyncBlockLabelSharedCssClassName.labelClassName}`]: {
						opacity: 1,
						visibility: 'visible',
					},
				},

				// eslint-disable-next-line @atlaskit/ui-styling-standard/no-unsafe-values, @atlaskit/ui-styling-standard/no-imported-style-values
				[`.${BodiedSyncBlockSharedCssClassName.content}`]: {
					paddingTop: 0,
					paddingBottom: 0,
					// eslint-disable-next-line @atlaskit/design-system/use-tokens-space
					paddingLeft: '19px',
					// eslint-disable-next-line @atlaskit/design-system/use-tokens-space
					paddingRight: '18px',
					cursor: 'text',
				},

				// eslint-disable-next-line @atlaskit/ui-styling-standard/no-unsafe-values, @atlaskit/ui-styling-standard/no-imported-style-values
				[`.${SyncBlockSharedCssClassName.renderer}`]: {
					paddingTop: 0,
					paddingBottom: 0,
					// eslint-disable-next-line @atlaskit/design-system/use-tokens-space
					paddingLeft: '19px',
					// eslint-disable-next-line @atlaskit/design-system/use-tokens-space
					paddingRight: '18px',
				},
			},
			// eslint-disable-next-line @atlaskit/ui-styling-standard/no-unsafe-values, @atlaskit/ui-styling-standard/no-imported-style-values
			[`.${BodiedSyncBlockSharedCssClassName.content}`]: {
				// First child node that has drag handle widget next to it is overridden with marginTop: 0, see globalStyles in editor-plugin-block-controls/src/ui/global-styles.tsx
				// Hence we set marginTop: 0 when by default to avoid flickering when hovering on and off the first node
				'> :nth-child(1 of :not(style, .ProseMirror-gapcursor, .ProseMirror-widget, span))': {
					marginTop: 0,
				},
			},
			// eslint-disable-next-line @atlaskit/ui-styling-standard/no-unsafe-values, @atlaskit/ui-styling-standard/no-imported-style-values
			[`.${SyncBlockSharedCssClassName.renderer}`]: {
				// First child node in bodiedSyncBlock is overridden with marginTop: 0, hence apply the same style to syncBlock for consistency
				'.ak-renderer-document > :first-child': {
					marginTop: 0,
				},
			},
		},

		// eslint-disable-next-line @atlaskit/ui-styling-standard/no-unsafe-values, @atlaskit/ui-styling-standard/no-imported-style-values
		'.ak-editor-sync-block__label': {
			borderRadius: token('radius.small', '3px'),
			position: 'absolute',
			gap: token('space.050'),
			justifyContent: 'center',
			alignItems: 'center',
			display: 'flex',
			opacity: 0,
			visibility: 'hidden',
			boxShadow: 'none',
			zIndex: 1,

			paddingLeft: token('space.100'),
			paddingRight: token('space.100'),

			top: '-10px',
			right: token('space.150'),
			backgroundColor: token('elevation.surface'),
			maxWidth: '140px',
		},
	},
	tableCommentEditorStyles: {
		'.ProseMirror .pm-table-wrapper > table': {
			marginLeft: 0,
			marginRight: 0,
			// scrollbarStyles
			msOverflowStyle: '-ms-autohiding-scrollbar',
			// eslint-disable-next-line @atlaskit/ui-styling-standard/no-unsafe-selectors
			'&::-webkit-scrollbar-corner': {
				display: 'none',
			},
			// eslint-disable-next-line @atlaskit/ui-styling-standard/no-unsafe-selectors
			'&::-webkit-scrollbar-thumb': {
				// eslint-disable-next-line @atlaskit/ui-styling-standard/no-unsafe-values
				backgroundColor: token('color.background.neutral.subtle'),
			},
			// eslint-disable-next-line @atlaskit/ui-styling-standard/no-unsafe-selectors
			'&:hover::-webkit-scrollbar-thumb': {
				backgroundColor: token('color.background.neutral.bold'),
				borderRadius: token('radius.large'),
			},
			// eslint-disable-next-line @atlaskit/ui-styling-standard/no-unsafe-selectors
			'&::-webkit-scrollbar-thumb:hover': {
				backgroundColor: token('color.background.neutral.bold.hovered'),
			},
		},
	},
	tableContainerStyles: {
		/* Fix for HOT-119925: Ensure table containers have proper width constraints and overflow handling */
		// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors
		'.ProseMirror .pm-table-wrapper': {
			maxWidth: '100%',
			overflowX: 'auto',
			// Ensure the wrapper doesn't grow beyond its container
			width: '100%',
			boxSizing: 'border-box',
		},

		// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors
		'.ProseMirror .pm-table-wrapper.pm-table-wrapper-no-overflow': {
			overflowX: 'visible',
		},

		/* Fix for HOT-119925: Ensure table elements are responsive and don't overflow */
		// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors
		'.ProseMirror .pm-table-wrapper table': {
			maxWidth: '100%',
			width: '100%',
			tableLayout: 'fixed',
			// Ensure tables can be scrolled horizontally if needed
			minWidth: 'auto',
		},
	},
	tableContentModeStyles: {
		// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors, @atlaskit/ui-styling-standard/no-unsafe-selectors
		'.pm-table-resizer-container:has(table[data-initial-width-mode="content"])': {
			// eslint-disable-next-line @atlaskit/ui-styling-standard/no-important-styles
			width: 'max-content !important',
			// eslint-disable-next-line @atlaskit/ui-styling-standard/no-unsafe-values
			'--ak-editor-table-width': 'max-content',
		},

		// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors, @atlaskit/ui-styling-standard/no-unsafe-selectors
		'.resizer-item:has(table[data-initial-width-mode="content"])': {
			// eslint-disable-next-line @atlaskit/ui-styling-standard/no-important-styles
			width: 'max-content !important',
		},

		// Reset the extended hover zone padding for content-mode tables so it doesn't
		// inflate the max-content width of parent elements (resizer-container, wrapper).
		// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors, @atlaskit/ui-styling-standard/no-unsafe-selectors
		'.resizer-item:has(table[data-initial-width-mode="content"]) > .resizer-hover-zone.resizer-is-extended':
			{
				padding: 'unset',
				left: 'unset',
			},

		// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors
		'.ProseMirror .pm-table-wrapper table[data-initial-width-mode="content"]': {
			tableLayout: 'auto',
			// eslint-disable-next-line @atlaskit/ui-styling-standard/no-important-styles
			width: 'max-content !important',
		},

		// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors
		'.ProseMirror .pm-table-wrapper table[data-initial-width-mode="content"] > colgroup > col': {
			// eslint-disable-next-line @atlaskit/ui-styling-standard/no-important-styles
			width: 'unset !important',
		},
	},
	tableEmptyRowStyles: {
		// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors
		'.ProseMirror .pm-table-wrapper': {
			// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors
			'.pm-table-cell-content-wrap, .pm-table-header-content-wrap': {
				// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors
				'p:empty': {
					/* add a minimum height to empty table rows in SSR */
					minHeight: '1.714em',
				},
			},
		},
	},
	tableLayoutFixes: {
		// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors, @atlaskit/ui-styling-standard/no-unsafe-selectors
		'.pm-table-header-content-wrap :not(.fabric-editor-alignment), .pm-table-header-content-wrap :not(p, .fabric-editor-block-mark) + div.fabric-editor-block-mark, .pm-table-cell-content-wrap :not(p, .fabric-editor-block-mark) + div.fabric-editor-block-mark':
			{
				// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors, @atlaskit/ui-styling-standard/no-unsafe-selectors
				'p:first-of-type': {
					marginTop: 0,
				},
			},
		// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors
		'.pm-table-cell-content-wrap .mediaGroupView-content-wrap': {
			clear: 'both',
		},
	},
	tableLayoutFixesWithFontSize: {
		// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors, @atlaskit/ui-styling-standard/no-unsafe-selectors
		'.pm-table-header-content-wrap :not(.fabric-editor-alignment, .fabric-editor-font-size), .pm-table-header-content-wrap :not(p, .fabric-editor-block-mark) + div.fabric-editor-block-mark, .pm-table-cell-content-wrap :not(p, .fabric-editor-block-mark) + div.fabric-editor-block-mark':
			{
				// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors, @atlaskit/ui-styling-standard/no-unsafe-selectors
				'p:first-of-type': {
					marginTop: 0,
				},
			},
		// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors
		'.pm-table-cell-content-wrap .mediaGroupView-content-wrap': {
			clear: 'both',
		},
	},
	// It was from "import { tableSharedStyle } from '@atlaskit/editor-common/styles';"
	tableSharedStyle: {
		'.pm-table-container': {
			position: 'relative',
			margin: `0 auto ${token('space.200')}`,
			boxSizing: 'border-box',
			/**
			 * Fix block top alignment inside table cells.
			 */
			'.decisionItemView-content-wrap:first-of-type > div': {
				marginTop: 0,
			},
			'.pm-table-right-border, .pm-table-left-border': {
				display: 'block',
				width: '1px',
				height: `calc(100% - ${token('space.300')})`,
				background: token('color.background.accent.gray.subtler'),
				position: 'absolute',
				top: token('space.300'),
			},
		},
		'.pm-table-container[data-number-column="true"]': {
			// eslint-disable-next-line @atlaskit/ui-styling-standard/no-imported-style-values, @atlaskit/ui-styling-standard/no-unsafe-values
			paddingLeft: `${akEditorTableNumberColumnWidth - 1}px`,
			clear: 'both',
		},
		'.pm-table-resizer-container': {
			willChange: 'width, margin-left',
		},
		'.pm-table-resizer-container table': {
			willChange: 'width',
		},
		'.pm-table-wrapper > table': {
			margin: `${token('space.300')} 0 0 0`,
		},
		'.pm-table-container > table, .pm-table-sticky-wrapper > table': {
			margin: `${token('space.300')} ${token('space.100')} 0 0`,
		},
		/* avoid applying styles to nested tables (possible via extensions) */
		'.pm-table-container > table, .pm-table-wrapper > table, .pm-table-sticky-wrapper > table': {
			borderCollapse: 'collapse',
			tableLayout: 'fixed',
			// eslint-disable-next-line @atlaskit/design-system/use-tokens-typography
			fontSize: '1em',
			width: '100%',

			'&[data-autosize="true"]': {
				tableLayout: 'auto',
			},

			'& *': {
				boxSizing: 'border-box',
			},
			'& hr': {
				boxSizing: 'content-box',
			},
			'& tbody': {
				borderBottom: 'none',
			},
			'& th td': {
				backgroundColor: `${token('color.background.neutral.subtle')}`,
			},
			'& > tbody > tr > th, & > tbody > tr > td': {
				// eslint-disable-next-line @atlaskit/ui-styling-standard/no-unsafe-values, @atlaskit/ui-styling-standard/no-imported-style-values
				minWidth: `${tableCellMinWidth}px`,
				fontWeight: token('font.weight.regular'),
				verticalAlign: 'top',
				border: `1px solid ${token('color.background.accent.gray.subtler')}`,
				borderRightWidth: 0,
				borderBottomWidth: 0,
				padding: token('space.100'),
				// it was from firstNodeWithNotMarginTop, and because platform_editor_nested_dnd_styles_changes is already in tidying phase, so didn't consider when it's off
				'> :nth-child(1 of :not(style, .ProseMirror-gapcursor, .ProseMirror-widget, span))': {
					marginTop: 0,
				},
				'th p:not(:first-of-type), td p:not(:first-of-type)': {
					marginTop: token('space.150'),
				},
			},
			/* Ensures nested tables are compatible with parent table background color - uses specificity to ensure tables nested by extensions are not affected */
			'& > tbody > tr > td': {
				backgroundColor: token('elevation.surface'),
			},
			'& th': {
				backgroundColor: token('color.background.accent.gray.subtlest'),
				textAlign: 'left',
				/* only apply this styling to codeblocks in default background headercells */
				/* TODO this needs to be overhauled as it relies on unsafe selectors */
				// platform_editor_native_anchor_with_dnd experiment is in tidying phase, so didn't consider the styles when it's off
				'&:not(.danger)': {
					'.code-block:not(.danger)': {
						backgroundColor: token('elevation.surface.raised'),
						':not(.ak-editor-selected-node)': {
							boxShadow: `0px 0px 0px 1px ${token('color.border')}`,
						},
						'.code-block-content-wrapper': {
							backgroundImage: 'var(--ak-editor--table-overflow-shadow)',
							backgroundColor: token('color.background.neutral'),
						},
						'.line-number-gutter': {
							backgroundColor: token('color.background.neutral'),
						},
						/* this is only relevant to the element taken care of by renderer */
						'> [data-ds--code--code-block]': {
							// eslint-disable-next-line @atlaskit/ui-styling-standard/no-important-styles
							backgroundImage: 'var(--ak-editor--table-overflow-shadow) !important',
							// eslint-disable-next-line @atlaskit/ui-styling-standard/no-important-styles
							backgroundColor: `${token('color.background.neutral')}!important`,
							/* selector lives inside @atlaskit/code */
							'--ds--code--line-number-bg-color': token('color.background.neutral'),
						},
					},
				},
			},
		},
	},
	tableSharedStyleBackgroundClipFix: {
		'.pm-table-container > table, .pm-table-wrapper > table, .pm-table-sticky-wrapper > table': {
			'& > tbody > tr > th, & > tbody > tr > td': {
				backgroundClip: 'padding-box',
			},
		},
	},
	tableSharedStyle_with_platform_editor_table_q4_loveability: {
		'.pm-table-container': {
			'.pm-table-right-border, .pm-table-left-border': {
				display: 'none',
			},
		},
		'.pm-table-container > table, .pm-table-wrapper > table, .pm-table-sticky-wrapper > table': {
			border: `${tableCellBorderWidth}px solid transparent`,
			position: 'relative',
			'&::after': {
				content: "''",
				position: 'absolute',
				inset: '-0.5px',
				border: `${tableCellBorderWidth}px solid ${token('color.background.accent.gray.subtler')}`,
				borderRadius: token('radius.xlarge'),
				pointerEvents: 'none',
				zIndex: 1,
			},

			/* Let the wrapper overlay own the outer table perimeter.
				data-reaches-* attributes are set by the TableCell node view. */
			'& > tbody > tr > th[data-reaches-top], & > tbody > tr > td[data-reaches-top]': {
				borderTopColor: 'transparent',
			},

			'& > tbody > tr > th[data-reaches-left], & > tbody > tr > td[data-reaches-left]': {
				borderLeftColor: 'transparent',
			},

			'& > tbody > tr > td[data-reaches-left]::after': {
				borderLeftColor: 'transparent',
			},

			'& > tbody > tr > th[data-reaches-bottom]::after, & > tbody > tr > td[data-reaches-bottom]::after':
				{
					borderBottomColor: 'transparent',
				},

			/* The rounded-table overlay owns transparent perimeter borders.
			   Paint edge cell backgrounds into that reserved border area so coloured
			   first/last rows do not show the page background through 1px seams. */
			'& > tbody > tr > th[data-reaches-top], & > tbody > tr > td[data-reaches-top], & > tbody > tr > th[data-reaches-bottom], & > tbody > tr > td[data-reaches-bottom]':
				{
					backgroundClip: 'border-box',
				},
		},
		/* When the number column is enabled, the left visual edge belongs to the number column.
		Remove the left border-radius and left border from the table's ::after overlay
		so it doesn't double-up or round where the number column already provides that edge. */
		'.pm-table-container[data-number-column="true"]': {
			'> .pm-table-wrapper > table::after, > .pm-table-sticky-wrapper > table::after': {
				borderTopLeftRadius: 0,
				borderBottomLeftRadius: 0,
				borderLeftColor: 'transparent',
			},
		},
	},
	tableSharedStyle_without_platform_editor_table_q4_loveability: {
		'.pm-table-container': {
			'.pm-table-right-border, .pm-table-left-border': {
				display: 'block',

				width: 1,
				height: `calc(100% - ${token('space.300')})`,
				background: token('color.background.accent.gray.subtler'),
				position: 'absolute',
				top: token('space.300'),
			},

			'.pm-table-right-border': {
				right: 0,
			},
			'.pm-table-left-border': {
				left: 0,
			},
			'.pm-table-left-border[data-with-numbered-table="true"]': {
				// eslint-disable-next-line @atlaskit/ui-styling-standard/no-imported-style-values, @atlaskit/ui-styling-standard/no-unsafe-values
				left: `${akEditorTableNumberColumnWidth - 1}px`,
			},
		},
		'.pm-table-container > table, .pm-table-wrapper > table, .pm-table-sticky-wrapper > table': {
			// eslint-disable-next-line @atlaskit/ui-styling-standard/no-imported-style-values, @atlaskit/ui-styling-standard/no-unsafe-values
			border: `${tableCellBorderWidth}px solid ${token('color.background.accent.gray.subtler')}`,
			borderLeftColor: 'transparent',
			borderRightColor: 'transparent',
		},
	},
	tableSharedStyle_with_platform_editor_table_menu_updates: {
		'.pm-table-container > table, .pm-table-wrapper > table, .pm-table-sticky-wrapper > table': {
			'& > tbody > tr > th, & > tbody > tr > td': {
				'&[data-valign="middle"]': {
					verticalAlign: 'middle',
				},
				'&[data-valign="bottom"]': {
					verticalAlign: 'bottom',
				},
			},
		},
	},
	/* support panel nested in table, only when platform_editor_bordered_panel_nested_in_table fg is on */
	tableSharedStyle_with_platform_editor_bordered_panel_nested_in_table: {
		'.pm-table-wrapper .ak-editor-panel': {
			borderWidth: token('border.width'),
			borderStyle: 'solid',
			borderColor: token('color.border'),
		},
	},
	taskItemCheckboxStyles: {
		/**
		 * Background
		 */
		'--local-background': token('color.background.input'),
		'--local-background-active': token('color.background.input.pressed'),
		'--local-background-checked': token('color.background.selected.bold'),
		'--local-background-checked-hover': token('color.background.selected.bold.hovered'),
		'--local-background-disabled': token('color.background.disabled'),
		'--local-background-hover': token('color.background.input.hovered'),
		/**
		 * Border
		 */
		'--local-border': token('color.border.input'),
		'--local-border-active': token('color.border'),
		'--local-border-checked': token('color.background.selected.bold'),
		'--local-border-checked-hover': token('color.background.selected.bold.hovered'),
		'--local-border-checked-invalid': token('color.border.danger'),
		'--local-border-disabled': token('color.background.disabled'),
		'--local-border-focus': token('color.border.focused'),
		'--local-border-hover': token('color.border.input'),
		'--local-border-invalid': token('color.border.danger'),
		/**
		 * Tick
		 */
		'--local-tick-active': token('color.icon.inverse'),
		'--local-tick-checked': token('color.icon.inverse'),
		'--local-tick-disabled': token('color.icon.disabled'),
		'--local-tick-rest': 'transparent',

		'[data-prosemirror-node-name="taskItem"] .task-item-checkbox-wrap, [data-prosemirror-node-name="blockTaskItem"] .task-item-checkbox-wrap':
			{
				flex: '0 0 24px',
				width: '24px',
				height: '24px',
				position: 'relative',
				alignSelf: 'start',
				"& > input[type='checkbox']": {
					opacity: 0,
					width: '100%',
					height: '100%',
					zIndex: 1,
					cursor: 'pointer',
					outline: 'none',
					margin: 0,
					position: 'absolute',
					'&[disabled]': {
						cursor: 'default',
					},
					'& + svg': {
						'--checkbox-background-color': 'var(--local-background)',
						'--checkbox-border-color': 'var(--local-border)',
						'--checkbox-tick-color': 'var(--local-tick-rest)',
						color: 'var(--checkbox-background-color)',
						fill: 'var(--checkbox-tick-color)',
						transition: 'color 0.2s ease-in-out, fill 0.2s ease-in-out',
						boxSizing: 'border-box',
						display: 'inline',
						position: 'absolute',
						top: '50%',
						left: '50%',
						transform: 'translate(-50%, -50%)',
						'rect:first-of-type': {
							stroke: 'var(--checkbox-border-color)',
							strokeWidth: token('border.width'),
							transition: 'stroke 0.2s ease-in-out',
						},
					},
					'&:focus + svg, &:checked:focus + svg': {
						borderRadius: token('radius.small', '0.25rem'),
						outline: `${token('border.width.focused')} solid ${token('color.border.focused')}`,
						outlineOffset: token('space.negative.025'),
					},
					'&:hover + svg': {
						'--checkbox-background-color': 'var(--local-background-hover)',
						'--checkbox-border-color': 'var(--local-border-hover)',
					},
					'&:checked:hover + svg': {
						'--checkbox-background-color': 'var(--local-background-checked-hover)',
						'--checkbox-border-color': 'var(--local-border-checked-hover)',
					},
					'&:checked + svg': {
						'--checkbox-background-color': 'var(--local-background-checked)',
						'--checkbox-border-color': 'var(--local-border-checked)',
						'--checkbox-tick-color': 'var(--local-tick-checked)',
					},
					'&:active + svg': {
						'--checkbox-background-color': 'var(--local-background-active)',
						'--checkbox-border-color': 'var(--local-border-active)',
					},
					'&:checked:active + svg': {
						'--checkbox-background-color': 'var(--local-background-active)',
						'--checkbox-border-color': 'var(--local-border-active)',
						'--checkbox-tick-color': 'var(--local-tick-active)',
					},
					'&:disabled + svg, &:disabled:hover + svg, &:disabled:focus + svg, &:disabled:active + svg, &:disabled[data-invalid] + svg':
						{
							'--checkbox-background-color': 'var(--local-background-disabled)',
							'--checkbox-border-color': 'var(--local-border-disabled)',
							cursor: 'not-allowed',
							pointerEvents: 'none',
						},
					'&:disabled:checked + svg': {
						'--checkbox-tick-color': 'var(--local-tick-disabled)',
					},
				},
			},
	},
	taskItemStyles: {
		'[data-prosemirror-node-name="taskItem"]': {
			listStyle: 'none',
		},
		'[data-prosemirror-node-name="taskItem"] [data-component="task-item-main"]': {
			display: 'flex',
			flexDirection: 'row',
			position: 'relative',
		},
		'[data-prosemirror-node-name="taskItem"] [data-component="placeholder"]': {
			position: 'absolute',
			color: token('color.text.subtlest'),
			margin: `0 0 0 calc(${token('space.100')} * 3)`,
			pointerEvents: 'none',
			textOverflow: 'ellipsis',
			overflow: 'hidden',
			whiteSpace: 'nowrap',
			maxWidth: 'calc(100% - 50px)',
			display: 'none',
		},
		"[data-prosemirror-node-name='taskItem']:has([data-empty]):not(:has([data-type-ahead])) [data-component='placeholder']":
			{
				display: 'block',
			},
		'[data-prosemirror-node-name="taskItem"] [data-component="content"]': {
			margin: 0,
			wordWrap: 'break-word',
			minWidth: 0,
			flex: '1 1 auto',
		},
	},
	taskItemStylesWithBlockTaskItem: {
		'[data-prosemirror-node-name="taskItem"], [data-prosemirror-node-name="blockTaskItem"]': {
			listStyle: 'none',
		},
		'[data-prosemirror-node-name="taskItem"] [data-component="task-item-main"], [data-prosemirror-node-name="blockTaskItem"] [data-component="task-item-main"]':
			{
				display: 'flex',
				flexDirection: 'row',
				position: 'relative',
			},
		'[data-prosemirror-node-name="taskItem"] [data-component="placeholder"], [data-prosemirror-node-name="blockTaskItem"] [data-component="placeholder"]':
			{
				position: 'absolute',
				color: token('color.text.subtlest'),
				margin: `0 0 0 calc(${token('space.100')} * 3)`,
				pointerEvents: 'none',
				textOverflow: 'ellipsis',
				overflow: 'hidden',
				whiteSpace: 'nowrap',
				maxWidth: 'calc(100% - 50px)',
				display: 'none',
			},
		"[data-prosemirror-node-name='taskItem']:has([data-empty]):not(:has([data-type-ahead])) [data-component='placeholder'], [data-prosemirror-node-name='blockTaskItem']:has([data-empty]):not(:has([data-type-ahead])) [data-component='placeholder']":
			{
				display: 'block',
			},
		'[data-prosemirror-node-name="taskItem"] [data-component="content"], [data-prosemirror-node-name="blockTaskItem"] [data-component="content"]':
			{
				margin: 0,
				wordWrap: 'break-word',
				minWidth: 0,
				flex: '1 1 auto',
			},
	},
	tasksAndDecisionsStyles: {
		'.ProseMirror': {
			'.taskItemView-content-wrap, .decisionItemView-content-wrap': {
				position: 'relative',
				minWidth: 48,
			},
			'.decisionItemView-content-wrap': {
				marginTop: 0,
			},
			'.taskItemView-content-wrap': {
				"span[contenteditable='false']": {
					height: `${akEditorLineHeight}em`,
				},
			},
			'.task-item': {
				// eslint-disable-next-line @atlaskit/design-system/use-tokens-typography
				lineHeight: akEditorLineHeight,
			},
		},
		'div[data-task-local-id]': {
			"span[contenteditable='false']": {
				height: `${akEditorLineHeight}em`,
			},
			"span[contenteditable='false'] + div": {
				// eslint-disable-next-line @atlaskit/design-system/use-tokens-typography
				lineHeight: `${akEditorLineHeight}em`,
			},
		},
		'div[data-task-list-local-id]': {
			margin: `${token('space.150')} 0 0 0`,
			// If task item is not first in the list then set margin top to 4px.
			'div + div': {
				marginTop: token('space.050'),
			},
		},
		// If task list is not first in the document then set margin top to 4px.
		'div[data-task-list-local-id] div[data-task-list-local-id]': {
			marginTop: token('space.050'),
			marginLeft: token('space.300'),
		},
		// When action list is inside panel
		'.ak-editor-panel__content': {
			'> div[data-task-list-local-id]:first-child': {
				// eslint-disable-next-line @atlaskit/ui-styling-standard/no-important-styles
				margin: '0 !important',
			},
		},
	},
	tasksAndDecisionsDenseStyles: {
		'.ProseMirror': {
			// Task lists
			// eslint-disable-next-line @atlaskit/ui-styling-standard/no-unsafe-values
			[TaskDecisionSharedCssClassName.TASK_LIST_CONTAINER]: {
				// Task lists: container top margin
				marginTop: `max(0px, calc(10px + (var(--ak-editor-base-font-size, ${akEditorFullPageDefaultFontSize}px) - ${akEditorFullPageDenseFontSize}px) * (2 / 3)))`,
			},

			// Task lists: sibling items and nested lists
			// eslint-disable-next-line @atlaskit/ui-styling-standard/no-unsafe-values
			[`${TaskDecisionSharedCssClassName.TASK_LIST_CONTAINER} > * + *`]: {
				marginTop: `max(0px, calc((var(--ak-editor-base-font-size, ${akEditorFullPageDefaultFontSize}px) - ${akEditorFullPageDenseFontSize}px) * (4 / 3)))`,
			},
			// eslint-disable-next-line @atlaskit/ui-styling-standard/no-unsafe-values
			[`${TaskDecisionSharedCssClassName.TASK_LIST_CONTAINER} ${TaskDecisionSharedCssClassName.TASK_LIST_CONTAINER}, .${TaskDecisionSharedCssClassName.TASK_CONTAINER} .${TaskDecisionSharedCssClassName.TASK_CONTAINER}`]:
				{
					marginTop: `max(0px, calc((var(--ak-editor-base-font-size, ${akEditorFullPageDefaultFontSize}px) - ${akEditorFullPageDenseFontSize}px) * (4 / 3)))`,
				},
		},
	},
	statusDangerStyles: {
		'.statusView-content-wrap:not(.search-match-block)': {
			'&.ak-editor-selected-node.danger .status-lozenge-span > span': {
				boxShadow: `0 0 0 2px ${token('color.border.danger')}`,
			},
		},
	},
	statusStyles: {
		'.pm-table-cell-content-wrap, .pm-table-header-content-wrap, [data-layout-section]': {
			'.statusView-content-wrap': {
				maxWidth: '100%',
				// eslint-disable-next-line @atlaskit/design-system/use-tokens-typography
				lineHeight: 0,

				'& > span': {
					width: '100%',
				},
			},
		},
		'.statusView-content-wrap': {
			'& > span': {
				cursor: 'pointer',
				// eslint-disable-next-line @atlaskit/design-system/use-tokens-typography
				lineHeight: 0, // Prevent responsive layouts increasing height of container.
			},
		},
		'.danger': {
			'.status-lozenge-span > span': {
				// eslint-disable-next-line @atlaskit/design-system/ensure-design-token-usage
				backgroundColor: 'rgba(255, 189, 173, 0.5)', // akEditorDeleteBackgroundWithOpacity
			},
			'.statusView-content-wrap.ak-editor-selected-node': {
				'.status-lozenge-span > span': {
					boxShadow: `0 0 0 1px ${token('color.border.danger')}`,
				},
			},
		},

		'[data-prosemirror-node-name="status"] .lozenge-wrapper': {
			backgroundColor: token('color.background.neutral'),
			maxWidth: '100%',
			paddingInline: token('space.050'),
			display: 'inline-flex',
			// eslint-disable-next-line @atlaskit/design-system/no-unsafe-design-token-usage
			borderRadius: token('radius.small', '3px'),
			blockSize: 'min-content',
			position: 'static',
			overflow: 'hidden',
			boxSizing: 'border-box',
			appearance: 'none',
			border: 'none',
		},

		'[data-prosemirror-node-name="status"] .lozenge-text': {
			// eslint-disable-next-line @atlaskit/design-system/use-tokens-typography
			font: `normal ${token('font.weight.bold')} 11px/16px ${token('font.family.body')}`,
			overflow: 'hidden',
			textOverflow: 'ellipsis',
			// eslint-disable-next-line @atlaskit/design-system/use-tokens-typography
			textTransform: 'uppercase',
			whiteSpace: 'nowrap',
			maxWidth: `calc(200px - ${token('space.100')})`,
		},
	},
	statusStylesMixin_fg_platform_component_visual_refresh: {
		'.statusView-content-wrap': {
			'&.ak-editor-selected-node .status-lozenge-span > span': {
				boxShadow: `0 0 0 2px ${token('color.border.selected')}`,
			},
		},

		'[data-prosemirror-node-name="status"] .lozenge-text': {
			// eslint-disable-next-line @atlaskit/design-system/ensure-design-token-usage
			color: '#292A2E',
		},
		'[data-prosemirror-node-name="status"] > [data-color=neutral] > .lozenge-wrapper': {
			// eslint-disable-next-line @atlaskit/design-system/ensure-design-token-usage
			backgroundColor: '#DDDEE1',
		},
		'[data-prosemirror-node-name="status"] > [data-color=purple] > .lozenge-wrapper': {
			// eslint-disable-next-line @atlaskit/design-system/ensure-design-token-usage
			backgroundColor: '#D8A0F7',
		},
		'[data-prosemirror-node-name="status"] > [data-color=blue] > .lozenge-wrapper': {
			// eslint-disable-next-line @atlaskit/design-system/ensure-design-token-usage
			backgroundColor: '#8FB8F6',
		},
		'[data-prosemirror-node-name="status"] > [data-color=yellow] > .lozenge-wrapper': {
			// eslint-disable-next-line @atlaskit/design-system/ensure-design-token-usage
			backgroundColor: '#F9C84E',
		},
		'[data-prosemirror-node-name="status"] > [data-color=red] > .lozenge-wrapper': {
			// eslint-disable-next-line @atlaskit/design-system/ensure-design-token-usage
			backgroundColor: '#FD9891',
		},
		'[data-prosemirror-node-name="status"] > [data-color=green] > .lozenge-wrapper': {
			// eslint-disable-next-line @atlaskit/design-system/ensure-design-token-usage
			backgroundColor: '#B3DF72',
		},
	},
	statusStylesMixin_fg_platform_component_visual_refresh_with_search_match: {
		'.statusView-content-wrap:not(.search-match-block)': {
			'&.ak-editor-selected-node .status-lozenge-span > span': {
				boxShadow: `0 0 0 2px ${token('color.border.selected')}`,
			},
		},

		'[data-prosemirror-node-name="status"] .lozenge-text': {
			// eslint-disable-next-line @atlaskit/design-system/ensure-design-token-usage
			color: '#292A2E',
		},
		'[data-prosemirror-node-name="status"] > [data-color=neutral] > .lozenge-wrapper': {
			// eslint-disable-next-line @atlaskit/design-system/ensure-design-token-usage
			backgroundColor: '#DDDEE1',
		},
		'[data-prosemirror-node-name="status"] > [data-color=purple] > .lozenge-wrapper': {
			// eslint-disable-next-line @atlaskit/design-system/ensure-design-token-usage
			backgroundColor: '#D8A0F7',
		},
		'[data-prosemirror-node-name="status"] > [data-color=blue] > .lozenge-wrapper': {
			// eslint-disable-next-line @atlaskit/design-system/ensure-design-token-usage
			backgroundColor: '#8FB8F6',
		},
		'[data-prosemirror-node-name="status"] > [data-color=yellow] > .lozenge-wrapper': {
			// eslint-disable-next-line @atlaskit/design-system/ensure-design-token-usage
			backgroundColor: '#F9C84E',
		},
		'[data-prosemirror-node-name="status"] > [data-color=red] > .lozenge-wrapper': {
			// eslint-disable-next-line @atlaskit/design-system/ensure-design-token-usage
			backgroundColor: '#FD9891',
		},
		'[data-prosemirror-node-name="status"] > [data-color=green] > .lozenge-wrapper': {
			// eslint-disable-next-line @atlaskit/design-system/ensure-design-token-usage
			backgroundColor: '#B3DF72',
		},
	},
	statusStylesMixin_without_fg_platform_component_visual_refresh: {
		'.statusView-content-wrap': {
			'&.ak-editor-selected-node .status-lozenge-span > span': {
				// getSelectionStyles([SelectionStyle.BoxShadow]);
				boxShadow: `0 0 0 1px ${token('color.border.selected')}`,
				borderColor: 'transparent',
				// hideNativeBrowserTextSelectionStyles
				'&::selection, & *::selection': {
					backgroundColor: 'transparent',
				},
				'&::-moz-selection, & *::-moz-selection': {
					backgroundColor: 'transparent',
				},
			},
		},

		'[data-prosemirror-node-name="status"] > [data-color=neutral] .lozenge-wrapper': {
			backgroundColor: token('color.background.neutral'),
		},
		'[data-prosemirror-node-name="status"] > [data-color=neutral] .lozenge-text': {
			color: token('color.text.subtle'),
		},
		'[data-prosemirror-node-name="status"] > [data-color=purple] .lozenge-wrapper': {
			backgroundColor: token('color.background.discovery'),
		},
		'[data-prosemirror-node-name="status"] > [data-color=purple] .lozenge-text': {
			color: token('color.text.discovery'),
		},
		'[data-prosemirror-node-name="status"] > [data-color=blue] .lozenge-wrapper': {
			backgroundColor: token('color.background.information'),
		},
		'[data-prosemirror-node-name="status"] > [data-color=blue] .lozenge-text': {
			color: token('color.text.information'),
		},
		'[data-prosemirror-node-name="status"] > [data-color=yellow] .lozenge-wrapper': {
			backgroundColor: token('color.background.warning'),
		},
		'[data-prosemirror-node-name="status"] > [data-color=yellow] .lozenge-text': {
			color: token('color.text.warning'),
		},
		'[data-prosemirror-node-name="status"] > [data-color=red] .lozenge-wrapper': {
			backgroundColor: token('color.background.danger'),
		},
		'[data-prosemirror-node-name="status"] > [data-color=red] .lozenge-text': {
			color: token('color.text.danger'),
		},
		'[data-prosemirror-node-name="status"] > [data-color=green] .lozenge-wrapper': {
			backgroundColor: token('color.background.success'),
		},
		'[data-prosemirror-node-name="status"] > [data-color=green] .lozenge-text': {
			color: token('color.text.success'),
		},
	},
	statusStylesMixin_without_fg_platform_component_visual_refresh_with_search_match: {
		'.statusView-content-wrap:not(.search-match-block)': {
			'&.ak-editor-selected-node .status-lozenge-span > span': {
				// getSelectionStyles([SelectionStyle.BoxShadow]);
				boxShadow: `0 0 0 1px ${token('color.border.selected')}`,
				borderColor: 'transparent',
				// hideNativeBrowserTextSelectionStyles
				'&::selection, & *::selection': {
					backgroundColor: 'transparent',
				},
				'&::-moz-selection, & *::-moz-selection': {
					backgroundColor: 'transparent',
				},
			},
		},

		'[data-prosemirror-node-name="status"] > [data-color=neutral] .lozenge-wrapper': {
			backgroundColor: token('color.background.neutral'),
		},
		'[data-prosemirror-node-name="status"] > [data-color=neutral] .lozenge-text': {
			color: token('color.text.subtle'),
		},
		'[data-prosemirror-node-name="status"] > [data-color=purple] .lozenge-wrapper': {
			backgroundColor: token('color.background.discovery'),
		},
		'[data-prosemirror-node-name="status"] > [data-color=purple] .lozenge-text': {
			color: token('color.text.discovery'),
		},
		'[data-prosemirror-node-name="status"] > [data-color=blue] .lozenge-wrapper': {
			backgroundColor: token('color.background.information'),
		},
		'[data-prosemirror-node-name="status"] > [data-color=blue] .lozenge-text': {
			color: token('color.text.information'),
		},
		'[data-prosemirror-node-name="status"] > [data-color=yellow] .lozenge-wrapper': {
			backgroundColor: token('color.background.warning'),
		},
		'[data-prosemirror-node-name="status"] > [data-color=yellow] .lozenge-text': {
			color: token('color.text.warning'),
		},
		'[data-prosemirror-node-name="status"] > [data-color=red] .lozenge-wrapper': {
			backgroundColor: token('color.background.danger'),
		},
		'[data-prosemirror-node-name="status"] > [data-color=red] .lozenge-text': {
			color: token('color.text.danger'),
		},
		'[data-prosemirror-node-name="status"] > [data-color=green] .lozenge-wrapper': {
			backgroundColor: token('color.background.success'),
		},
		'[data-prosemirror-node-name="status"] > [data-color=green] .lozenge-text': {
			color: token('color.text.success'),
		},
	},
	statusStylesTeam26: {
		'[data-prosemirror-node-name="status"] .lozenge-wrapper': {
			paddingBlockStart: token('space.025'),
			paddingBlockEnd: token('space.025'),
			paddingInlineStart: token('space.050'),
			paddingInlineEnd: token('space.050'),
			alignItems: 'center',
			// eslint-disable-next-line @atlaskit/design-system/no-unsafe-design-token-usage
			borderRadius: token('radius.small', '4px'),
			// eslint-disable-next-line @atlaskit/design-system/use-tokens-typography
			height: '1.25rem',
			border: `solid ${token('border.width')} transparent`,
		},

		'[data-prosemirror-node-name="status"] .lozenge-text': {
			// eslint-disable-next-line @atlaskit/design-system/use-tokens-typography
			textTransform: 'none',
			font: token('font.body.small'),
		},

		/* Border, background and text colors
		 * These colors are copied from @atlaskit/lozenge
		 * DST is currently using oklch with different light and dark lightness factors
		 * and suggest using hex colors until the design tokens are added
		 */
		'[data-prosemirror-node-name="status"] > [data-color=neutral] > .lozenge-wrapper': {
			backgroundColor: token('color.background.neutral'),
			// eslint-disable-next-line @atlaskit/design-system/ensure-design-token-usage
			borderColor: '#CACBCF',
		},
		'[data-prosemirror-node-name="status"] > [data-color=neutral] .lozenge-text': {
			color: token('color.text'),
		},
		'[data-prosemirror-node-name="status"] > [data-color=purple] > .lozenge-wrapper': {
			backgroundColor: token('color.background.discovery.subtler'),
			// eslint-disable-next-line @atlaskit/design-system/ensure-design-token-usage
			borderColor: '#D8A0F7',
		},
		'[data-prosemirror-node-name="status"] > [data-color=purple] .lozenge-text': {
			color: token('color.text.discovery.bolder'),
		},
		'[data-prosemirror-node-name="status"] > [data-color=blue] > .lozenge-wrapper': {
			backgroundColor: token('color.background.information.subtler'),
			// eslint-disable-next-line @atlaskit/design-system/ensure-design-token-usage
			borderColor: '#8FB8F6',
		},
		'[data-prosemirror-node-name="status"] > [data-color=blue] .lozenge-text': {
			color: token('color.text.information.bolder'),
		},
		'[data-prosemirror-node-name="status"] > [data-color=red] > .lozenge-wrapper': {
			backgroundColor: token('color.background.danger.subtler'),
			// eslint-disable-next-line @atlaskit/design-system/ensure-design-token-usage
			borderColor: '#FD9891',
		},
		'[data-prosemirror-node-name="status"] > [data-color=red] .lozenge-text': {
			color: token('color.text.danger.bolder'),
		},
		'[data-prosemirror-node-name="status"] > [data-color=yellow] > .lozenge-wrapper': {
			backgroundColor: token('color.background.warning.subtler'),
			// eslint-disable-next-line @atlaskit/design-system/ensure-design-token-usage
			borderColor: '#FBC828',
		},
		'[data-prosemirror-node-name="status"] > [data-color=yellow] .lozenge-text': {
			color: token('color.text.warning.bolder'),
		},
		'[data-prosemirror-node-name="status"] > [data-color=green] > .lozenge-wrapper': {
			backgroundColor: token('color.background.success.subtler'),
			// eslint-disable-next-line @atlaskit/design-system/ensure-design-token-usage
			borderColor: '#B3DF72',
		},
		'[data-prosemirror-node-name="status"] > [data-color=green] .lozenge-text': {
			color: token('color.text.success.bolder'),
		},

		/* Find and Replace Styles */
		'.statusView-content-wrap:not(.search-match-block)': {
			'&.ak-editor-selected-node .status-lozenge-span > span': {
				boxShadow: `0 0 0 2px ${token('color.border.selected')}`,
			},
		},

		'.danger': {
			'.statusView-content-wrap:not(.search-match-block).ak-editor-selected-node .status-lozenge-span > span':
				{
					boxShadow: `0 0 0 2px ${token('color.border.danger')}`,
				},
		},
	},
	statusStylesTeam26DarkMode: {
		'[data-prosemirror-node-name="status"] > [data-color=neutral] > .lozenge-wrapper': {
			// eslint-disable-next-line @atlaskit/design-system/ensure-design-token-usage
			borderColor: '#63666B',
		},
		'[data-prosemirror-node-name="status"] > [data-color=purple] > .lozenge-wrapper': {
			// eslint-disable-next-line @atlaskit/design-system/ensure-design-token-usage
			borderColor: '#803FA5',
		},
		'[data-prosemirror-node-name="status"] > [data-color=blue] > .lozenge-wrapper': {
			// eslint-disable-next-line @atlaskit/design-system/ensure-design-token-usage
			borderColor: '#1558BC',
		},
		'[data-prosemirror-node-name="status"] > [data-color=red] > .lozenge-wrapper': {
			// eslint-disable-next-line @atlaskit/design-system/ensure-design-token-usage
			borderColor: '#AE2E24',
		},
		'[data-prosemirror-node-name="status"] > [data-color=yellow] > .lozenge-wrapper': {
			// eslint-disable-next-line @atlaskit/design-system/ensure-design-token-usage
			borderColor: '#9E4C00',
		},
		'[data-prosemirror-node-name="status"] > [data-color=green] > .lozenge-wrapper': {
			// eslint-disable-next-line @atlaskit/design-system/ensure-design-token-usage
			borderColor: '#4C6B1F',
		},
	},
	telepointerColorAndCommonStyle: {
		'.ProseMirror .telepointer': {
			position: 'relative',
			transitionProperty: 'opacity',
			transitionDuration: '200ms',
			// eslint-disable-next-line @atlaskit/ui-styling-standard/no-unsafe-selectors
			'&.telepointer-selection:not(.inlineNodeView)': {
				// eslint-disable-next-line @atlaskit/design-system/use-tokens-typography
				lineHeight: 1.2,
				pointerEvents: 'none',
				userSelect: 'none',
			},
			'&.telepointer-dim': {
				opacity: 0.2,
			},
			'&.color-0': {
				'--telepointer-participant-text-color': token('color.text.inverse'),
				'--telepointer-participant-bg-color': token('color.background.accent.red.bolder'),
			},
			'&.color-1': {
				'--telepointer-participant-text-color': token('color.text.inverse'),
				'--telepointer-participant-bg-color': token('color.background.accent.blue.bolder'),
			},
			'&.color-2': {
				'--telepointer-participant-text-color': token('color.text.inverse'),
				'--telepointer-participant-bg-color': token('color.background.accent.green.bolder'),
			},
			'&.color-3': {
				'--telepointer-participant-text-color': token('color.text.inverse'),
				'--telepointer-participant-bg-color': token('color.background.accent.yellow.bolder'),
			},
			'&.color-4': {
				'--telepointer-participant-text-color': token('color.text.inverse'),
				'--telepointer-participant-bg-color': token('color.background.accent.purple.bolder'),
			},
			'&.color-5': {
				'--telepointer-participant-text-color': token('color.text.inverse'),
				'--telepointer-participant-bg-color': token('color.background.accent.magenta.bolder'),
			},
			'&.color-6': {
				'--telepointer-participant-text-color': token('color.text.inverse'),
				'--telepointer-participant-bg-color': token('color.background.accent.teal.bolder'),
			},
			'&.color-7': {
				'--telepointer-participant-text-color': token('color.text.inverse'),
				'--telepointer-participant-bg-color': token('color.background.accent.orange.bolder'),
			},
			'&.color-8': {
				'--telepointer-participant-text-color': token('color.text.inverse'),
				'--telepointer-participant-bg-color': token('color.background.accent.lime.bolder'),
			},
			'&.color-9': {
				'--telepointer-participant-text-color': token('color.text.inverse'),
				'--telepointer-participant-bg-color': token('color.background.accent.gray.bolder'),
			},
			'&.color-10': {
				'--telepointer-participant-text-color': token('color.text.accent.gray.bolder'),
				'--telepointer-participant-bg-color': token('color.background.accent.blue.subtle'),
			},
			'&.color-11': {
				'--telepointer-participant-text-color': token('color.text.accent.gray.bolder'),
				'--telepointer-participant-bg-color': token('color.background.accent.red.subtle'),
			},
			'&.color-12': {
				'--telepointer-participant-text-color': token('color.text.accent.gray.bolder'),
				'--telepointer-participant-bg-color': token('color.background.accent.orange.subtle'),
			},
			'&.color-13': {
				'--telepointer-participant-text-color': token('color.text.accent.gray.bolder'),
				'--telepointer-participant-bg-color': token('color.background.accent.yellow.subtle'),
			},
			'&.color-14': {
				'--telepointer-participant-text-color': token('color.text.accent.gray.bolder'),
				'--telepointer-participant-bg-color': token('color.background.accent.green.subtle'),
			},
			'&.color-15': {
				'--telepointer-participant-text-color': token('color.text.accent.gray.bolder'),
				'--telepointer-participant-bg-color': token('color.background.accent.teal.subtle'),
			},
			'&.color-16': {
				'--telepointer-participant-text-color': token('color.text.accent.gray.bolder'),
				'--telepointer-participant-bg-color': token('color.background.accent.purple.subtle'),
			},
			'&.color-17': {
				'--telepointer-participant-text-color': token('color.text.accent.gray.bolder'),
				'--telepointer-participant-bg-color': token('color.background.accent.magenta.subtle'),
			},
			// eslint-disable-next-line @atlaskit/ui-styling-standard/no-unsafe-selectors
			'html:not([data-color-mode=dark]) &': {
				'--telepointer-participant-background-first-stop': '-850000%',
				'--telepointer-participant-background-second-stop': '150000%',
			},
			// eslint-disable-next-line @atlaskit/ui-styling-standard/no-unsafe-selectors
			'html[data-color-mode=dark] &': {
				'--telepointer-participant-background-first-stop': '-800000%',
				'--telepointer-participant-background-second-stop': '200000%',
			},
			'&[class*="color-"]': {
				background:
					'linear-gradient(to bottom, var(--telepointer-participant-bg-color) var(--telepointer-participant-background-first-stop), transparent var(--telepointer-participant-background-second-stop))',
				'&::after': {
					backgroundColor: 'var(--telepointer-participant-bg-color)',
					color: 'var(--telepointer-participant-text-color)',
					borderColor: 'var(--telepointer-participant-bg-color)',
				},
			},
		},
	},
	telepointerStyle: {
		'.ProseMirror .telepointer': {
			'&.telepointer-selection-badge': {
				'.telepointer-initial, .telepointer-fullname': {
					position: 'absolute',
					display: 'block',
					userSelect: 'none',
					whiteSpace: 'pre',
					top: -14,
					left: 0,
					font: token('font.body.small'),
					paddingLeft: token('space.050'),
					paddingRight: token('space.050'),
					borderRadius: `0 ${token('radius.xsmall')} ${token('radius.xsmall')} 0`,
				},
				'.telepointer-initial': {
					opacity: 1,
					transitionProperty: 'opacity',
					transitionDuration: '0.15s',
					transitionTimingFunction: 'ease-out',
				},
				'.telepointer-fullname': {
					opacity: 0,
					transform: 'scaleX(0)',
					transformOrigin: 'top left',
					transitionProperty: 'transform, opacity',
					transitionDuration: '0.15s, 0.15s',
					transitionTimingFunction: 'ease-out, ease-out',
				},
			},
			'&.telepointer-pulse-animate': {
				'.telepointer-initial': {
					animationName: pulseOut,
					animationDuration: `2.5s`,
					animationTimingFunction: `ease-in-out`,
				},
				'.telepointer-fullname': {
					animationName: pulseIn,
					animationDuration: `2.5s`,
					animationTimingFunction: `ease-in-out`,
				},
			},
			'&.telepointer-pulse-during-tr': {
				'.telepointer-initial': {
					animationName: pulseOutDuringTr,
					animationDuration: `7500ms`,
					animationTimingFunction: `ease-in-out`,
				},
				'.telepointer-fullname': {
					animationName: pulseInDuringTr,
					animationDuration: `7500ms`,
					animationTimingFunction: `ease-in-out`,
				},
			},
			'&:hover': {
				'.telepointer-initial': {
					opacity: 0,
					transitionDelay: '150ms',
				},
				'.telepointer-fullname': {
					transform: 'scaleX(1)',
					opacity: 1,
					zIndex: 1,
				},
			},
		},
	},
	textColorStyles: {
		'.fabric-text-color-mark': {
			color: 'var(--custom-palette-color, inherit)',
		},

		'a .fabric-text-color-mark': {
			color: 'unset',
		},
	},
	textDangerStyles: {
		// Apply styles if isRootText && isOuterMostSelectedNode && .danger
		// eslint-disable-next-line @atlaskit/ui-styling-standard/no-unsafe-values
		['.ProseMirror :is(p, h1, h2, h3, h4, h5, h6):not(:is(ul, ol, div[data-node-type="actionList"]) :is(p, h1, h2, h3, h4, h5, h6)).ak-editor-selected-node:not(.ak-editor-selected-node *).danger']:
			{
				background: token('color.background.danger'),
				boxShadow: `0 -4px 0 ${token('color.background.danger')}, 0 4px 0 ${token(
					'color.background.danger',
				)}`,
			},
	},
	textHighlightPaddingStyles: {
		// eslint-disable-next-line @atlaskit/ui-styling-standard/no-unsafe-selectors
		'.fabric-background-color-mark:has(.background-color-padding-left)': {
			paddingLeft: token('space.025'),
			marginLeft: token('space.negative.025'),
		},
		// eslint-disable-next-line @atlaskit/ui-styling-standard/no-unsafe-selectors
		'.fabric-background-color-mark:has(.background-color-padding-right)': {
			paddingRight: token('space.025'),
			marginRight: token('space.negative.025'),
		},
	},
	textHighlightStyle: {
		'.text-highlight': {
			backgroundColor: token('color.background.accent.blue.subtlest'),
			borderBottom: `2px solid ${token('color.background.accent.blue.subtler')}`,
		},
	},
	textSelectedNodeStyles: {
		// Apply styles if isRootText && isOuterMostSelectedNode
		// eslint-disable-next-line @atlaskit/ui-styling-standard/no-unsafe-values
		['.ProseMirror :is(p, h1, h2, h3, h4, h5, h6):not(:is(ul, ol, div[data-node-type="actionList"]) :is(p, h1, h2, h3, h4, h5, h6)).ak-editor-selected-node:not(.ak-editor-selected-node *)']:
			{
				background: token('color.background.accent.blue.subtler'),
				WebkitUserSelect: 'text',
				boxShadow: `0 -4px 0 ${token('color.background.accent.blue.subtler')}, 0 4px 0 ${token(
					'color.background.accent.blue.subtler',
				)}`,

				'&::selection, *::selection': {
					backgroundColor: 'transparent',
				},

				'&::-moz-selection, *::-moz-selection': {
					backgroundColor: 'transparent',
				},
			},
	},
	unsupportedStyles: {
		'.unsupportedBlockView-content-wrap > div, .unsupportedInlineView-content-wrap > span:nth-of-type(2)':
			{
				cursor: 'pointer',
			},

		'.ak-editor-selected-node': {
			'&.unsupportedBlockView-content-wrap > div, &.unsupportedInlineView-content-wrap > span:nth-of-type(2)':
				{
					...backgroundSelectionStyles,
					...borderSelectionStyles,
					...hideNativeBrowserTextSelectionStyles,
				},
		},

		'.danger': {
			'.ak-editor-selected-node': {
				'&.unsupportedBlockView-content-wrap > div, &.unsupportedInlineView-content-wrap > span:nth-of-type(2)':
					{
						border: `1px solid ${token('color.border.danger')}`,
						backgroundColor: token('color.blanket.danger'),
					},
			},
		},
	},
	whitespaceStyles: {
		'.ProseMirror': {
			wordWrap: 'break-word',
			whiteSpace: 'pre-wrap',
		},
	},
});

const isFirefox: boolean =
	typeof navigator !== 'undefined' && navigator.userAgent.toLowerCase().indexOf('firefox') > -1;

export type EditorContentContainerProps = {
	appearance?: EditorAppearance;
	children?: React.ReactNode;
	className?: string;
	contentMode?: EditorContentMode;
	featureFlags?: FeatureFlags;
	isScrollable?: boolean;
	/**
	 * When true, nodes maintain their standard width without negative margins
	 * For when the drag handle is visible and the editor has limited space.
	 */
	useStandardNodeWidth?: boolean;
	viewMode?: 'view' | 'edit';
};

/**
 * EditorContentStyles is a wrapper component that applies styles to its children
 * based on the provided feature flags, view mode, and other props.
 * It uses Emotion for styling and supports scrollable content.
 *
 * This will be used in near future to replace the current editor content styles from index.tsx
 */
export const EditorContentContainerCompiled: React.ForwardRefExoticComponent<
	EditorContentContainerProps & React.RefAttributes<HTMLDivElement>
> = React.forwardRef<HTMLDivElement, EditorContentContainerProps>((props, ref) => {
	const {
		className,
		children,
		viewMode,
		isScrollable,
		appearance,
		contentMode,
		useStandardNodeWidth,
	} = props;
	const { colorMode } = useThemeObserver();

	const isFullPage =
		appearance === 'full-page' ||
		appearance === 'full-width' ||
		((expValEqualsNoExposure('editor_tinymce_full_width_mode', 'isEnabled', true) ||
			expValEqualsNoExposure('confluence_max_width_content_appearance', 'isEnabled', true)) &&
			appearance === 'max');
	const isComment = appearance === 'comment';
	const isChromeless = appearance === 'chromeless';

	const baseFontSize = getBaseFontSize(appearance, contentMode);
	const isDense = !!baseFontSize && baseFontSize !== akEditorFullPageDefaultFontSize;

	const tableOverflowShadow = overflowShadowForCompiled({
		leftCoverWidth: token('space.300'),
	});

	// Under the static-CSS experiment, --ak-editor-base-font-size is set earlier on the
	// root div in editor-internal.tsx and inherited via the CSS cascade — do not set it here.
	// For the legacy path, compute it from the Emotion theme as before.
	const style = {
		'--ak-editor--table-overflow-shadow': tableOverflowShadow,
		// eslint-disable-next-line @atlaskit/ui-styling-standard/no-imported-style-values
		...(!editorExperiment('platform_editor_preview_panel_responsiveness', true, {
			exposure: true,
		}) && {
			'--ak-editor--large-gutter-padding': `${akEditorGutterPaddingDynamic()}px`,
		}),
	};

	const browser = getBrowserInfo();

	return (
		<div
			// eslint-disable-next-line @atlaskit/ui-styling-standard/no-classname-prop -- Ignored via go/DSP-18766
			className={className}
			ref={ref}
			css={[
				editorContentStyles.baseStyles,
				editorContentStyles.maxModeReizeFixStyles,
				editorContentStyles.baseStylesMaxContainerWidthFixes,
				// eslint-disable-next-line @atlaskit/platform/no-preconditioning
				fg('platform_editor_controls_increase_full_page_gutter') &&
				editorExperiment('platform_editor_controls', 'variant1')
					? editorContentStyles.editorLargeGutterPuddingBaseStylesEditorControls
					: editorContentStyles.editorLargeGutterPuddingBaseStyles,
				editorExperiment('platform_editor_preview_panel_responsiveness', true, {
					exposure: true,
				}) && editorContentStyles.editorLargeGutterPuddingReducedBaseStyles,
				editorContentStyles.whitespaceStyles,
				editorContentStyles.indentationStyles,
				expValEquals('platform_editor_small_font_size', 'isEnabled', true) &&
					editorContentStyles.fontSizeStyles,
				editorContentStyles.shadowStyles,
				editorContentStyles.InlineNodeViewSharedStyles,
				editorContentStyles.hideSelectionStyles,
				editorContentStyles.hideCursorWhenHideSelectionStyles,
				editorContentStyles.selectedNodeStyles,
				editorContentStyles.cursorStyles,
				editorContentStyles.firstFloatingToolbarButtonStyles,
				editorContentStyles.placeholderTextStyles,
				editorContentStyles.placeholderStyles,
				editorExperiment('platform_editor_controls', 'variant1') &&
					editorContentStyles.placeholderOverflowStyles,
				editorExperiment('platform_editor_controls', 'variant1') &&
					fg('platform_editor_quick_insert_placeholder') &&
					editorContentStyles.placeholderWrapStyles,
				editorContentStyles.codeBlockStyles,
				contentMode === 'compact' &&
					(expValEquals('confluence_compact_text_format', 'isEnabled', true) ||
						// eslint-disable-next-line @atlaskit/platform/no-preconditioning
						(expValEquals('cc_editor_ai_content_mode', 'variant', 'test') &&
							fg('platform_editor_content_mode_button_mvp'))) &&
					editorContentStyles.codeBlockStylesWithEmUnits,
				!fg('platform_editor_typography_ugc') && editorContentStyles.editorUGCTokensDefault,
				fg('platform_editor_typography_ugc') && editorContentStyles.editorUGCTokensRefreshed,
				expValEquals('platform_editor_small_font_size', 'isEnabled', true) &&
					editorContentStyles.editorUGCSmallText,
				editorContentStyles.blocktypeStyles,
				editorExperiment('platform_editor_block_menu', true, { exposure: true }) &&
					editorContentStyles.blockquoteSelectedNodeStyles,
				editorExperiment('platform_editor_block_menu', true, { exposure: true }) &&
					editorContentStyles.listSelectedNodeStyles,
				editorExperiment('platform_editor_block_menu', true, { exposure: true }) &&
					editorContentStyles.textSelectedNodeStyles,
				fg('platform_editor_typography_ugc')
					? editorContentStyles.blocktypeStyles_fg_platform_editor_typography_ugc
					: editorContentStyles.blocktypeStyles_without_fg_platform_editor_typography_ugc,
				fg('platform_editor_nested_dnd_styles_changes') &&
					editorContentStyles.blocktypeStyles_fg_platform_editor_nested_dnd_styles_changes,
				editorContentStyles.codeMarkStyles,
				expValEquals('platform_editor_a11y_scrollable_region', 'isEnabled', true) &&
					editorContentStyles.codeMarkStylesA11yFix,
				editorContentStyles.textColorStyles,
				editorContentStyles.backgroundColorStyles,
				editorContentStyles.textHighlightPaddingStyles,
				editorContentStyles.listsStyles,
				expValEqualsNoExposure('platform_editor_flexible_list_schema', 'isEnabled', true) &&
					editorContentStyles.listItemHiddenMarkerStyles,
				editorContentStyles.diffListStyles,
				// Condense vertical spacing between list items when content mode dense is active
				contentMode === 'compact' &&
					(expValEquals('confluence_compact_text_format', 'isEnabled', true) ||
						// eslint-disable-next-line @atlaskit/platform/no-preconditioning
						(expValEquals('cc_editor_ai_content_mode', 'variant', 'test') &&
							fg('platform_editor_content_mode_button_mvp'))) &&
					isDense &&
					editorContentStyles.listsDenseStyles,
				isFullPage && editorContentStyles.listsStylesMarginLayoutShiftFix,
				editorContentStyles.ruleStyles,
				editorContentStyles.smartCardDiffStyles,
				expValEquals('platform_editor_enghealth_a11y_jan_fixes', 'isEnabled', true)
					? editorContentStyles.showDiffDeletedNodeStylesNew
					: editorContentStyles.showDiffDeletedNodeStyles,
				editorContentStyles.mediaStyles,
				contentMode === 'compact' &&
					(expValEquals('confluence_compact_text_format', 'isEnabled', true) ||
						// eslint-disable-next-line @atlaskit/platform/no-preconditioning
						(expValEquals('cc_editor_ai_content_mode', 'variant', 'test') &&
							fg('platform_editor_content_mode_button_mvp'))) &&
					editorContentStyles.mediaCaptionStyles,
				// merge firstWrappedMediaStyles with mediaStyles when clean up platform_editor_fix_media_in_renderer
				fg('platform_editor_fix_media_in_renderer') && editorContentStyles.firstWrappedMediaStyles,
				editorContentStyles.telepointerStyle,
				/* This needs to be after telepointer styles as some overlapping rules have equal specificity, and so the order is significant */
				editorContentStyles.telepointerColorAndCommonStyle,
				editorContentStyles.gapCursorStyles,
				editorExperiment('platform_synced_block', true) &&
					editorContentStyles.gapCursorStylesVisibilityFix,
				editorContentStyles.panelStyles,
				editorContentStyles.nestedPanelBorderStylesMixin,
				fg('platform_editor_nested_dnd_styles_changes') &&
					editorContentStyles.panelStylesMixin_fg_platform_editor_nested_dnd_styles_changes,
				editorContentStyles.panelStylesMixin,
				editorContentStyles.mentionsStyles,
				editorContentStyles.tasksAndDecisionsStyles,
				// condense vertical spacing between tasks/decisions items when content mode dense is active
				contentMode === 'compact' &&
					(expValEquals('confluence_compact_text_format', 'isEnabled', true) ||
						// eslint-disable-next-line @atlaskit/platform/no-preconditioning
						(expValEquals('cc_editor_ai_content_mode', 'variant', 'test') &&
							fg('platform_editor_content_mode_button_mvp'))) &&
					isDense &&
					editorContentStyles.tasksAndDecisionsDenseStyles,
				editorContentStyles.gridStyles,
				editorContentStyles.blockMarksStyles,
				editorContentStyles.dateStyles,
				editorContentStyles.extensionStyles,
				((contentMode === 'compact' &&
					expValEquals('confluence_compact_text_format', 'isEnabled', true)) ||
					(expValEquals('cc_editor_ai_content_mode', 'variant', 'test') &&
						fg('platform_editor_content_mode_button_mvp'))) &&
					editorContentStyles.extensionStylesDense,
				contentMode === 'compact' &&
					expValEquals('cc_editor_ai_content_mode', 'variant', 'test') &&
					!expValEquals('confluence_compact_text_format', 'isEnabled', true) &&
					!fg('platform_editor_content_mode_button_mvp') &&
					editorContentStyles.extensionStylesLegacyDense,
				expValEquals('platform_editor_bodiedextension_layoutshift_fix', 'isEnabled', true) &&
					editorContentStyles.bodiedExtensionLayoutShiftFix,
				editorContentStyles.extensionDiffStyles,
				editorContentStyles.expandStylesBase,
				// Apply expand delta styles conditionally based on useStandardNodeWidth (negative margins or not)
				!useStandardNodeWidth && editorContentStyles.expandStyles,
				contentMode === 'compact' &&
					(expValEquals('confluence_compact_text_format', 'isEnabled', true) ||
						// eslint-disable-next-line @atlaskit/platform/no-preconditioning
						(expValEquals('cc_editor_ai_content_mode', 'variant', 'test') &&
							fg('platform_editor_content_mode_button_mvp'))) &&
					isDense &&
					editorContentStyles.expandDenseStyles,
				fg('platform_editor_nested_dnd_styles_changes')
					? editorContentStyles.expandStylesMixin_fg_platform_editor_nested_dnd_styles_changes
					: editorContentStyles.expandStylesMixin_without_fg_platform_editor_nested_dnd_styles_changes,
				editorContentStyles.expandStylesMixin_fg_platform_visual_refresh_icons,
				isChromeless &&
					expValEquals('platform_editor_chromeless_expand_fix', 'isEnabled', true) &&
					editorContentStyles.expandStylesMixin_experiment_platform_editor_chromeless_expand_fix,
				expValEquals('platform_editor_find_and_replace_improvements', 'isEnabled', true)
					? editorContentStyles.findReplaceStylesNewWithA11Y
					: editorContentStyles.findReplaceStyles,
				expValEquals('platform_editor_find_and_replace_improvements', 'isEnabled', true) &&
					editorContentStyles.findReplaceStylesNewWithCodeblockColorContrastFix,
				!expValEquals('platform_editor_find_and_replace_improvements', 'isEnabled', true) &&
					editorContentStyles.findReplaceStylesWithCodeblockColorContrastFix,
				editorExperiment('platform_synced_block', true) &&
					editorContentStyles.findReplaceStylesWithRefSyncBlock,
				editorContentStyles.textHighlightStyle,
				editorContentStyles.decisionStyles,
				expValEqualsNoExposure('platform_editor_blocktaskitem_node_tenantid', 'isEnabled', true)
					? editorContentStyles.taskItemStylesWithBlockTaskItem
					: editorContentStyles.taskItemStyles,
				editorContentStyles.taskItemCheckboxStyles,
				editorContentStyles.decisionIconWithVisualRefresh,
				editorContentStyles.statusStyles,
				fg('platform-dst-lozenge-tag-badge-visual-uplifts')
					? editorContentStyles.statusStylesTeam26
					: fg('platform-component-visual-refresh')
						? expValEqualsNoExposure(
								'platform_editor_find_and_replace_improvements',
								'isEnabled',
								true,
							)
							? editorContentStyles.statusStylesMixin_fg_platform_component_visual_refresh_with_search_match
							: editorContentStyles.statusStylesMixin_fg_platform_component_visual_refresh
						: expValEqualsNoExposure(
									'platform_editor_find_and_replace_improvements',
									'isEnabled',
									true,
							  )
							? editorContentStyles.statusStylesMixin_without_fg_platform_component_visual_refresh_with_search_match
							: editorContentStyles.statusStylesMixin_without_fg_platform_component_visual_refresh,
				colorMode === 'dark' &&
					fg('platform-dst-lozenge-tag-badge-visual-uplifts') &&
					editorContentStyles.statusStylesTeam26DarkMode,
				editorContentStyles.annotationStyles,
				expValEqualsNoExposure('platform_editor_find_and_replace_improvements', 'isEnabled', true)
					? editorExperiment('platform_editor_block_menu', true)
						? editorContentStyles.smartCardStylesWithSearchMatchAndBlockMenuDangerStyles
						: editorContentStyles.smartCardStylesWithSearchMatch
					: editorContentStyles.smartCardStyles,
				editorExperiment('platform_editor_preview_panel_responsiveness', true) &&
					editorContentStyles.smartCardStylesWithSearchMatchAndPreviewPanelResponsiveness,
				(expValEqualsNoExposure('platform_editor_controls', 'cohort', 'variant1') ||
					editorExperiment('platform_editor_preview_panel_linking_exp', true)) &&
					editorContentStyles.editorControlsSmartCardStyles,
				editorContentStyles.embedCardStyles,
				editorContentStyles.unsupportedStyles,
				editorContentStyles.resizerStyles,
				expValEqualsNoExposure('cc-maui-experiment', 'isEnabled', true) &&
					expValEquals('databases-native-embeds-v2', 'isEnabled', true) &&
					editorContentStyles.resizerBottomHandleStyles,
				editorContentStyles.layoutBaseStyles,
				expValEquals('platform_editor_table_excerpts_fix', 'isEnabled', true) &&
					editorContentStyles.layoutBaseStylesWithTableExcerptsFix,
				// merge alignMultipleWrappedImageInLayoutStyles with layoutBaseStyles when clean up platform_editor_fix_media_in_renderer
				fg('platform_editor_fix_media_in_renderer') &&
					editorContentStyles.alignMultipleWrappedImageInLayoutStyles,
				editorExperiment('platform_synced_block', true) && editorContentStyles.syncBlockStylesBase,
				editorExperiment('platform_synced_block', true) &&
					// Apply sync block delta styles conditionally based on useStandardNodeWidth (negative margins or not)
					!useStandardNodeWidth &&
					editorContentStyles.syncBlockStyles,
				editorExperiment('platform_synced_block', true) &&
					editorContentStyles.syncBlockOverflowStyles,
				editorExperiment('platform_synced_block', true) &&
					editorContentStyles.syncBlockFirstNodeStyles,
				editorExperiment('platform_synced_block', true) &&
					fg('platform_synced_block_patch_14') &&
					editorContentStyles.syncBlockTextSelectionStyles,
				editorExperiment('advanced_layouts', true) && editorContentStyles.layoutBaseStylesAdvanced,
				editorExperiment('advanced_layouts', true)
					? editorContentStyles.layoutSectionStylesAdvanced
					: editorContentStyles.layoutSectionStylesNotAdvanced,
				editorExperiment('advanced_layouts', true) &&
					editorExperiment('platform_editor_layout_column_resize_handle', true) &&
					editorContentStyles.layoutColumnDividerStyles,
				editorExperiment('advanced_layouts', true) &&
					editorExperiment('platform_editor_layout_column_resize_handle', true) &&
					fg('platform_editor_nested_dnd_styles_changes') &&
					editorContentStyles.layoutColumnDividerStylesNestedDnD,
				editorExperiment('advanced_layouts', true)
					? editorContentStyles.layoutColumnStylesAdvanced
					: editorContentStyles.layoutColumnStylesNotAdvanced,
				editorExperiment('advanced_layouts', true) &&
					editorExperiment('platform_editor_layout_column_resize_handle', true) &&
					editorContentStyles.layoutColumnResizeStyles,
				editorExperiment('advanced_layouts', true)
					? editorContentStyles.layoutSelectedStylesAdvanced
					: editorContentStyles.layoutSelectedStylesNotAdvanced,
				editorExperiment('platform_synced_block', true) &&
					editorContentStyles.layoutSelectedStylesAdvancedFix,
				editorExperiment('advanced_layouts', true) &&
					editorContentStyles.layoutColumnResponsiveStyles,
				editorExperiment('advanced_layouts', true) &&
					editorContentStyles.layoutResponsiveBaseStyles,
				editorExperiment('platform_synced_block', true) &&
					fg('platform_editor_nested_dnd_styles_changes') &&
					editorContentStyles.layoutBaseStylesFixesUnderNestedDnDFGExcludingBodiedSync,
				!editorExperiment('platform_synced_block', true) &&
					fg('platform_editor_nested_dnd_styles_changes') &&
					editorContentStyles.layoutBaseStylesFixesUnderNestedDnDFG,
				fg('platform_editor_nested_dnd_styles_changes')
					? editorContentStyles.layoutColumnMartinTopFixesNew
					: editorContentStyles.layoutColumnMartinTopFixesOld,
				editorContentStyles.smartLinksInLivePagesStyles,
				editorContentStyles.linkingVisualRefreshV1Styles,
				editorContentStyles.dateVanillaStyles,
				fg('platform_editor_typography_ugc')
					? contentMode === 'compact' &&
						(expValEquals('confluence_compact_text_format', 'isEnabled', true) ||
							// eslint-disable-next-line @atlaskit/platform/no-preconditioning
							(expValEquals('cc_editor_ai_content_mode', 'variant', 'test') &&
								fg('platform_editor_content_mode_button_mvp')))
						? editorContentStyles.paragraphStylesWithScaledMargin
						: editorContentStyles.paragraphStylesUGCRefreshed
					: contentMode === 'compact' &&
						  (expValEquals('confluence_compact_text_format', 'isEnabled', true) ||
								// eslint-disable-next-line @atlaskit/platform/no-preconditioning
								(expValEquals('cc_editor_ai_content_mode', 'variant', 'test') &&
									fg('platform_editor_content_mode_button_mvp')))
						? editorContentStyles.paragraphStylesOldWithScaledMargin
						: editorContentStyles.paragraphStylesOld,
				editorContentStyles.linkStyles,
				browser.safari && editorContentStyles.listsStylesSafariFix,
				editorExperiment('platform_synced_block', true) &&
					editorContentStyles.pragmaticResizerStylesSyncedBlock,
				expValEqualsNoExposure('platform_editor_breakout_resizing', 'isEnabled', true) &&
					editorContentStyles.pragmaticResizerStyles,
				expValEqualsNoExposure('platform_editor_breakout_resizing', 'isEnabled', true) &&
					editorExperiment('platform_synced_block', true) &&
					editorContentStyles.pragmaticResizerStylesCodeBlockSyncedBlockPatch,
				expValEqualsNoExposure('platform_editor_breakout_resizing', 'isEnabled', true) &&
					!editorExperiment('platform_synced_block', true) &&
					editorContentStyles.pragmaticResizerStylesCodeBlockLegacy,
				editorExperiment('advanced_layouts', true) &&
					expValEqualsNoExposure('platform_editor_breakout_resizing', 'isEnabled', true) &&
					editorContentStyles.pragmaticStylesLayoutFirstNodeResizeHandleFix,
				expValEqualsNoExposure('platform_editor_breakout_resizing', 'isEnabled', true) &&
					editorContentStyles.pragmaticResizerStylesForTooltip,
				editorExperiment('platform_editor_preview_panel_responsiveness', true) &&
					(editorExperiment('advanced_layouts', true) ||
						expValEqualsNoExposure('platform_editor_breakout_resizing', 'isEnabled', true)) &&
					editorContentStyles.pragmaticResizerStylesWithReducedEditorGutter,
				editorContentStyles.aiPanelBaseStyles,
				isFirefox && editorContentStyles.aiPanelBaseFirefoxStyles,
				colorMode === 'dark' && editorContentStyles.aiPanelDarkStyles,
				colorMode === 'dark' && isFirefox && editorContentStyles.aiPanelDarkFirefoxStyles,
				viewMode === 'view' && editorContentStyles.layoutStylesForView,
				viewMode === 'view' &&
					editorExperiment('advanced_layouts', true) &&
					editorContentStyles.layoutSelectedStylesForViewAdvanced,
				viewMode === 'view' &&
					editorExperiment('advanced_layouts', false) &&
					editorContentStyles.layoutSelectedStylesForViewNotAdvanced,
				viewMode === 'view' &&
					editorExperiment('advanced_layouts', true) &&
					editorContentStyles.layoutResponsiveStylesForView,
				isComment && editorContentStyles.commentEditorStyles,
				isComment && editorContentStyles.tableCommentEditorStyles,
				isFullPage && editorContentStyles.fullPageEditorStyles,
				isFullPage && editorContentStyles.scrollbarStyles,
				fg('platform_editor_nested_dnd_styles_changes')
					? editorContentStyles.firstCodeBlockWithNoMargin
					: editorContentStyles.firstCodeBlockWithNoMarginOld,
				editorContentStyles.firstBlockNodeStyles,
				editorContentStyles.mentionNodeStyles,
				expValEqualsNoExposure('platform_editor_find_and_replace_improvements', 'isEnabled', true)
					? editorContentStyles.mentionsSelectionStylesWithSearchMatch
					: editorContentStyles.mentionsSelectionStyles,
				expValEquals('platform_editor_lovability_emoji_scaling', 'isEnabled', true)
					? editorContentStyles.scaledEmojiStyles
					: editorContentStyles.emojiStyles,
				contentMode === 'compact' &&
					isDense &&
					(expValEquals('confluence_compact_text_format', 'isEnabled', true) ||
						(expValEquals('cc_editor_ai_content_mode', 'variant', 'test') &&
							fg('platform_editor_content_mode_button_mvp'))) &&
					expValEquals('platform_editor_lovability_emoji_scaling', 'isEnabled', true) &&
					editorContentStyles.scaledEmojiDenseStyles,
				contentMode === 'compact' &&
					isDense &&
					(expValEquals('confluence_compact_text_format', 'isEnabled', true) ||
						(expValEquals('cc_editor_ai_content_mode', 'variant', 'test') &&
							fg('platform_editor_content_mode_button_mvp'))) &&
					!expValEquals('platform_editor_lovability_emoji_scaling', 'isEnabled', true) &&
					editorContentStyles.emojiDenseStyles,
				editorContentStyles.panelViewStyles,
				editorContentStyles.mediaGroupStyles,
				editorContentStyles.mediaAlignmentStyles,
				expValEquals('platform_editor_small_font_size', 'isEnabled', true)
					? editorContentStyles.tableLayoutFixesWithFontSize
					: editorContentStyles.tableLayoutFixes,
				editorContentStyles.tableContainerStyles,
				editorContentStyles.tableSharedStyle,
				/* https://stackoverflow.com/questions/7517127/borders-not-shown-in-firefox-with-border-collapse-on-table-position-relative-o */
				(browser.gecko || browser.ie || (browser.mac && browser.chrome)) &&
					editorContentStyles.tableSharedStyleBackgroundClipFix,
				expValEquals('platform_editor_table_q4_loveability', 'isEnabled', true)
					? editorContentStyles.tableSharedStyle_with_platform_editor_table_q4_loveability
					: editorContentStyles.tableSharedStyle_without_platform_editor_table_q4_loveability,
				expValEquals('platform_editor_table_menu_updates', 'isEnabled', true) &&
					editorContentStyles.tableSharedStyle_with_platform_editor_table_menu_updates,
				fg('platform_editor_bordered_panel_nested_in_table') &&
					editorContentStyles.tableSharedStyle_with_platform_editor_bordered_panel_nested_in_table,
				editorContentStyles.tableEmptyRowStyles,
				expValEquals('platform_editor_table_fit_to_content_auto_convert', 'isEnabled', true) &&
					editorContentStyles.tableContentModeStyles,
				editorContentStyles.hyperLinkFloatingToolbarStyles,
				editorContentStyles.selectionToolbarAnimationStyles,
				editorExperiment('platform_editor_block_menu', true) && [
					editorContentStyles.blockquoteDangerStyles,
					editorContentStyles.textDangerStyles,
					editorContentStyles.listDangerStyles,
					editorContentStyles.dangerDateStyles,
					editorContentStyles.emojiDangerStyles,
					editorContentStyles.mentionDangerStyles,
					editorContentStyles.decisionDangerStyles,
					editorContentStyles.statusDangerStyles,
					editorContentStyles.dangerRuleStyles,
					editorContentStyles.mediaDangerStyles,
					editorContentStyles.nestedPanelDangerStyles,
				],
			]}
			data-editor-scroll-container={isScrollable ? 'true' : undefined}
			data-testid="editor-content-container"
			// eslint-disable-next-line @atlaskit/ui-styling-standard/enforce-style-prop
			style={style as React.CSSProperties}
			tabIndex={isScrollable ? 0 : undefined}
			role={isScrollable ? 'region' : undefined}
		>
			{/* eslint-disable-next-line @atlaskit/ui-styling-standard/no-global-styles -- Required for custom styles for table */}
			<style>{tableCellBackgroundStyleOverrideForCompiled}</style>
			{children}
		</div>
	);
});
