/** @jsx jsx */
import { css } from '@emotion/react';

import { headingsSharedStyles } from '@atlaskit/editor-common/styles';
import { shortcutStyle } from '@atlaskit/editor-shared-styles/shortcut';
import { N400 } from '@atlaskit/theme/colors';
import { token } from '@atlaskit/tokens';

export const blockTypeMenuItemStyle = (tagName: string, selected?: boolean) => {
	// TEMP FIX: See https://product-fabric.atlassian.net/browse/ED-13878
	const selectedStyle = selected
		? `${tagName} { color: ${token('color.text', 'white')} !important; }`
		: '';

	return () =>
		css(
			headingsSharedStyles(),
			{
				'>': {
					'h1, h2, h3, h4, h5, h6': {
						marginTop: 0,
					},
				},
			},
			selectedStyle,
		);
};

export const keyboardShortcut = css(shortcutStyle, {
	marginLeft: token('space.200', '16px'),
});

export const keyboardShortcutSelect = css({
	color: token('color.icon', N400),
});

export const buttonContentStyle = css({
	display: 'flex',
	minWidth: '80px',
	alignItems: 'center',
	overflow: 'hidden',
	justifyContent: 'center',
	flexDirection: 'column',
	padding: token('space.075', '6px'),
});

export const buttonContentReducedSpacingStyle = css({
	padding: token('space.100', '8px'),
});

export const wrapperSmallStyle = css({
	marginLeft: token('space.050', '4px'),
	minWidth: '40px',
});

export const expandIconWrapperStyle = css({
	marginLeft: token('space.negative.100', '-8px'),
});
