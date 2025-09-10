// eslint-disable-next-line @atlaskit/ui-styling-standard/use-compiled -- Ignored via go/DSP-18766
import { css, type SerializedStyles } from '@emotion/react';

import { token } from '@atlaskit/tokens';

// eslint-disable-next-line @atlaskit/ui-styling-standard/no-exported-styles -- Ignored via go/DSP-18766
export const triggerWrapper: SerializedStyles = css({
	width: '42px',
	display: 'flex',
	alignItems: 'center',
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors -- Ignored via go/DSP-18766
	'> div, > span': {
		display: 'flex',
	},
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors -- Ignored via go/DSP-18766
	'> div > div': {
		display: 'flex',
	},
});

// eslint-disable-next-line @atlaskit/ui-styling-standard/no-exported-styles -- Ignored via go/DSP-18766
export const expandWrapperStyle: SerializedStyles = css({
	marginLeft: token('space.050', '4px'),
});
