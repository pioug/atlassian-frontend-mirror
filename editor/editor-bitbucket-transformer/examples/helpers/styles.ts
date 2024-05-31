import { css } from '@emotion/react';
/* eslint-disable @atlaskit/design-system/ensure-design-token-usage */
import { N800 } from '@atlaskit/theme/colors';
import { token } from '@atlaskit/tokens';

export const content = css({
	'& div.toolsDrawer': {
		padding: `${token('space.100', '8px')} ${token('space.200', '16px')}`,
		background: N800,
		'& label': {
			display: 'flex',
			color: 'white',
			alignSelf: 'center',
			paddingRight: token('space.100', '8px'),
		},
		'& > div': {
			'/* padding': `${token('space.050', '4px')} 0`,
		},
		'& button': {
			margin: `${token('space.050', '4px')} 0`,
		},
	},
	'& legend': {
		margin: `${token('space.100', '8px')} 0`,
	},
	'& input': {
		fontSize: '13px',
	},
});
