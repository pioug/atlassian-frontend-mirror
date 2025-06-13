/**
 * @jsxRuntime classic
 * @jsx jsx
 */
// eslint-disable-next-line @atlaskit/ui-styling-standard/no-global-styles, @atlaskit/ui-styling-standard/use-compiled -- Ignored via go/DSP-18766
import { css, Global, jsx } from '@emotion/react';

import { tableControlsSpacing } from '@atlaskit/editor-common/styles';
import { ZERO_WIDTH_SPACE } from '@atlaskit/editor-common/whitespace';
import {
	akEditorBreakoutPadding,
	akEditorCalculatedWideLayoutWidth,
	akEditorCalculatedWideLayoutWidthSmallViewport,
	akEditorGutterPaddingDynamic,
} from '@atlaskit/editor-shared-styles';
import { fg } from '@atlaskit/platform-feature-flags';
import { layers } from '@atlaskit/theme/constants';
import { editorExperiment } from '@atlaskit/tmp-editor-statsig/experiments';
import { token } from '@atlaskit/tokens';

import { DRAG_HANDLE_MAX_WIDTH_PLUS_GAP, DRAG_HANDLE_WIDTH } from './consts';

/**
 * This anchor element selector disregards anchors that are solely utilized for size measurements,
 * including those within table rows and media.
 */
const dragHandlerAnchorSelector =
	'[data-drag-handler-anchor-name]:not([data-drag-handler-node-type="tableRow"], [data-drag-handler-node-type="media"])';

const gutterPaddingWidth = () =>
	editorExperiment('platform_editor_controls', 'variant1') &&
	fg('platform_editor_controls_patch_13')
		? `${akEditorGutterPaddingDynamic()}px`
		: '100%';

const gutterPaddingLeft = () =>
	editorExperiment('platform_editor_controls', 'variant1') &&
	fg('platform_editor_controls_patch_13')
		? `-${akEditorGutterPaddingDynamic()}px`
		: '-100px';

