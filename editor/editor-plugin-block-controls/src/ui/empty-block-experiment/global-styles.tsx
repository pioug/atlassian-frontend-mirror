/* eslint-disable @atlaskit/ui-styling-standard/no-exported-styles */
/* eslint-disable @atlaskit/ui-styling-standard/no-unsafe-values */
/* eslint-disable @atlaskit/ui-styling-standard/no-nested-selectors */
/* eslint-disable @atlaskit/ui-styling-standard/no-important-styles */
// eslint-disable-next-line @atlaskit/ui-styling-standard/use-compiled
import { css } from '@emotion/react';

import { fg } from '@atlaskit/platform-feature-flags';

const emptyBlockExperimentWidget = '.ProseMirror-widget[data-empty-block-experiment="true"]';
const quickInsertWidget = '.ProseMirror-widget[data-type-ahead="typeaheadDecoration"]';
const formattingElement = 'div.fabric-editor-block-mark';
const elementWithEmptyBlockExperiment = `+ p > ${emptyBlockExperimentWidget}, + h1 > ${emptyBlockExperimentWidget}, + h2 > ${emptyBlockExperimentWidget}, + h3 > ${emptyBlockExperimentWidget}, + h4 > ${emptyBlockExperimentWidget}, + h5 > ${emptyBlockExperimentWidget}, + h6 > ${emptyBlockExperimentWidget}`;
// Selectors for when contained withing a formatting container mark (eg. indent, centering, right-align)
const elementWithEmptyBlockExperimentFormatted = `+ ${formattingElement} > p > ${emptyBlockExperimentWidget}, + ${formattingElement} > h1 > ${emptyBlockExperimentWidget}, + ${formattingElement} > h2 > ${emptyBlockExperimentWidget}, + ${formattingElement} > h3 > ${emptyBlockExperimentWidget}, + ${formattingElement} > h4 > ${emptyBlockExperimentWidget}, + ${formattingElement} > h5 > ${emptyBlockExperimentWidget}, + ${formattingElement} > h6 > ${emptyBlockExperimentWidget}`;

const dragHandleContainer = '.ProseMirror-widget[data-blocks-drag-handle-container="true"]';
const dragHandleSelector = 'button[data-testid="block-ctrl-drag-handle"]';

// Hides the drag handle when the block contains the empty block experiment
// Override is consistent with how the drag handle is hidden when the block contains a placeholder
const dragHandleWithInlineNodeStyle = css({
	[`.ProseMirror-widget[data-blocks-drag-handle-container="true"]:has(${elementWithEmptyBlockExperiment}), .ProseMirror-widget[data-blocks-drag-handle-container="true"]:has(${elementWithEmptyBlockExperimentFormatted})`]:
		{
			display: 'none !important',
		},
});

// Alternate styling for hiding the drag handle when the block contains the empty block experiment
// Override is consistent with a feature-gated bugfix that hides the drag handle when the block contains a placeholder
/**
 * Please do not change change transform to display:none, or visibility:hidden
 * Otherwise it might break composition input for Chrome
 * https://product-fabric.atlassian.net/browse/ED-24136
 */
const dragHandleWithInlineNodeStyleWithChromeFix = css({
	[`${dragHandleContainer}:has(${elementWithEmptyBlockExperiment}) ${dragHandleSelector}, ${dragHandleContainer}:has(${elementWithEmptyBlockExperimentFormatted}) ${dragHandleSelector}`]:
		{
			transform: 'scale(0)',
		},
});

const getDragHandleOverrides = () => {
	return fg('platform_editor_element_controls_chrome_input_fix')
		? dragHandleWithInlineNodeStyleWithChromeFix
		: dragHandleWithInlineNodeStyle;
};

/**
 * Hide the experiment button when it has been activated. (contains quick-insert decoration widget)
 */
export const emptyBlockExperimentGlobalStyles = css(
	{
		[`${emptyBlockExperimentWidget}:has(+ ${quickInsertWidget}) button`]: {
			transform: 'scale(0)',
		},
	},
	getDragHandleOverrides(),
);
