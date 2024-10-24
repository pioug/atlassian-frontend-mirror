/**
 * @jsxRuntime classic
 * @jsx jsx
 */
// eslint-disable-next-line @atlaskit/ui-styling-standard/no-global-styles, @atlaskit/ui-styling-standard/use-compiled -- Ignored via go/DSP-18766
import { css, Global, jsx } from '@emotion/react';

import { token } from '@atlaskit/tokens';

const globalStyles = css({
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors, @atlaskit/ui-styling-standard/no-unsafe-selectors -- Ignored via go/DSP-18766
	'.ProseMirror [data-layout-column] span.pm-placeholder__text[data-placeholder]': {
		// eslint-disable-next-line @atlaskit/ui-styling-standard/no-important-styles -- Ignored via go/DSP-18766
		'&::after': {
			color: token('color.text.disabled', '#A5ADBA'),
			font: token('font.body'),
			fontStyle: 'italic',
		},
	},
});

export const GlobalStylesWrapper = () => {
	return <Global styles={globalStyles} />;
};
