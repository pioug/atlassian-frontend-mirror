import { css } from '@emotion/react';

import { relativeFontSizeToBase16 } from '@atlaskit/editor-shared-styles';
import { N800 } from '@atlaskit/theme/colors';
import { token } from '@atlaskit/tokens';

/* eslint-disable @atlaskit/design-system/ensure-design-token-usage */
export const content = css({
	'& div.toolsDrawer': {
		marginTop: token('space.200', '16px'),
		padding: `${token('space.100', '8px')} ${token('space.200', '16px')}`,
		background: token('color.background.neutral.bold', N800),
		'& label': {
			display: 'flex',
			color: 'white',
			alignSelf: 'center',
			paddingRight: token('space.100', '8px'),
		},
		'& button': {
			margin: `${token('space.050', '4px')} 0`,
		},
	},
	'& legend': {
		margin: `${token('space.100', '8px')} 0`,
	},
	'& input': {
		fontSize: relativeFontSizeToBase16(13),
	},
});

export const buttonGroup = css({
	display: 'flex',
	'& > button': {
		marginLeft: token('space.050', '4px'),
	},
});