const extendedHoverZone = () =>
	css({
		// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors, @atlaskit/ui-styling-standard/no-unsafe-values
		[`.block-ctrl-drag-preview ${dragHandlerAnchorSelector}::after`]: {
			// eslint-disable-next-line @atlaskit/ui-styling-standard/no-important-styles
			display: 'none !important',
		},
		// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors
		'.ProseMirror': {
			// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors, @atlaskit/ui-styling-standard/no-unsafe-selectors, @atlaskit/ui-styling-standard/no-unsafe-values
			[`&& ${dragHandlerAnchorSelector}::after`]: {
				content: '""',
				position: 'absolute',
				top: 0,
				// eslint-disable-next-line @atlaskit/ui-styling-standard/no-unsafe-values, @atlaskit/ui-styling-standard/no-imported-style-values
				left: `-${DRAG_HANDLE_MAX_WIDTH_PLUS_GAP}px`,
				// eslint-disable-next-line @atlaskit/ui-styling-standard/no-unsafe-values, @atlaskit/ui-styling-standard/no-imported-style-values
				width: `${DRAG_HANDLE_MAX_WIDTH_PLUS_GAP}px`,
				height: '100%',
				cursor: 'default',
				zIndex: 1,
			},
			// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors, @atlaskit/ui-styling-standard/no-unsafe-selectors, @atlaskit/ui-styling-standard/no-unsafe-values
			[`&& [data-drag-handler-anchor-depth="0"]${dragHandlerAnchorSelector}::after`]: {
				content: '""',
				position: 'absolute',
				top: 0,
				// eslint-disable-next-line @atlaskit/ui-styling-standard/no-imported-style-values, @atlaskit/ui-styling-standard/no-unsafe-values -- Ignored via go/DSP-18766
				left: gutterPaddingLeft(),
				// eslint-disable-next-line @atlaskit/ui-styling-standard/no-imported-style-values, @atlaskit/ui-styling-standard/no-unsafe-values -- Ignored via go/DSP-18766
				width: gutterPaddingWidth(),
				height: '100%',
				cursor: 'default',
				// eslint-disable-next-line @atlaskit/ui-styling-standard/no-imported-style-values, @atlaskit/ui-styling-standard/no-unsafe-values
				zIndex: -1,
			},
			// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors, @atlaskit/ui-styling-standard/no-unsafe-selectors, @atlaskit/ui-styling-standard/no-unsafe-values
			[`&& :is(.pm-table-cell-content-wrap, .pm-table-header-content-wrap) > ${dragHandlerAnchorSelector}::after`]:
				{
					content: '""',
					position: 'absolute',
					top: 0,
					// eslint-disable-next-line @atlaskit/ui-styling-standard/no-unsafe-values, @atlaskit/ui-styling-standard/no-imported-style-values
					left: 0,
					// eslint-disable-next-line @atlaskit/ui-styling-standard/no-unsafe-values, @atlaskit/ui-styling-standard/no-imported-style-values
					width: 0,
					height: '100%',
					cursor: 'default',
					zIndex: 1,
				},

			// hover zone for layout column should be placed near the top of the column (where drag handle is)
			// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors, @atlaskit/ui-styling-standard/no-unsafe-selectors
			'&& [data-drag-handler-anchor-name][data-layout-column]::after': {
				content: '""',
				position: 'absolute',
				// eslint-disable-next-line @atlaskit/ui-styling-standard/no-unsafe-values, @atlaskit/ui-styling-standard/no-imported-style-values
				top: `${-DRAG_HANDLE_WIDTH / 2}px`,
				// eslint-disable-next-line @atlaskit/ui-styling-standard/no-unsafe-values, @atlaskit/ui-styling-standard/no-imported-style-values
				left: 0,
				// eslint-disable-next-line @atlaskit/ui-styling-standard/no-unsafe-values, @atlaskit/ui-styling-standard/no-imported-style-values
				width: '100%',
				// eslint-disable-next-line @atlaskit/ui-styling-standard/no-imported-style-values, @atlaskit/ui-styling-standard/no-unsafe-values
				height: `${DRAG_HANDLE_WIDTH}px`,
				cursor: 'default',
				zIndex: 1,
			},
		},
		// TODO: ED-23995 - this style override needs to be moved to the Rule styles after FF cleanup packages/editor/editor-common/src/styles/shared/rule.ts
		// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors
		'hr[data-drag-handler-anchor-name]': {
			overflow: 'visible',
		},
		//Hide pseudo element at top depth level. Leave for nested depths to prevent mouseover loop.
		//eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors
		'[data-blocks-drag-handle-container="true"] + [data-drag-handler-anchor-depth="0"]::after': {
			display: 'none',
		},
	});

const paragraphWithTrailingBreakAsOnlyChild =
	'+ :is(p, h1, h2, h3, h4, h5, h6) > .ProseMirror-trailingBreak:only-child';
const indentatedParagraphWithTrailingBreakAsOnlyChild =
	'+ div.fabric-editor-indentation-mark > :is(p, h1, h2, h3, h4, h5, h6) > .ProseMirror-trailingBreak:only-child';
const paragraphWithPlaceholder = '+ p > .placeholder-decoration';
const dragHandleContainer = '.ProseMirror-widget[data-blocks-drag-handle-container="true"]';
const dragHandleSelector = 'button[data-testid="block-ctrl-drag-handle"]';
const dropTargetContainer = '.ProseMirror-widget[data-blocks-drop-target-container="true"]';
const dividerBodiedInCustomPanelWithNoIconSelector =
	'[data-panel-type].ak-editor-panel__no-icon .ProseMirror-widget:first-child + .ProseMirror-widget:nth-child(2) + hr, [data-panel-type] hr:first-child';
const withInlineNodeStyleSelectors = [
	`${dragHandleContainer}:has(${paragraphWithTrailingBreakAsOnlyChild}) ${dragHandleSelector}`,
	`${dragHandleContainer}:has(${indentatedParagraphWithTrailingBreakAsOnlyChild}) ${dragHandleSelector}`,
	`${dragHandleContainer}:has(${paragraphWithPlaceholder}) ${dragHandleSelector}`,
].join(', ');

