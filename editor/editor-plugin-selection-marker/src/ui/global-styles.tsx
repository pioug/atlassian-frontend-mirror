/**
 * @jsxRuntime classic
 * @jsx jsx
 */
// eslint-disable-next-line @atlaskit/ui-styling-standard/no-global-styles, @atlaskit/ui-styling-standard/use-compiled, @typescript-eslint/consistent-type-imports
import { css, Global, jsx } from '@emotion/react';

import { isExperimentEnabled } from '@atlaskit/platform-feature-experiments/is-experiment-enabled';
import { fg } from '@atlaskit/platform-feature-flags/fg';

/**
 * Unset the selection background color as we are using our own
 * Otherwise we might have a mix of grey + our selection marker depending on the state.
 *
 * Edge cases:
 * - We do not apply this reset to input fields or code blocks (ie. expand case) because otherwise
 * selection highlight will not show on those.
 * - We do not apply this reset when the editor is disabled
 */
const globalStyles = css({
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors, @atlaskit/ui-styling-standard/no-unsafe-selectors -- Ignored via go/DSP-18766
	'.ProseMirror:not(:focus):not([contenteditable="false"]) ::selection:not(input, .cm-editor)': {
		background: 'unset',
	},
});

// Target marker text directly rather than depending on the editor root's focus
// state. The style-recalculation benefit still needs profiling on large documents.
const markerSelectionStyles = css({
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-unsafe-selectors, @atlaskit/ui-styling-standard/no-nested-selectors -- ProseMirror owns the decoration DOM; React cannot style its selection pseudo-element directly.
	'.ProseMirror:not([contenteditable="false"]) [data-selection-marker]::selection': {
		background: 'unset',
	},
});

/**
 * Hides the native highlight wherever the marker paints the selection, including inside inline
 * atom node views. The native selection is not restored while the editor is blurred, so any part
 * of it left on marker content would otherwise show through.
 */
const markerAndDescendantSelectionStyles = css({
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-unsafe-selectors, @atlaskit/ui-styling-standard/no-nested-selectors -- ProseMirror owns the decoration DOM; React cannot style its selection pseudo-element directly.
	'.ProseMirror:not([contenteditable="false"]) [data-selection-marker]::selection, .ProseMirror:not([contenteditable="false"]) [data-selection-marker] ::selection':
		{
			background: 'transparent',
		},
});

const hideSelectionStyles = css({
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors
	'.ProseMirror  *.danger::selection': {
		background: 'transparent',
	},
});

const getSelectionStyles = () => {
	if (fg('platform_editor_selection_marker_blur_fix')) {
		return markerAndDescendantSelectionStyles;
	}
	return isExperimentEnabled('platform_editor_improve_inp_batch_3')
		? markerSelectionStyles
		: globalStyles;
};

export const GlobalStylesWrapper = (): jsx.JSX.Element => {
	const selectionStyles = getSelectionStyles();

	return (
		<Global
			// eslint-disable-next-line @atlassian/perf-linting/no-unstable-inline-props -- Ignored via go/ees017 (to be fixed)
			styles={[selectionStyles, hideSelectionStyles]}
		/>
	);
};
