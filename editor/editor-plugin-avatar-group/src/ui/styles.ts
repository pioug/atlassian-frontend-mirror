/* eslint-disable @repo/internal/styles/no-exported-styles, @atlaskit/design-system/no-nested-styles */
import { css } from '@emotion/react';

import { akEditorSmallZIndex, relativeFontSizeToBase16 } from '@atlaskit/editor-shared-styles';
import { N20 } from '@atlaskit/theme/colors';
import { token } from '@atlaskit/tokens';

export const inviteTeamWrapperStyles = css({
	background: token('color.background.neutral', N20),
	borderRadius: '50%',
	minWidth: token('space.400', '32px'),
	marginLeft: token('space.negative.050', '-4px'),
});

export const avatarContainerStyles = css({
	marginRight: token('space.100', '8px'),
	display: 'flex',
	alignItems: 'center',
	'&& > ul': {
		listStyleType: 'none',
	},
	'div:last-child button.invite-to-edit': {
		borderRadius: '50%',
		height: '32px',
		width: '32px',
		padding: token('space.025', '2px'),
	},
});

export const badge = (color: string) =>
	css({
		display: 'block',
		position: 'absolute',
		right: token('space.025', '2px'),
		bottom: token('space.025', '2px'),
		width: token('space.150', '12px'),
		height: token('space.150', '12px'),
		zIndex: akEditorSmallZIndex,
		borderRadius: '3px',
		background: color,
		color: token('color.text.inverse', '#fff'),
		fontSize: relativeFontSizeToBase16(9),
		lineHeight: 0,
		paddingTop: token('space.075', '6px'),
		textAlign: 'center',
		boxShadow: `0 0 1px ${token('color.border.inverse', '#fff')}`,
		boxSizing: 'border-box',
	});
