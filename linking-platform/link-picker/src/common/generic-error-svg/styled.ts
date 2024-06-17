// eslint-disable-next-line @atlaskit/ui-styling-standard/use-compiled -- Ignored via go/DSP-18766
import { css } from '@emotion/react';

import { token } from '@atlaskit/tokens';

const HEIGHT = 90;

// eslint-disable-next-line @atlaskit/ui-styling-standard/no-exported-styles, @atlaskit/design-system/no-exported-css -- Ignored via go/DSP-18766
export const genericErrorStyles = css({
	height: `${HEIGHT}px`,
	margin: `0 auto ${token('space.300', '24px')}`,
	display: 'block',
});
