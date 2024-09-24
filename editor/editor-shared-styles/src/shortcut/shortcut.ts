// eslint-disable-next-line @atlaskit/ui-styling-standard/use-compiled -- Ignored via go/DSP-18766
import { css } from '@emotion/react';

import { token } from '@atlaskit/tokens';

import { akEditorMobileMaxWidth, relativeFontSizeToBase16 } from '../consts';

// eslint-disable-next-line @atlaskit/design-system/no-css-tagged-template-expression, @atlaskit/ui-styling-standard/no-exported-styles -- Ignored via go/DSP-18766
export const shortcutStyle = css`
	background-color: ${token('color.background.neutral')};
	color: ${token('color.text.subtle')};
	border-radius: ${token('border.radius', '3px')};
	padding: ${token('space.050', '4px')};
	line-height: 12px;
	font-size: ${relativeFontSizeToBase16(11.67)};
	align-self: flex-end;
	@media (max-width: ${akEditorMobileMaxWidth}px) {
		display: none;
	}
`;
