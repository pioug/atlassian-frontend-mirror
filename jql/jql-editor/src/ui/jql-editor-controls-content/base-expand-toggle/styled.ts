// eslint-disable-next-line @atlaskit/ui-styling-standard/use-compiled -- Ignored via go/DSP-18766
import styled from '@emotion/styled';

import { N40, N50 } from '@atlaskit/theme/colors';
import { token } from '@atlaskit/tokens';

// eslint-disable-next-line @atlaskit/ui-styling-standard/no-styled, @atlaskit/ui-styling-standard/no-exported-styles -- Ignored via go/DSP-18766
export const ExpandToggleContainer = styled.div({
	/* Override background styles for our button to match designs */
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors -- Ignored via go/DSP-18766
	'> button': {
		borderRadius: '100%',
		/* Fill the remaining vertical space for a single line in our editor and space between buttons */
		margin: `${token('space.050', '4px')} 0`,
		'&:hover': {
			background: token('color.background.neutral.subtle.hovered', N40),
		},
		// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors -- Ignored via go/DSP-18766
		"&:active, &[data-firefox-is-active='true']": {
			background: token('color.background.neutral.subtle.pressed', N50),
		},
	},
});
