import { css } from '@emotion/react';
import { token } from '@atlaskit/tokens';
// @ts-ignore: unused variable
// prettier-ignore
import { N800 } from '@atlaskit/theme/colors';
// eslint-disable-next-line @atlaskit/ui-styling-standard/no-exported-styles, @atlaskit/design-system/no-exported-css -- Ignored via go/DSP-18766
export const content = css({
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors -- Ignored via go/DSP-18766
	'& div.toolsDrawer': {
		padding: `${token('space.100', '8px')} ${token('space.200', '16px')}`,
		background: token('color.background.neutral.bold', N800),
		// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors -- Ignored via go/DSP-18766
		'& label': {
			display: 'flex',
			color: token('color.text.inverse', 'white'),
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
