// eslint-disable-next-line @atlaskit/ui-styling-standard/use-compiled -- Ignored via go/DSP-18766
import { css } from '@emotion/react';

const blockGap = '0.5rem';
const iconGap = '0.5rem';
const titleFontWeight = '500';

// eslint-disable-next-line @atlaskit/ui-styling-standard/no-exported-styles -- Ignored via go/DSP-18766
export const connectButtonStyles = css({
	justifyContent: 'flex-end',
	marginTop: blockGap,
});

// eslint-disable-next-line @atlaskit/ui-styling-standard/no-exported-styles -- Ignored via go/DSP-18766
export const titleBlockStyles = css({
	gap: `${blockGap} ${iconGap}`,
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors -- Ignored via go/DSP-18766
	a: {
		fontWeight: titleFontWeight,
	},
});

// eslint-disable-next-line @atlaskit/ui-styling-standard/no-exported-styles -- Ignored via go/DSP-18766
export const mainTextStyles = css({
	marginTop: blockGap,
	fontSize: '0.75rem',
});
