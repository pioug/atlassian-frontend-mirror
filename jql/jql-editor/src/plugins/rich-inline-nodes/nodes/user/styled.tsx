import { css } from '@emotion/react';
import styled from '@emotion/styled';

import { N0, N40, N50, N500, R400 } from '@atlaskit/theme/colors';
import { token } from '@atlaskit/tokens';

// eslint-disable-next-line @atlaskit/ui-styling-standard/no-styled -- To migrate as part of go/ui-styling-standard
export const UserContainer = styled.span<{ selected: boolean; error: boolean }>(
	{
		display: 'inline-flex',
		alignItems: 'baseline',
		paddingLeft: `${token('space.025', '2px')}`,
		borderRadius: '10px',
		cursor: 'pointer',
		userSelect: 'none',
	},
	({ selected, error }) => {
		if (selected) {
			if (error) {
				return css({
					color: token('color.text.inverse', N0),
					backgroundColor: token('color.background.danger.bold', R400),
					textDecoration: 'wavy underline',
					textDecorationThickness: '1px',
					textDecorationSkipInk: 'none',
					textDecorationColor: token('color.text.inverse', N0),
				});
			} else {
				return css({
					color: token('color.text', N0),
					backgroundColor: token('color.background.selected', N500),
					boxShadow: `0 0 0 1px ${token('color.border.selected', 'transparent')}`,
				});
			}
		} else {
			if (error) {
				return css({
					color: token('color.text.subtle', N500),
					backgroundColor: token('color.background.neutral', N40),
					textDecoration: 'wavy underline',
					textDecorationThickness: '1px',
					textDecorationSkipInk: 'none',
					textDecorationColor: token('color.text.danger', R400),
					'&:hover': {
						backgroundColor: token('color.background.neutral.hovered', N50),
					},
				});
			} else {
				return css({
					color: token('color.text.subtle', N500),
					backgroundColor: token('color.background.neutral', N40),
					'&:hover': {
						backgroundColor: token('color.background.neutral.hovered', N50),
					},
				});
			}
		}
	},
);

// eslint-disable-next-line @atlaskit/ui-styling-standard/no-styled -- To migrate as part of go/ui-styling-standard
export const NameContainer = styled.span({
	marginLeft: token('space.075', '6px'),
	marginRight: token('space.100', '8px'),
	lineHeight: token('space.250', '20px'),
});

/* Override Avatar styles to match design spec */
// eslint-disable-next-line @atlaskit/design-system/ensure-design-token-usage, @atlaskit/ui-styling-standard/no-styled -- To migrate as part of go/ui-styling-standard
export const AvatarWrapper = styled.div({
	height: token('space.200', '16px'),
	width: token('space.200', '16px'),
	alignSelf: 'center',
	'> div span': {
		margin: token('space.0', '0px'),
	},
});
