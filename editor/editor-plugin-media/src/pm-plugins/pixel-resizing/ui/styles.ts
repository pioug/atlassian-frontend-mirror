// eslint-disable-next-line @atlaskit/ui-styling-standard/use-compiled -- Ignored via go/DSP-18766
import { css, type SerializedStyles } from '@emotion/react';

import { token } from '@atlaskit/tokens';

const PIXEL_SIZING_WRAPPER_MINIMUM_WIDTH = 120;

// eslint-disable-next-line @atlaskit/ui-styling-standard/no-exported-styles -- Ignored via go/DSP-18766
export const pixelSizingFullWidthLabelStyles: SerializedStyles = css({
	minWidth: `${PIXEL_SIZING_WRAPPER_MINIMUM_WIDTH}px`,
	height: token('space.300'),
	display: 'flex',
	justifyContent: 'center',
	alignItems: 'center',
});
