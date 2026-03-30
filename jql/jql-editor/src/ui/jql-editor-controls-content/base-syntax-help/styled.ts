// eslint-disable-next-line @atlaskit/ui-styling-standard/use-compiled -- Ignored via go/DSP-18766
import styled from '@emotion/styled';

import { token } from '@atlaskit/tokens';

// eslint-disable-next-line @atlaskit/ui-styling-standard/no-styled, @atlaskit/ui-styling-standard/no-exported-styles -- Ignored via go/DSP-18766
export const SyntaxHelpContainer = styled.div({
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors -- Ignored via go/DSP-18766
	'> a': {
		background: token('color.background.neutral.bold'),
		borderRadius: token('radius.full'),
		margin: token('space.050'),
		'&:hover': {
			background: token('color.background.neutral.bold.hovered'),
		},
		'&:focus': {
			background: token('color.background.neutral.bold'),
		},
		// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors -- Ignored via go/DSP-18766
		"&:active, &[data-firefox-is-active='true']": {
			background: token('color.background.neutral.bold.pressed'),
		},
		// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors -- Ignored via go/DSP-18766
		'&[disabled]': {
			background: token('color.background.disabled'),
		},
	},
});
