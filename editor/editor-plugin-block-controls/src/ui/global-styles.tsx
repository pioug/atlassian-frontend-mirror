/** @jsx jsx */
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
	'[data-drag-handler-anchor-name]::after': {
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
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors
	'[data-blocks-decoration-container="true"] + *::after': {
		display: 'none',
	},
});

const paragraphWithTrailingBreak = '+ p > .ProseMirror-trailingBreak';
const paragraphWithCursorTarget = '+ p > .cursor-target';
const paragraphWithTrailingBreakAsOnlyChild = '+ p > .ProseMirror-trailingBreak:only-child';
const paragraphWithPlaceholder = '+ p > .placeholder-decoration';

const withoutInlineNodeStyleFix = css({
	// Currently, we are hiding the drag handle container by checking if the paragraph has a trailing break and no cursor target
	// TODO ED-23827 add a classname to empty paragraphs for easier targeting
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors, @atlaskit/ui-styling-standard/no-unsafe-values
	[`.ProseMirror-widget[data-blocks-drag-handle-container="true"]:has(${paragraphWithTrailingBreak}):not(:has(${paragraphWithCursorTarget}))`]:
		{
			// eslint-disable-next-line @atlaskit/ui-styling-standard/no-important-styles
			display: 'none !important',
		},
});

const withInlineNodeStyleFix = css({
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors, @atlaskit/ui-styling-standard/no-unsafe-values
	[`.ProseMirror-widget[data-blocks-drag-handle-container="true"]:has(${paragraphWithTrailingBreakAsOnlyChild}), .ProseMirror-widget[data-blocks-drag-handle-container="true"]:has(${paragraphWithPlaceholder})`]:
		{
			// eslint-disable-next-line @atlaskit/ui-styling-standard/no-important-styles
			display: 'none !important',
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
	[`p[data-drag-handler-anchor-name] .ProseMirror-widget[data-blocks-drag-handle-container="true"]`]:
		{
			// eslint-disable-next-line @atlaskit/ui-styling-standard/no-important-styles
			display: 'none !important',
		},
});

export const GlobalStylesWrapper = () => {
	return (
		<Global
			styles={[
				globalStyles,
				fg('platform.editor.elements.drag-and-drop-remove-wrapper_fyqr2') && extendedHoverZone,
				fg('platform.editor.elements.drag-and-drop-ed-23868')
					? withInlineNodeStyleFix
					: withoutInlineNodeStyleFix,
				fg('platform.editor.elements.drag-and-drop-ed-23932') && withDeleteLinesStyleFix,
			]}
		/>
	);
};
