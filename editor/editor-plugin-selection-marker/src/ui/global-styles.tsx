/** @jsx jsx */
// eslint-disable-next-line @atlaskit/ui-styling-standard/no-global-styles, @atlaskit/ui-styling-standard/use-compiled -- Ignored via go/DSP-18766
import { css, Global, jsx } from '@emotion/react';

/**
 * Unset the selection background color as we are using our own
 * Otherwise we might have a mix of grey + our selection marker depending on the state.
 *
 * Edge cases:
 * - We do not apply this reset to input fields (ie. expand case) because otherwise
 * selection highlight will not show on those.
 * - We do not apply this reset when the editor is disabled
 */
const globalStyles = css({
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors, @atlaskit/ui-styling-standard/no-unsafe-selectors -- Ignored via go/DSP-18766
	'.ProseMirror:not(:focus):not([contenteditable="false"]) ::selection:not(input)': {
		background: 'unset',
	},
});

export const GlobalStylesWrapper = () => {
	return <Global styles={globalStyles} />;
};
