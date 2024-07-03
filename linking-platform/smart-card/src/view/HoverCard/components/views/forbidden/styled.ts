import { token } from '@atlaskit/tokens';
// eslint-disable-next-line @atlaskit/ui-styling-standard/use-compiled -- Ignored via go/DSP-18766
import { css } from '@emotion/react';

const titleFontWeight = '600';

// eslint-disable-next-line @atlaskit/ui-styling-standard/no-exported-styles -- Ignored via go/DSP-18766
export const titleBlockStyles = css({
	justifyContent: 'center',
	fontWeight: titleFontWeight,
	marginTop: token('space.100', '8px'),
});

// eslint-disable-next-line @atlaskit/ui-styling-standard/no-exported-styles -- Ignored via go/DSP-18766
export const mainTextStyles = css({
	display: 'inline',
	justifyContent: 'center',
	marginTop: token('space.0', '0px'),
	fontSize: '0.75rem',
	textAlign: 'center',
});

// eslint-disable-next-line @atlaskit/ui-styling-standard/no-exported-styles -- Ignored via go/DSP-18766
export const connectButtonStyles = css({
	justifyContent: 'center',
	marginTop: token('space.100', '8px'),
});
