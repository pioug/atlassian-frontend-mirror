// eslint-disable-next-line @atlaskit/ui-styling-standard/use-compiled -- Ignored via go/DSP-18766
import { css, type SerializedStyles } from '@emotion/react';
import { token } from '@atlaskit/tokens';

// eslint-disable-next-line @atlaskit/ui-styling-standard/no-exported-styles -- Ignored via go/DSP-18766
export const hrStyles: SerializedStyles = css({
	background: token('color.border'),
	border: 0,
	height: '2px',
	marginBottom: '3em',
	marginTop: '3em',
});
