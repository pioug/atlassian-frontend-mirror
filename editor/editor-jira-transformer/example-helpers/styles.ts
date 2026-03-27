/* eslint-disable @atlaskit/design-system/ensure-design-token-usage */
/* eslint-disable @atlaskit/ui-styling-standard/use-compiled -- Ignored via go/DSP-18766 */
import { css } from '@emotion/react';
import type { SerializedStyles } from '@emotion/react';
import { N800 } from '@atlaskit/theme/colors';
import { token } from '@atlaskit/tokens';

// eslint-disable-next-line @atlaskit/ui-styling-standard/no-exported-styles -- Ignored via go/DSP-18766
export const content: SerializedStyles = css({
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors -- Ignored via go/DSP-18766
	'& div.toolsDrawer': {
		padding: `${token('space.100')} ${token('space.200')}`,
		background: N800,
		// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors -- Ignored via go/DSP-18766
		'& label': {
			display: 'flex',
			color: 'white',
			alignSelf: 'center',
			paddingRight: token('space.100'),
		},
		// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors -- Ignored via go/DSP-18766
		'& > div': {
			'/* padding': `${token('space.050')} 0`,
		},
		// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors -- Ignored via go/DSP-18766
		'& button': {
			margin: `${token('space.050')} 0`,
		},
	},
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors -- Ignored via go/DSP-18766
	'& legend': {
		margin: `${token('space.100')} 0`,
	},
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors -- Ignored via go/DSP-18766
	'& input': {
		fontSize: '13px',
	},
});
