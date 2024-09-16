// eslint-disable-next-line @atlaskit/ui-styling-standard/use-compiled -- Ignored via go/DSP-18766
import { css } from '@emotion/react';

import { token } from '@atlaskit/tokens';

// eslint-disable-next-line @atlaskit/ui-styling-standard/no-exported-styles -- Ignored via go/DSP-18766
export const dropdown = css({
	display: 'flex',
	flexDirection: 'column',
	background: token('elevation.surface.overlay', 'white'),
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-imported-style-values, @atlaskit/ui-styling-standard/no-unsafe-values -- Ignored via go/DSP-18766
	borderRadius: token('border.radius', '3px'),
	boxShadow: token('elevation.shadow.overlay'),
	boxSizing: 'border-box',
	padding: `${token('space.050', '4px')} 0`,
});
