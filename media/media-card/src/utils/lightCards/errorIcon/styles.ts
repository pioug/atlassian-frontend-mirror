import { token } from '@atlaskit/tokens';
import { css } from '@emotion/react';

// eslint-disable-next-line @atlaskit/ui-styling-standard/no-exported-styles, @atlaskit/design-system/no-exported-css -- Ignored via go/DSP-18766
export const errorIconWrapperStyles = css({
	display: 'flex',
	color: token('color.icon.warning', '#ff991f'),
});
