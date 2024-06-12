import { type ThemeProps, type ThemeTokens } from '@atlaskit/button/types';
import { token } from '@atlaskit/tokens';

import { type NavigationTheme } from '../../theme';

export const getCreateButtonTheme =
	({ mode: { create } }: NavigationTheme) =>
	(current: (props: ThemeProps) => ThemeTokens, props: ThemeProps): ThemeTokens => {
		const { buttonStyles, spinnerStyles } = current(props);
		return {
			buttonStyles: {
				...buttonStyles,
				...create.default,
				margin: 0,
				fontWeight: token('font.weight.medium'),
				':hover': create.hover,
				':focus': create.focus,
				// :active doesn't work in FF, becasue we do a
				// e.preventDefault() on mouse down in Button.
				// '&&' is required to add more CSS specificity
				// && it not a valid CSSObject property
				// @ts-ignore
				'&&': {
					...(props.state === 'active' && create.active),
				},
			},
			spinnerStyles,
		};
	};
