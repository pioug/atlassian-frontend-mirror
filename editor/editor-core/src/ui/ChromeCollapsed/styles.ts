import { css } from '@emotion/react';

import { akEditorSubtleAccent, relativeFontSizeToBase16 } from '@atlaskit/editor-shared-styles';
import { N300, N50 } from '@atlaskit/theme/colors';
import { borderRadius } from '@atlaskit/theme/constants';
import { token } from '@atlaskit/tokens';

export const inputStyle = css({
	'input&': {
		backgroundColor: token('color.background.input', 'white'),
		border: `1px solid ${token('color.border.input', akEditorSubtleAccent)}`,
		borderRadius: `${borderRadius()}px`,
		boxSizing: 'border-box',
		height: '40px',
		paddingLeft: token('space.250', '20px'),
		paddingTop: token('space.150', '12px'),
		paddingBottom: token('space.150', '12px'),
		fontSize: relativeFontSizeToBase16(14),
		width: '100%',
		fontWeight: 400,
		lineHeight: 1.42857142857143,
		letterSpacing: '-0.005em',
		color: token('color.text.subtlest', N300),
		'&:hover': {
			backgroundColor: token('color.background.input.hovered', 'white'),
			borderColor: token('color.border.input', N50),
			cursor: 'text',
		},
	},
});
