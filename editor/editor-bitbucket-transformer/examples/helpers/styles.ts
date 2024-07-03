// eslint-disable-next-line @atlaskit/ui-styling-standard/use-compiled -- Ignored via go/DSP-18766
import { css } from '@emotion/react';
/* eslint-disable @atlaskit/design-system/ensure-design-token-usage */
import { N800 } from '@atlaskit/theme/colors';
import { token } from '@atlaskit/tokens';

// eslint-disable-next-line @atlaskit/ui-styling-standard/no-exported-styles -- Ignored via go/DSP-18766
export const content = css({
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors -- Ignored via go/DSP-18766
	'& div.toolsDrawer': {
		padding: `${token('space.100', '8px')} ${token('space.200', '16px')}`,
		background: N800,
		// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors -- Ignored via go/DSP-18766
		'& label': {
			display: 'flex',
			color: 'white',
			alignSelf: 'center',
			paddingRight: token('space.100', '8px'),
		},
		// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors -- Ignored via go/DSP-18766
		'& > div': {
			'/* padding': `${token('space.050', '4px')} 0`,
		},
		// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors -- Ignored via go/DSP-18766
		'& button': {
			margin: `${token('space.050', '4px')} 0`,
		},
	},
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors -- Ignored via go/DSP-18766
	'& legend': {
		margin: `${token('space.100', '8px')} 0`,
	},
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors -- Ignored via go/DSP-18766
	'& input': {
		fontSize: '13px',
	},
});
