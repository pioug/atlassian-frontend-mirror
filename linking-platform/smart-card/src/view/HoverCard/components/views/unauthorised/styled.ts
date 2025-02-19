// eslint-disable-next-line @atlaskit/ui-styling-standard/use-compiled -- Ignored via go/DSP-18766
import { css } from '@emotion/react';

import { token } from '@atlaskit/tokens';

const blockGap = '0.5rem';
const iconGap = '0.5rem';

/**
 * @deprecated remove on FF clean up bandicoots-compiled-migration-smartcard
 */
// eslint-disable-next-line @atlaskit/ui-styling-standard/no-exported-styles -- Ignored via go/DSP-18766
export const connectButtonStyles = css({
	justifyContent: 'flex-end',
	marginTop: blockGap,
});

/**
 * @deprecated remove on FF clean up bandicoots-compiled-migration-smartcard
 */
// eslint-disable-next-line @atlaskit/ui-styling-standard/no-exported-styles -- Ignored via go/DSP-18766
export const titleBlockStyles = css({
	gap: `${blockGap} ${iconGap}`,
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors -- Ignored via go/DSP-18766
	a: {
		fontWeight: token('font.weight.medium'),
	},
});

/**
 * @deprecated remove on FF clean up bandicoots-compiled-migration-smartcard
 */
// eslint-disable-next-line @atlaskit/ui-styling-standard/no-exported-styles -- Ignored via go/DSP-18766
export const mainTextStyles = css({
	marginTop: blockGap,
	font: token('font.body.UNSAFE_small'),
});
