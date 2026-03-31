// eslint-disable-next-line @atlaskit/ui-styling-standard/use-compiled -- Ignored via go/DSP-18766
import { css, type SerializedStyles } from '@emotion/react';
import { token } from '@atlaskit/tokens';

// eslint-disable-next-line @atlaskit/design-system/ensure-design-token-usage, @atlaskit/ui-styling-standard/no-exported-styles -- Ignored via go/DSP-18766
export const optionsWrapperStyles: SerializedStyles = css({
	borderBottom: `${token('border.width', '1px')} solid ${token('color.border')}`,
	padding: '10px',
	margin: '10px auto',
});

// eslint-disable-next-line @atlaskit/ui-styling-standard/no-exported-styles -- Ignored via go/DSP-18766
export const mediaImageWrapperStyles: SerializedStyles = css({
	display: 'flex',
	justifyContent: 'center',
	alignItems: 'center',
});
