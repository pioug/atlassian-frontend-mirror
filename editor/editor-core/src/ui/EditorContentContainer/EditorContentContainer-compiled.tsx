// TODO: EDITOR-6833 - Expected across this entire file, future violations are expected. Will try to remove them later after fully migration
/* eslint-disable @atlaskit/ui-styling-standard/no-nested-selectors, @atlaskit/ui-styling-standard/no-unsafe-selectors, @atlaskit/platform/expand-border-shorthand, @atlaskit/platform/expand-background-shorthand */
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
import { AnnotationSharedClassNames, richMediaClassName } from '@atlaskit/editor-common/styles';
import type {
	EditorAppearance,
	EditorContentMode,
	FeatureFlags,
} from '@atlaskit/editor-common/types';
import { akEditorGutterPaddingDynamic, editorFontSize } from '@atlaskit/editor-shared-styles';
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

const blockNodesVerticalMargin = '0.75rem';
const scaledBlockNodesVerticalMargin = '0.75em';

const editorAreaNonSmallDeviceContainerQuery = `@container editor-area (width >= ${akEditorBreakpointForSmallDevice})`;
const editorAreaNarrowPageContainerQuery = `@container editor-area (max-width: ${akEditorFullPageNarrowBreakout}px)`;

const placeholderFadeInKeyframes = keyframes({
	from: {
		opacity: 0,
	},
	to: {
		opacity: 1,
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

/**
 * editorContentStyles is WIP to migrate styles from EditorContentContainer/styles
 *
 * The value {} is placeholder, fill in styles when migrating each style file
 * Add/Delete/Re-order keys are discouraged during incremental migration due to potential merge conflicts.
 */
const editorContentStyles = cssMap({
	aiPanelBaseFirefoxStyles: {},
	aiPanelBaseStyles: {},
	aiPanelDarkFirefoxStyles: {},
	aiPanelDarkStyles: {},
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
	backgroundColorStyles: {},
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
	blockMarksStyles: {},
	blockquoteDangerStyles: {},
	blockquoteSelectedNodeStyles: {},
	blocktypeStyles: {},
	blocktypeStyles_fg_platform_editor_nested_dnd_styles_changes: {},
	blocktypeStyles_fg_platform_editor_typography_ugc: {},
	blocktypeStyles_without_fg_platform_editor_typography_ugc: {},
	codeBlockStyles: {},
	codeBlockStylesWithEmUnits: {},
	codeMarkStyles: {},
	codeMarkStylesA11yFix: {},
	commentEditorStyles: {},
	cursorStyles: {},
	dangerDateStyles: {
		// eslint-disable-next-line @atlaskit/ui-styling-standard/no-unsafe-values
		'.dateView-content-wrap.ak-editor-selected-node.danger .date-lozenger-container > span': {
			// eslint-disable-next-line @atlaskit/ui-styling-standard/no-unsafe-values, @atlaskit/design-system/no-invalid-css-map
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
					// eslint-disable-next-line @atlaskit/ui-styling-standard/no-unsafe-values, @atlaskit/design-system/no-invalid-css-map
					...boxShadowSelectionStyles,
					// eslint-disable-next-line @atlaskit/ui-styling-standard/no-unsafe-values, @atlaskit/design-system/no-invalid-css-map
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
			transition: 'background 0.3s',
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
	decisionDangerStyles: {},
	decisionIconWithVisualRefresh: {},
	decisionStyles: {},
	diffListStyles: {},
	editorControlsSmartCardStyles: {},
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
	editorUGCSmallText: {},
	editorUGCTokensDefault: {},
	editorUGCTokensRefreshed: {},
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
	emojiDangerStyles: {},
	emojiStyles: {},
	expandStyles: {},
	expandStylesBase: {},
	expandStylesMixin_experiment_platform_editor_chromeless_expand_fix: {},
	expandStylesMixin_fg_platform_editor_nested_dnd_styles_changes: {},
	expandStylesMixin_fg_platform_visual_refresh_icons: {},
	expandStylesMixin_without_fg_platform_editor_nested_dnd_styles_changes: {},
	extensionDiffStyles: {},
	findReplaceStyles: {},
	findReplaceStylesNewWithA11Y: {},
	findReplaceStylesNewWithCodeblockColorContrastFix: {},
	findReplaceStylesWithCodeblockColorContrastFix: {},
	firstBlockNodeStyles: {},
	firstCodeBlockWithNoMargin: {},
	firstCodeBlockWithNoMarginOld: {},
	firstFloatingToolbarButtonStyles: {},
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
	fontSizeStyles: {},
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
	gridStyles: {},
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
	hyperLinkFloatingToolbarStyles: {},
	indentationStyles: {},
	InlineNodeViewSharedStyles: {},
	layoutBaseStyles: {},
	layoutBaseStylesAdvanced: {},
	layoutBaseStylesFixesUnderNestedDnDFG: {},
	layoutBaseStylesFixesUnderNestedDnDFGExcludingBodiedSync: {},
	layoutBaseStylesWithTableExcerptsFix: {},
	layoutColumnDividerStyles: {},
	layoutColumnDividerStylesNestedDnD: {},
	layoutColumnMartinTopFixesNew: {},
	layoutColumnMartinTopFixesOld: {},
	layoutColumnResizeStyles: {},
	layoutColumnResponsiveStyles: {},
	layoutColumnStylesAdvanced: {},
	layoutColumnStylesNotAdvanced: {},
	layoutResponsiveBaseStyles: {},
	layoutResponsiveStylesForView: {},
	layoutSectionStylesAdvanced: {},
	layoutSectionStylesNotAdvanced: {},
	layoutSelectedStylesAdvanced: {},
	layoutSelectedStylesAdvancedFix: {},
	layoutSelectedStylesForViewAdvanced: {},
	layoutSelectedStylesForViewNotAdvanced: {},
	layoutSelectedStylesNotAdvanced: {},
	layoutStylesForView: {},
	linkingVisualRefreshV1Styles: {},
	linkStyles: {},
	listDangerStyles: {},
	listItemHiddenMarkerStyles: {},
	listSelectedNodeStyles: {},
	listsStyles: {},
	listsStylesMarginLayoutShiftFix: {},
	listsStylesSafariFix: {},
	maxModeReizeFixStyles: {
		'.fabric-editor--max-width-mode': {
			'--ak-editor--line-length':
				'min(calc(100cqw - var(--ak-editor--large-gutter-padding) * 2), var(--ak-editor--max-width-layout-width))',
			/* in max width appearances it's not possible to rely on cqw because it doesn't account for the page scrollbar, which depends on users system settings */
			'--ak-editor--breakout-fallback-width': '100%',
			'--ak-editor--breakout-min-width': '0px',
		},
	},
	mediaAlignmentStyles: {},
	mediaCaptionStyles: {},
	mediaDangerStyles: {},
	mediaGroupStyles: {},
	mediaStyles: {},
	mentionDangerStyles: {
		// eslint-disable-next-line @atlaskit/ui-styling-standard/no-unsafe-values
		'.ak-editor-selected-node:not(.search-match-block).danger': {
			'> .editor-mention-primitive, > .editor-mention-primitive.mention-self, > .editor-mention-primitive.mention-restricted':
				{
					// eslint-disable-next-line @atlaskit/ui-styling-standard/no-unsafe-values, @atlaskit/design-system/no-invalid-css-map
					...dangerBorderStyles,
					// eslint-disable-next-line @atlaskit/ui-styling-standard/no-unsafe-values, @atlaskit/design-system/no-invalid-css-map
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
					// eslint-disable-next-line @atlaskit/ui-styling-standard/no-unsafe-values, @atlaskit/design-system/no-invalid-css-map
					...boxShadowSelectionStyles,
					// eslint-disable-next-line @atlaskit/ui-styling-standard/no-unsafe-values, @atlaskit/design-system/no-invalid-css-map
					...backgroundSelectionStyles,
					// eslint-disable-next-line @atlaskit/ui-styling-standard/no-unsafe-values, @atlaskit/design-system/no-invalid-css-map
					...hideNativeBrowserTextSelectionStyles,
					// eslint-disable-next-line @atlaskit/ui-styling-standard/no-unsafe-values, @atlaskit/design-system/no-invalid-css-map
					...mentionsSelectedColor,
					// Explicitly override hover/active states to prevent mentionNodeStyles hover
					// from winning over the selection background in Compiled's atomic CSS (source order issue)
					'&:hover, &:active': {
						// eslint-disable-next-line @atlaskit/ui-styling-standard/no-unsafe-values, @atlaskit/design-system/no-invalid-css-map
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
					// eslint-disable-next-line @atlaskit/ui-styling-standard/no-unsafe-values, @atlaskit/design-system/no-invalid-css-map
					...backgroundSelectionStyles,
					// eslint-disable-next-line @atlaskit/ui-styling-standard/no-unsafe-values, @atlaskit/design-system/no-invalid-css-map
					...hideNativeBrowserTextSelectionStyles,
					// eslint-disable-next-line @atlaskit/ui-styling-standard/no-unsafe-values, @atlaskit/design-system/no-invalid-css-map
					...mentionsSelectedColor,
					// Explicitly override hover/active states to prevent mentionNodeStyles hover
					// from winning over the selection background in Compiled's atomic CSS (source order issue)
					'&:hover, &:active': {
						// eslint-disable-next-line @atlaskit/ui-styling-standard/no-unsafe-values, @atlaskit/design-system/no-invalid-css-map
						...backgroundSelectionStyles,
					},
				},
		},
		// eslint-disable-next-line @atlaskit/ui-styling-standard/no-unsafe-values
		'.ak-editor-selected-node:not(.search-match-block)': {
			'> .editor-mention-primitive, > .editor-mention-primitive.mention-self, > .editor-mention-primitive.mention-restricted':
				{
					// eslint-disable-next-line @atlaskit/ui-styling-standard/no-unsafe-values, @atlaskit/design-system/no-invalid-css-map
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
				// eslint-disable-next-line @atlaskit/ui-styling-standard/no-unsafe-values, @atlaskit/design-system/no-invalid-css-map
				...boxShadowSelectionStyles,
				// eslint-disable-next-line @atlaskit/ui-styling-standard/no-unsafe-values, @atlaskit/design-system/no-invalid-css-map
				...backgroundSelectionStyles,
				// eslint-disable-next-line @atlaskit/ui-styling-standard/no-unsafe-values, @atlaskit/design-system/no-invalid-css-map
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
	nestedPanelBorderStylesMixin: {},
	nestedPanelDangerStyles: {},
	panelStyles: {},
	panelStylesMixin: {},
	panelStylesMixin_fg_platform_editor_nested_dnd_styles_changes: {},
	panelViewStyles: {},
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
			// eslint-disable-next-line @atlaskit/ui-styling-standard/no-unsafe-values, @atlaskit/design-system/no-invalid-css-map
			...backgroundSelectionStyles,
			// eslint-disable-next-line @atlaskit/ui-styling-standard/no-unsafe-values, @atlaskit/design-system/no-invalid-css-map
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
	pragmaticResizerStyles: {},
	pragmaticResizerStylesCodeBlockLegacy: {},
	pragmaticResizerStylesCodeBlockSyncedBlockPatch: {},
	pragmaticResizerStylesForTooltip: {},
	pragmaticResizerStylesSyncedBlock: {},
	pragmaticResizerStylesWithReducedEditorGutter: {},
	pragmaticStylesLayoutFirstNodeResizeHandleFix: {},
	resizerStyles: {},
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
	scaledEmojiStyles: {},
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
	selectionToolbarAnimationStyles: {},
	shadowStyles: {},
	showDiffDeletedNodeStyles: {},
	showDiffDeletedNodeStylesNew: {},
	smartCardDiffStyles: {},
	smartCardStyles: {},
	smartCardStylesWithSearchMatch: {},
	smartCardStylesWithSearchMatchAndBlockMenuDangerStyles: {},
	smartCardStylesWithSearchMatchAndPreviewPanelResponsiveness: {},
	smartLinksInLivePagesStyles: {},
	statusDangerStyles: {},
	statusStyles: {},
	statusStylesMixin_fg_platform_component_visual_refresh: {},
	statusStylesMixin_fg_platform_component_visual_refresh_with_search_match: {},
	statusStylesMixin_without_fg_platform_component_visual_refresh: {},
	statusStylesMixin_without_fg_platform_component_visual_refresh_with_search_match: {},
	statusStylesTeam26: {},
	syncBlockFirstNodeStyles: {},
	syncBlockOverflowStyles: {},
	syncBlockStyles: {},
	syncBlockStylesBase: {},
	tableCommentEditorStyles: {},
	tableContainerStyles: {},
	tableContentModeStyles: {},
	tableEmptyRowStyles: {},
	tableLayoutFixes: {},
	tableLayoutFixesWithFontSize: {},
	taskItemCheckboxStyles: {},
	taskItemStyles: {},
	taskItemStylesWithBlockTaskItem: {},
	tasksAndDecisionsStyles: {},
	telepointerColorAndCommonStyle: {
		'.ProseMirror .telepointer': {
			position: 'relative',
			transition: 'opacity 200ms',
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
					transition: 'opacity 0.15s ease-out',
				},
				'.telepointer-fullname': {
					opacity: 0,
					transform: 'scaleX(0)',
					transformOrigin: 'top left',
					transition: 'transform 0.15s ease-out, opacity 0.15s ease-out',
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
	textColorStyles: {},
	textDangerStyles: {},
	textHighlightPaddingStyles: {},
	textHighlightStyle: {},
	textSelectedNodeStyles: {},
	unsupportedStyles: {},
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

	const style = editorExperiment('platform_editor_preview_panel_responsiveness', true, {
		exposure: true,
	})
		? {
				'--ak-editor-base-font-size': `${editorFontSize({ theme: { baseFontSize } })}px`,
			}
		: {
				'--ak-editor-base-font-size': `${editorFontSize({ theme: { baseFontSize } })}px`,

				'--ak-editor--large-gutter-padding': `${akEditorGutterPaddingDynamic()}px`,
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
				// eslint-disable-next-line @atlaskit/editor/enforce-todo-comment-format
				// TODO: uncomment and remove dynamic styles from getDenseListStyles
				// migrate this when migrate packages/editor/editor-core/src/ui/EditorContentContainer/styles/list.ts
				// Condense vertical spacing between list items when content mode dense is active
				// contentMode === 'compact' &&
				// 	(expValEquals('confluence_compact_text_format', 'isEnabled', true) ||
				// 		// eslint-disable-next-line @atlaskit/platform/no-preconditioning
				// 		(expValEquals('cc_editor_ai_content_mode', 'variant', 'test') &&
				// 			fg('platform_editor_content_mode_button_mvp'))) &&
				// 	getDenseListStyles(baseFontSize),
				expValEquals('cc_editor_ttvc_release_bundle_one', 'listLayoutShiftFix', true) &&
					isFullPage &&
					editorContentStyles.listsStylesMarginLayoutShiftFix,
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
				// eslint-disable-next-line @atlaskit/editor/enforce-todo-comment-format
				// TODO: uncomment and remove dynamic styles from getDenseTasksAndDecisionsStyles
				// migrate this with packages/editor/editor-core/src/ui/EditorContentContainer/styles/tasksAndDecisionsStyles.ts
				// reference: https://atlassian.design/components/eslint-plugin-ui-styling-standard/no-dynamic-styles/usage
				// contentMode === 'compact' &&
				// 	(expValEquals('confluence_compact_text_format', 'isEnabled', true) ||
				// 		// eslint-disable-next-line @atlaskit/platform/no-preconditioning
				// 		(expValEquals('cc_editor_ai_content_mode', 'variant', 'test') &&
				// 			fg('platform_editor_content_mode_button_mvp'))) &&
				// 	getDenseTasksAndDecisionsStyles(baseFontSize),
				editorContentStyles.gridStyles,
				editorContentStyles.blockMarksStyles,
				editorContentStyles.dateStyles,
				// eslint-disable-next-line @atlaskit/editor/enforce-todo-comment-format
				// TODO: uncomment and remove dynamic styles from getExtensionStyles
				// migrate this with packages/editor/editor-core/src/ui/EditorContentContainer/styles/extensionStyles.ts
				// suggest creating a new cssMap for the variant use case from the guide below
				// reference: https://atlassian.design/components/eslint-plugin-ui-styling-standard/no-dynamic-styles/usage
				// getExtensionStyles(contentMode),
				editorContentStyles.extensionDiffStyles,
				editorContentStyles.expandStylesBase,
				// Apply expand delta styles conditionally based on useStandardNodeWidth (negative margins or not)
				!useStandardNodeWidth && editorContentStyles.expandStyles,
				contentMode === 'compact' &&
				(expValEquals('confluence_compact_text_format', 'isEnabled', true) ||
					// eslint-disable-next-line @atlaskit/platform/no-preconditioning
					(expValEquals('cc_editor_ai_content_mode', 'variant', 'test') &&
						fg('platform_editor_content_mode_button_mvp'))) &&
				// eslint-disable-next-line @atlaskit/editor/enforce-todo-comment-format
				// TODO: uncomment and remove dynamic styles from getDenseExpandTitleStyles
				// migrate this with packages/editor/editor-core/src/ui/EditorContentContainer/styles/expandStyles.ts
				// getDenseExpandTitleStyles(baseFontSize),
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
				expValEqualsNoExposure('platform_editor_breakout_resizing', 'isEnabled', true)
					? editorContentStyles.pragmaticResizerStyles
					: undefined,
				expValEqualsNoExposure('platform_editor_breakout_resizing', 'isEnabled', true)
					? editorExperiment('platform_synced_block', true)
						? editorContentStyles.pragmaticResizerStylesCodeBlockSyncedBlockPatch
						: editorContentStyles.pragmaticResizerStylesCodeBlockLegacy
					: undefined,
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
				// eslint-disable-next-line @atlaskit/editor/enforce-todo-comment-format
				// TODO: uncomment and remove dynamic styles from getScaledDenseEmojiStyles and getDenseEmojiStyles
				// when migrate with packages/editor/editor-core/src/ui/EditorContentContainer/styles/emoji.ts
				// Dense emoji scaling based on base font size
				// contentMode === 'compact' &&
				// (expValEquals('confluence_compact_text_format', 'isEnabled', true) ||
				// 	// eslint-disable-next-line @atlaskit/platform/no-preconditioning
				// 	(expValEquals('cc_editor_ai_content_mode', 'variant', 'test') &&
				// 		fg('platform_editor_content_mode_button_mvp')))
				// 	? expValEquals('platform_editor_lovability_emoji_scaling', 'isEnabled', true)
				// 		? // eslint-disable-next-line @atlaskit/ui-styling-standard/no-imported-style-values
				// 			getScaledDenseEmojiStyles(baseFontSize)
				// 		: // eslint-disable-next-line @atlaskit/ui-styling-standard/no-imported-style-values
				// 			getDenseEmojiStyles(baseFontSize)
				// 	: undefined,
				editorContentStyles.panelViewStyles,
				editorContentStyles.mediaGroupStyles,
				editorContentStyles.mediaAlignmentStyles,
				expValEquals('platform_editor_small_font_size', 'isEnabled', true)
					? editorContentStyles.tableLayoutFixesWithFontSize
					: editorContentStyles.tableLayoutFixes,
				editorContentStyles.tableContainerStyles,
				// eslint-disable-next-line @atlaskit/editor/enforce-todo-comment-format
				// TODO: it was from "import { tableSharedStyle } from '@atlaskit/editor-common/styles';"
				// tableSharedStyle(),
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
			{children}
		</div>
	);
});
