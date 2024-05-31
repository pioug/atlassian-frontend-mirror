import { css } from '@emotion/react';

import { N0, N50, N900 } from '@atlaskit/theme/colors';
import { token } from '@atlaskit/tokens';

/** this is not new usage - old code extracted from editor-core */
/* eslint-disable @atlaskit/design-system/ensure-design-token-usage */
export const buttonStyle = css({
	height: '26px',
	width: '26px',
	background: token('color.background.neutral', N900),
	padding: 0,
	borderRadius: '4px',
	border: `1px solid ${token('color.border.inverse', N0)}`,
	cursor: 'pointer',
	display: 'block',
});
/* eslint-enable @atlaskit/design-system/ensure-design-token-usage */

/** this is not new usage - old code extracted from editor-core */
/* eslint-disable @atlaskit/design-system/ensure-design-token-usage */
export const buttonWrapperStyle = css({
	border: '1px solid transparent',
	fontSize: 0,
	display: 'flex',
	alignItems: 'center',
	padding: token('space.025', '2px'),
	borderRadius: '6px',
	'&:focus-within, &:focus, &:hover': {
		borderColor: `${token('color.border', N50)} !important`,
	},
});
/* eslint-enable @atlaskit/design-system/ensure-design-token-usage */
