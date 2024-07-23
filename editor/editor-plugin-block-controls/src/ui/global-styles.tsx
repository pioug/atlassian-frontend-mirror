/**
 * @jsxRuntime classic
 * @jsx jsx
 */
// eslint-disable-next-line @atlaskit/ui-styling-standard/no-global-styles, @atlaskit/ui-styling-standard/use-compiled -- Ignored via go/DSP-18766
import { css, Global, jsx } from '@emotion/react';

import { fg } from '@atlaskit/platform-feature-flags';

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
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors
	'[data-blocks-drag-handle-container="true"] + *::after': {
		display: 'none',
	},
});

const paragraphWithTrailingBreak = '+ p > .ProseMirror-trailingBreak';
const paragraphWithCursorTarget = '+ p > .cursor-target';
const paragraphWithTrailingBreakAsOnlyChild = '+ p > .ProseMirror-trailingBreak:only-child';
const paragraphWithPlaceholder = '+ p > .placeholder-decoration';
const dragHandleContainer = '.ProseMirror-widget[data-blocks-drag-handle-container="true"]';
const dragHandleSelector = 'button[data-testid="block-ctrl-drag-handle"]';

const withoutInlineNodeStyle = css({
	// Currently, we are hiding the drag handle container by checking if the paragraph has a trailing break and no cursor target
	// TODO ED-23827 add a classname to empty paragraphs for easier targeting
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors, @atlaskit/ui-styling-standard/no-unsafe-values
	[`.ProseMirror-widget[data-blocks-drag-handle-container="true"]:has(${paragraphWithTrailingBreak}):not(:has(${paragraphWithCursorTarget}))`]:
		{
			// eslint-disable-next-line @atlaskit/ui-styling-standard/no-important-styles
			display: 'none !important',
		},
});

const withInlineNodeStyle = css({
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors, @atlaskit/ui-styling-standard/no-unsafe-values
	[`.ProseMirror-widget[data-blocks-drag-handle-container="true"]:has(${paragraphWithTrailingBreakAsOnlyChild}), .ProseMirror-widget[data-blocks-drag-handle-container="true"]:has(${paragraphWithPlaceholder})`]:
		{
			// eslint-disable-next-line @atlaskit/ui-styling-standard/no-important-styles
			display: 'none !important',
		},
});

/**
 * Please do not change change transform to display:none, or visibility:hidden
 * Otherwise it might break composition input for Chrome
 * https://product-fabric.atlassian.net/browse/ED-24136
 */
const withoutInlineNodeStyleWithChromeFix = css({
	// Currently, we are hiding the drag handle container by checking if the paragraph has a trailing break and no cursor target
	// TODO ED-23827 add a classname to empty paragraphs for easier targeting
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors, @atlaskit/ui-styling-standard/no-unsafe-values
	[`${dragHandleContainer}:has(${paragraphWithTrailingBreak}):not(:has(${paragraphWithCursorTarget})) ${dragHandleSelector}`]:
		{
			transform: 'scale(0)',
		},
});

/**
 * Please do not change change transform to display:none, or visibility:hidden
 * Otherwise it might break composition input for Chrome
 * https://product-fabric.atlassian.net/browse/ED-24136
 */
const withInlineNodeStyleWithChromeFix = css({
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors, @atlaskit/ui-styling-standard/no-unsafe-values
	[`${dragHandleContainer}:has(${paragraphWithTrailingBreakAsOnlyChild}) ${dragHandleSelector},
	  ${dragHandleContainer}:has(${paragraphWithPlaceholder}) ${dragHandleSelector}`]: {
		transform: 'scale(0)',
	},
});

const globalStyles = css({
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors, @atlaskit/ui-styling-standard/no-unsafe-selectors -- Ignored via go/DSP-18766
	'.ProseMirror-widget:first-child + *': {
		// eslint-disable-next-line @atlaskit/ui-styling-standard/no-important-styles -- Ignored via go/DSP-18766
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

const getTextNodeStyle = () => {
	if (fg('platform.editor.elements.drag-and-drop-ed-23868')) {
		return fg('platform_editor_element_controls_chrome_input_fix')
			? withInlineNodeStyleWithChromeFix
			: withInlineNodeStyle;
	} else {
		return fg('platform_editor_element_controls_chrome_input_fix')
			? withoutInlineNodeStyleWithChromeFix
			: withoutInlineNodeStyle;
	}
};

export const GlobalStylesWrapper = () => {
	return (
		<Global
			styles={[
				globalStyles,
				fg('platform.editor.elements.drag-and-drop-remove-wrapper_fyqr2') && extendedHoverZone,
				getTextNodeStyle(),
				fg('platform.editor.elements.drag-and-drop-ed-23932') && withDeleteLinesStyleFix,
				fg('platform_editor_element_drag_and_drop_ed_24005') && withMediaSingleStyleFix,
			]}
		/>
	);
};
