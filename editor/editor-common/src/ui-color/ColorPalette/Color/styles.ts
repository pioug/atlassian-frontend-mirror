// eslint-disable-next-line @atlaskit/ui-styling-standard/use-compiled -- Ignored via go/DSP-18766
import { css, type SerializedStyles } from '@emotion/react';

import { token } from '@atlaskit/tokens';

/** this is not new usage - old code extracted from editor-core */
/* eslint-disable @atlaskit/design-system/ensure-design-token-usage */
// eslint-disable-next-line @atlaskit/ui-styling-standard/no-exported-styles -- Ignored via go/DSP-18766
export const buttonStyle: SerializedStyles = css({
	height: '26px',
	width: '26px',
	background: token('color.background.neutral'),
	padding: 0,
	borderRadius: '4px',
	border: `1px solid ${token('color.border.inverse')}`,
	cursor: 'pointer',
	display: 'block',
});
/* eslint-enable @atlaskit/design-system/ensure-design-token-usage */

/** this is not new usage - old code extracted from editor-core */
/* eslint-disable @atlaskit/design-system/ensure-design-token-usage */
// eslint-disable-next-line @atlaskit/ui-styling-standard/no-exported-styles -- Ignored via go/DSP-18766
export const buttonWrapperStyle: SerializedStyles = css({
	border: '1px solid transparent',
	// eslint-disable-next-line @atlaskit/design-system/use-tokens-typography
	fontSize: 0,
	display: 'flex',
	alignItems: 'center',
	padding: token('space.025', '2px'),
	borderRadius: token('radius.medium'),
	'&:focus-within, &:focus, &:hover': {
		// eslint-disable-next-line @atlaskit/ui-styling-standard/no-important-styles -- Ignored via go/DSP-18766
		borderColor: `${token('color.border')} !important`,
	},
});
/* eslint-enable @atlaskit/design-system/ensure-design-token-usage */
