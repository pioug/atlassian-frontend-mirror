// eslint-disable-next-line @atlaskit/ui-styling-standard/use-compiled -- Ignored via go/DSP-18766
import { css } from '@emotion/react';

import { token } from '@atlaskit/tokens';

// eslint-disable-next-line @atlaskit/ui-styling-standard/no-exported-styles -- Ignored via go/DSP-18766
export const alignmentWrapper = css({
	padding: `0 ${token('space.100', '8px')}`,
	maxWidth: `${3 * 32 + 2 * 2}px`, // 3 buttons * 32px + 2 * 2px gap
	columnGap: token('space.025'), // add gap between buttons, so they don't crunch each other
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors
	button: {
		// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors, @atlaskit/ui-styling-standard/no-unsafe-selectors
		'&:not([disabled])::after': {
			border: 'none', // remove blue border when an item has been selected
		},
	},
});