const withFormatInLayoutStyleFixSelectors = [
	`${dragHandleContainer}:first-child + .fabric-editor-indentation-mark > p:first-child`,
	`${dragHandleContainer}:first-child + .fabric-editor-alignment > p:first-child`,
	`${dragHandleContainer}:first-child + ${dropTargetContainer} + .fabric-editor-indentation-mark > p:first-child`,
	`${dragHandleContainer}:first-child + ${dropTargetContainer} + .fabric-editor-alignment > p:first-child`,
	`${dropTargetContainer}:first-child + .fabric-editor-alignment > p:first-child`,
	`${dropTargetContainer}:first-child + .fabric-editor-indentation-mark > p:first-child`,
	`${dragHandleContainer}:first-child + .fabric-editor-indentation-mark > :is(h1, h2, h3, h4, h5, h6):first-child`,
].join(', ');

/**
 * Please do not change change transform to display:none, or visibility:hidden
 * Otherwise it might break composition input for Chrome
 * https://product-fabric.atlassian.net/browse/ED-24136
 */
const withInlineNodeStyle = css({
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors, @atlaskit/ui-styling-standard/no-unsafe-values
	[withInlineNodeStyleSelectors]: {
		transform: 'scale(0)',
	},
});

const legacyBreakoutWideLayoutStyle = css({
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors, @atlaskit/ui-styling-standard/no-unsafe-values
	'.ProseMirror-widget[data-blocks-drop-target-container="true"]': {
		// eslint-disable-next-line @atlaskit/ui-styling-standard/no-imported-style-values, @atlaskit/ui-styling-standard/no-unsafe-values
		'--ak-editor--legacy-breakout-wide-layout-width': `${akEditorCalculatedWideLayoutWidthSmallViewport}px`,

		'@media (width>=1280px)': {
			// eslint-disable-next-line @atlaskit/ui-styling-standard/no-imported-style-values, @atlaskit/ui-styling-standard/no-unsafe-values
			'--ak-editor--legacy-breakout-wide-layout-width': `${akEditorCalculatedWideLayoutWidth}px`,
		},
	},
});

const globalDnDStyle = css({
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors
	'.ProseMirror': {
		// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors, @atlaskit/ui-styling-standard/no-unsafe-selectors, @atlaskit/ui-styling-standard/no-unsafe-values
		'[data-layout-content]': {
			userDrag: 'none',
		},
	},
});

const globalStyles = () =>
	css({
		// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors, @atlaskit/ui-styling-standard/no-unsafe-selectors -- Ignored via go/DSP-18766
		'.ProseMirror-widget:first-child + *:not([data-panel-type], .code-block, [data-node-type="nestedExpand"], [data-layout-section="true"])':
			{
				// eslint-disable-next-line @atlaskit/ui-styling-standard/no-important-styles -- Ignored via go/DSP-18766
				marginTop: '0 !important',
			},
	});

