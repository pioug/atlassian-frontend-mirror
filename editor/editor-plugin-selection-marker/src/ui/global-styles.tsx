/**
 * @jsxRuntime classic
 * @jsx jsx
 */
// eslint-disable-next-line @atlaskit/ui-styling-standard/no-global-styles, @atlaskit/ui-styling-standard/use-compiled -- Ignored via go/DSP-18766
import { css, Global, jsx } from '@emotion/react';

import { expValEqualsNoExposure } from '@atlaskit/tmp-editor-statsig/exp-val-equals-no-exposure';

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

const hideSelectionStyles = css({
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors
	'.ProseMirror  *.danger::selection': {
		background: 'transparent',
	},
});

export const GlobalStylesWrapper = () => {
	return (
		<Global
			styles={[
				globalStyles,
				expValEqualsNoExposure('platform_editor_block_menu', 'isEnabled', true) &&
					hideSelectionStyles,
			]}
		/>
	);
};
