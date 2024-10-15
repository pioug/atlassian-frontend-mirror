/**
 * @jsxRuntime classic
 * @jsx jsx
 */
// eslint-disable-next-line @atlaskit/ui-styling-standard/no-global-styles, @atlaskit/ui-styling-standard/use-compiled -- Ignored via go/DSP-18766
import { css, Global, jsx } from '@emotion/react';

import { fg } from '@atlaskit/platform-feature-flags';
import { editorExperiment } from '@atlaskit/tmp-editor-statsig/experiments';

import { DRAG_HANDLE_MAX_WIDTH_PLUS_GAP } from './consts';
import { emptyBlockExperimentGlobalStyles } from './empty-block-experiment/global-styles';

const extendedHoverZone = css({
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors
	'.block-ctrl-drag-preview [data-drag-handler-anchor-name]::after': {
		// eslint-disable-next-line @atlaskit/ui-styling-standard/no-important-styles
		display: 'none !important',
	},
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors
	'.ProseMirror': {
		// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors, @atlaskit/ui-styling-standard/no-unsafe-selectors
		'&& [data-drag-handler-anchor-name]::after': {
			content: '""',
			position: 'absolute',
			top: 0,
			left: '-100%',
			width: '100%',
			height: '100%',
			background: 'transparent',
			cursor: 'default',
			zIndex: -1,
		},
	},
	// TODO - ED-23995 this style override needs to be moved to the Rule styles after FF cleanup - packages/editor/editor-common/src/styles/shared/rule.ts
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors
	'hr[data-drag-handler-anchor-name]': {
		overflow: 'visible',
	},
	//eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors
	'[data-blocks-drag-handle-container="true"] + *::after': {
		display: 'none',
	},
});

const extendedHoverZoneNested = css({
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors
	'.block-ctrl-drag-preview [data-drag-handler-anchor-name]::after': {
		// eslint-disable-next-line @atlaskit/ui-styling-standard/no-important-styles
		display: 'none !important',
	},
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors
	'.ProseMirror': {
		// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors, @atlaskit/ui-styling-standard/no-unsafe-selectors
		'&& [data-drag-handler-anchor-name]::after': {
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
		// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors, @atlaskit/ui-styling-standard/no-unsafe-selectors
		'&& [data-drag-handler-anchor-depth="0"][data-drag-handler-anchor-name]::after': {
			content: '""',
			position: 'absolute',
			top: 0,
			left: '-100%',
			width: '100%',
			height: '100%',
			cursor: 'default',
			zIndex: -1,
		},
		// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors, @atlaskit/ui-styling-standard/no-unsafe-selectors
		'&& :is(.pm-table-cell-content-wrap, .pm-table-header-content-wrap) > [data-drag-handler-anchor-name]::after':
			{
				content: '""',
				position: 'absolute',
				top: 0,
				// eslint-disable-next-line @atlaskit/ui-styling-standard/no-unsafe-values, @atlaskit/ui-styling-standard/no-imported-style-values
				left: `-${editorExperiment('table-nested-dnd', true) ? DRAG_HANDLE_MAX_WIDTH_PLUS_GAP : 0}px`,
				// eslint-disable-next-line @atlaskit/ui-styling-standard/no-unsafe-values, @atlaskit/ui-styling-standard/no-imported-style-values
				width: `${editorExperiment('table-nested-dnd', true) ? DRAG_HANDLE_MAX_WIDTH_PLUS_GAP : 0}px`,
				height: '100%',
				cursor: 'default',
				zIndex: 1,
			},
	},
	// TODO - ED-23995 this style override needs to be moved to the Rule styles after FF cleanup - packages/editor/editor-common/src/styles/shared/rule.ts
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

const withInlineNodeStyleSelectors = [
	`.ProseMirror-widget[data-blocks-drag-handle-container="true"]:has(${paragraphWithTrailingBreakAsOnlyChild})`,
	`.ProseMirror-widget[data-blocks-drag-handle-container="true"]:has(${indentatedParagraphWithTrailingBreakAsOnlyChild})`,
	`.ProseMirror-widget[data-blocks-drag-handle-container="true"]:has(${paragraphWithPlaceholder})`,
].join(', ');

const dividerBodiedInCustomPanelWithNoIconSelector =
	'[data-panel-type].ak-editor-panel__no-icon .ProseMirror-widget:first-child + .ProseMirror-widget:nth-child(2) + hr, [data-panel-type] hr:first-child';

const withInlineNodeStyle = css({
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors, @atlaskit/ui-styling-standard/no-unsafe-values
	[withInlineNodeStyleSelectors]: {
		// eslint-disable-next-line @atlaskit/ui-styling-standard/no-important-styles
		display: 'none !important',
	},
});

const withInlineNodeStyleWithChromeFixSelectors = [
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
].join(', ');

/**
 * Please do not change change transform to display:none, or visibility:hidden
 * Otherwise it might break composition input for Chrome
 * https://product-fabric.atlassian.net/browse/ED-24136
 */
const withInlineNodeStyleWithChromeFix = css({
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors, @atlaskit/ui-styling-standard/no-unsafe-values
	[withInlineNodeStyleWithChromeFixSelectors]: {
		transform: 'scale(0)',
	},
});
const globalStyles = css({
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors, @atlaskit/ui-styling-standard/no-unsafe-selectors -- Ignored via go/DSP-18766
	'.ProseMirror-widget:first-child + *:not([data-panel-type], .code-block, [data-node-type="nestedExpand"])':
		{
			// eslint-disable-next-line @atlaskit/ui-styling-standard/no-important-styles -- Ignored via go/DSP-18766
			marginTop: '0 !important',
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
const getTextNodeStyle = () => {
	return fg('platform_editor_element_controls_chrome_input_fix')
		? withInlineNodeStyleWithChromeFix
		: withInlineNodeStyle;
};

export const GlobalStylesWrapper = () => {
	return (
		<Global
			styles={[
				globalStyles,
				editorExperiment('nested-dnd', true) ? extendedHoverZoneNested : extendedHoverZone,
				getTextNodeStyle(),
				withDeleteLinesStyleFix,
				withMediaSingleStyleFix,
				editorExperiment('platform_editor_empty_line_prompt', true, { exposure: false })
					? emptyBlockExperimentGlobalStyles
					: undefined,
				fg('platform_editor_element_dnd_nested_fix_patch_1')
					? withDividerInPanelStyleFix
					: undefined,
				fg('platform_editor_element_dnd_nested_fix_patch_2')
					? withFormatInLayoutStyleFix
					: undefined,
			]}
		/>
	);
};
