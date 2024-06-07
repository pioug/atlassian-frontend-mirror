import styled from '@emotion/styled';

import { N50, N500, N600, N70 } from '@atlaskit/theme/colors';
import { token } from '@atlaskit/tokens';

// eslint-disable-next-line @atlaskit/ui-styling-standard/no-styled -- To migrate as part of go/ui-styling-standard
export const SyntaxHelpContainer = styled.div({
	'> a': {
		background: token('color.background.neutral.bold', N70),
		borderRadius: '100%',
		margin: token('space.050', '4px'),
		'&:hover': {
			background: token('color.background.neutral.bold.hovered', N500),
		},
		'&:focus': {
			background: token('color.background.neutral.bold', N70),
		},
		"&:active, &[data-firefox-is-active='true']": {
			background: token('color.background.neutral.bold.pressed', N600),
		},
		'&[disabled]': {
			background: token('color.background.disabled', N50),
		},
	},
});