const quickInsertStyles = () =>
	css({
		// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors
		'.blocks-quick-insert-button': {
			backgroundColor: 'transparent',
			top: `var(--top-override,8px)`,
			position: 'sticky',
			boxSizing: 'border-box',
			display: 'flex',
			flexDirection: 'column',
			justifyContent: 'center',
			alignItems: 'center',
			height: token('space.300'),
			width: token('space.300'),
			border: 'none',
			borderRadius: '50%',
			zIndex: layers.card(),
			outline: 'none',
			cursor: 'pointer',
			color: token('color.icon.subtle'),
		},
		// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors, @atlaskit/ui-styling-standard/no-unsafe-selectors
		'[data-blocks-quick-insert-container]:has(~ [data-prosemirror-node-name="table"] .pm-table-with-controls tr.sticky) &':
			{
				// eslint-disable-next-line @atlaskit/ui-styling-standard/no-imported-style-values, @atlaskit/ui-styling-standard/no-unsafe-values
				'--top-override': `${tableControlsSpacing}px`,
			},
		// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors, @atlaskit/ui-styling-standard/no-unsafe-selectors
		'[data-prosemirror-mark-name="breakout"]:has([data-blocks-quick-insert-container]):has(~ [data-prosemirror-node-name="table"] .pm-table-with-controls tr.sticky) &':
			{
				// eslint-disable-next-line @atlaskit/ui-styling-standard/no-imported-style-values, @atlaskit/ui-styling-standard/no-unsafe-values
				'--top-override': `${tableControlsSpacing}px`,
			},
		// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors
		'.blocks-quick-insert-button:hover': {
			backgroundColor: token('color.background.neutral.subtle.hovered'),
		},
		// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors
		'.blocks-quick-insert-button:active': {
			backgroundColor: token('color.background.neutral.subtle.pressed'),
		},
		// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors
		'.blocks-quick-insert-button:focus': {
			outline: `2px solid ${token('color.border.focused', '#388BFF')}`,
		},
		// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors
		'.blocks-quick-insert-visible-container': {
			transition: 'opacity 0.1s ease-in-out, visibility 0.1s ease-in-out',
			opacity: 1,
			visibility: 'visible',
		},
		// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors
		'.blocks-quick-insert-invisible-container': {
			transition: 'opacity 0.1s ease-in-out, visibility 0.1s ease-in-out',
			opacity: 0,
			visibility: 'hidden',
		},
		// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors
		'.blocks-quick-insert-tooltip': {
			zIndex: layers.tooltip(),
			borderRadius: token('border.radius'),
			padding: `${token('space.050')} 0`,
			boxSizing: 'border-box',
			maxWidth: '240px',
			backgroundColor: token('color.background.neutral.bold'),
			color: token('color.text.inverse'),
			font: token('font.body.UNSAFE_small'),
			insetBlockStart: token('space.0', '0px'),
			insetInlineStart: token('space.0', '0px'),
			overflowWrap: 'break-word',
			paddingBlockEnd: token('space.025', '2px'),
			paddingBlockStart: token('space.025', '2px'),
			paddingInlineEnd: token('space.075', '6px'),
			paddingInlineStart: token('space.075', '6px'),
			wordWrap: 'break-word',
			pointerEvents: 'none',
			userSelect: 'none',
			// Based on: platform/packages/design-system/motion/src/entering/keyframes-motion.tsx
			transition: 'opacity .1s ease-in-out, transform .1s ease-in-out, visibility .1s ease-in-out',
			'@media (prefers-reduced-motion: reduce)': {
				transition: 'none',
			},
		},
	});

const topLevelNodeMarginStyles = css({
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors, @atlaskit/ui-styling-standard/no-unsafe-selectors -- Ignored via go/DSP-18766
	'.ProseMirror': {
		// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors, @atlaskit/ui-styling-standard/no-unsafe-selectors
		'> .ProseMirror-widget:first-child + .ProseMirror-gapcursor + *:not([data-layout-section="true"]), > .ProseMirror-widget:first-child + *:not([data-layout-section="true"])':
			{
				// eslint-disable-next-line @atlaskit/ui-styling-standard/no-important-styles -- Ignored via go/DSP-18766
				marginTop: '0 !important',
			},
	},
});

const withDividerInPanelStyleFix = css({
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors, @atlaskit/ui-styling-standard/no-unsafe-values
	[`${dividerBodiedInCustomPanelWithNoIconSelector}`]: {
		// eslint-disable-next-line @atlaskit/ui-styling-standard/no-important-styles
		marginTop: '0 !important',
	},
});

const withDeleteLinesStyleFix = css({
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors, @atlaskit/ui-styling-standard/no-unsafe-values
	[`p[data-drag-handler-anchor-name] ${dragHandleContainer}`]: {
		// eslint-disable-next-line @atlaskit/ui-styling-standard/no-important-styles
		display: 'none !important',
	},
});

// Image dnd is broken in Firefox due to a previous fix for image caption https://product-fabric.atlassian.net/browse/ED-14034
// We could remove this fix if the previous issue is invalid
const withMediaSingleStyleFix = css({
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors, @atlaskit/ui-styling-standard/no-unsafe-values
	['.ProseMirror.ua-firefox .mediaSingleView-content-wrap[data-drag-handler-node-type="mediaSingle"][data-drag-handler-anchor-name], .ProseMirror.ua-firefox [data-drag-handler-anchor-name][data-drag-handler-node-type] .mediaSingleView-content-wrap']:
		{
			userSelect: 'auto',
			cursor: 'pointer',
		},
});

const withFormatInLayoutStyleFix = css({
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors, @atlaskit/ui-styling-standard/no-unsafe-values
	[`${withFormatInLayoutStyleFixSelectors}`]: {
		// eslint-disable-next-line @atlaskit/ui-styling-standard/no-important-styles
		marginTop: '0 !important',
	},
});

