// eslint-disable-next-line @atlaskit/ui-styling-standard/use-compiled -- Ignored via go/DSP-18766
import { css } from '@emotion/react';

import { token } from '@atlaskit/tokens';

// eslint-disable-next-line @atlaskit/ui-styling-standard/no-exported-styles -- Ignored via go/DSP-18766
export const alignmentWrapper = css({
	padding: `0 ${token('space.100', '8px')}`,
	display: 'flex',
	flexWrap: 'wrap',
	maxWidth: `${3 * 32}px`,
});
