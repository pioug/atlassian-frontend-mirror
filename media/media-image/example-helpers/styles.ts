// eslint-disable-next-line @atlaskit/ui-styling-standard/use-compiled -- Ignored via go/DSP-18766
import { css } from '@emotion/react';
import { token } from '@atlaskit/tokens';
import { N40 } from '@atlaskit/theme/colors';

// eslint-disable-next-line @atlaskit/design-system/ensure-design-token-usage, @atlaskit/ui-styling-standard/no-exported-styles -- Ignored via go/DSP-18766
export const optionsWrapperStyles = css({
	borderBottom: `1px solid ${token('color.border', N40)}`,
	padding: '10px',
	margin: '10px auto',
});

// eslint-disable-next-line @atlaskit/ui-styling-standard/no-exported-styles -- Ignored via go/DSP-18766
export const mediaImageWrapperStyles = css({
	display: 'flex',
	justifyContent: 'center',
	alignItems: 'center',
});