const headingWithIndentationInLayoutStyleFix = css({
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors, @atlaskit/ui-styling-standard/no-unsafe-values
	[`${dragHandleContainer}:first-child + .fabric-editor-indentation-mark > :is(h1, h2, h3, h4, h5, h6):first-child`]:
		{
			// eslint-disable-next-line @atlaskit/ui-styling-standard/no-important-styles
			marginTop: '0 !important',
		},
});

const withRelativePosStyleLegacy = css({
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors
	'.ProseMirror': {
		// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors, @atlaskit/ui-styling-standard/no-unsafe-selectors, @atlaskit/ui-styling-standard/no-unsafe-values
		[`&& ${dragHandlerAnchorSelector}`]: {
			position: 'relative',
		},
	},
});

const withRelativePosStyle = css({
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors
	'.ProseMirror': {
		// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors, @atlaskit/ui-styling-standard/no-unsafe-selectors, @atlaskit/ui-styling-standard/no-unsafe-values
		[`&& ${dragHandlerAnchorSelector}`]: {
			position: 'relative',
		},
		// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors, @atlaskit/ui-styling-standard/no-unsafe-selectors, @atlaskit/ui-styling-standard/no-unsafe-values
		[`&& ${dragHandlerAnchorSelector}:has(> .ProseMirror-trailingBreak:only-child)::before`]: {
			// Workaround to force safari to show the cursor on blank lines even when there is no content
			// See: CONFCLOUD-80210
			// eslint-disable-next-line @atlaskit/ui-styling-standard/no-imported-style-values, @atlaskit/ui-styling-standard/no-unsafe-values
			content: `"${ZERO_WIDTH_SPACE}"`,
		},
	},
});

const withAnchorNameZindexStyle = css({
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors
	'.ProseMirror': {
		// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors, @atlaskit/ui-styling-standard/no-unsafe-selectors
		'&& [data-drag-handler-anchor-depth="0"][data-drag-handler-anchor-name]': {
			zIndex: 1,
		},
	},
});

// This style is used to define width for block card (with datasource) that does not have layout
// In full-width editor, block card has width of full-width layout
// In fixed-width editor, block card has width of wide layout
const blockCardWithoutLayout = css({
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors
	'.ak-editor-content-area.fabric-editor--full-width-mode .ProseMirror .ProseMirror-widget[data-blocks-drop-target-container="true"]':
		{
			// eslint-disable-next-line @atlaskit/ui-styling-standard/no-imported-style-values, @atlaskit/ui-styling-standard/no-unsafe-values
			'--ak-editor-block-card-width': `min(calc(100cqw - ${akEditorBreakoutPadding}px), 1800px)`,
		},

	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors, @atlaskit/ui-styling-standard/no-unsafe-selectors
	'.ak-editor-content-area .ProseMirror .ProseMirror-widget[data-blocks-drop-target-container="true"]':
		{
			'--ak-editor-block-card-width':
				'max(var(--ak-editor--legacy-breakout-wide-layout-width), var(--ak-editor--line-length))',
		},
});

export const GlobalStylesWrapper = () => {
	return (
		<Global
			styles={[
				globalStyles(),
				globalDnDStyle,
				extendedHoverZone(),
				editorExperiment('platform_editor_controls', 'variant1') &&
				fg('platform_editor_controls_widget_visibility')
					? undefined
					: withInlineNodeStyle,
				editorExperiment('platform_editor_block_control_optimise_render', true)
					? quickInsertStyles
					: undefined,
				withDeleteLinesStyleFix,
				withMediaSingleStyleFix,
				legacyBreakoutWideLayoutStyle,
				headingWithIndentationInLayoutStyleFix,
				editorExperiment('advanced_layouts', true) ? blockCardWithoutLayout : undefined,
				withDividerInPanelStyleFix,
				withFormatInLayoutStyleFix,
				fg('platform_editor_fix_safari_cursor_hidden_empty')
					? withRelativePosStyle
					: withRelativePosStyleLegacy,
				topLevelNodeMarginStyles,
				withAnchorNameZindexStyle,
			]}
		/>
	);
};
