import { css } from '@emotion/react';

import { N100 } from '@atlaskit/theme/colors';
import { borderRadius } from '@atlaskit/theme/constants';
import { token } from '@atlaskit/tokens';

import { akEditorMobileMaxWidth, relativeFontSizeToBase16 } from '../consts';

// eslint-disable-next-line @atlaskit/design-system/no-css-tagged-template-expression -- needs manual remediation
export const shortcutStyle = css`
	background-color: ${token(
		'color.background.neutral',
		'rgba(223, 225, 229, 0.5)',
	)}; /* N60 at 50% */
	color: ${token('color.text.subtle', N100)};
	border-radius: ${borderRadius()}px;
	padding: ${token('space.050', '4px')};
	line-height: 12px;
	font-size: ${relativeFontSizeToBase16(11.67)};
	align-self: flex-end;
	@media (max-width: ${akEditorMobileMaxWidth}px) {
		display: none;
	}
`;
