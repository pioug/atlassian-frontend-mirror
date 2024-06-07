import { css } from '@emotion/react';
import { token } from '@atlaskit/tokens';
import { B200, B100 } from '@atlaskit/theme/colors';

export const avatarImageStyles = css({
	borderRadius: token('border.radius.100', '3px'),
	cursor: 'pointer',
});

export const visuallyHiddenRadioStyles = css({
	width: '1px',
	height: '1px',
	padding: 0,
	position: 'fixed',
	border: 0,
	clip: 'rect(1px, 1px, 1px, 1px)',
	overflow: 'hidden',
	whiteSpace: 'nowrap',
});

export const selectedShadow = css({
	boxShadow: `0px 0px 0px 1px ${token(
		'color.border.inverse',
		'white',
	)}, 0px 0px 0px 3px ${token('color.border.selected', B200)}`,
});

export const focusedShadow = css({
	boxShadow: `0px 0px 0px 1px ${token(
		'color.border.inverse',
		'white',
	)}, 0px 0px 0px 3px ${token('color.border.focused', B100)}`,
});
