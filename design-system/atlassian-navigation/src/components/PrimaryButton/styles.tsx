import type { ThemeProps, ThemeTokens } from '@atlaskit/button/custom-theme-button-types';
import { token } from '@atlaskit/tokens';

import { type NavigationTheme } from '../../theme';

export const getPrimaryButtonTheme =
	({ mode: { primaryButton } }: NavigationTheme) =>
	(current: (props: ThemeProps) => ThemeTokens, props: ThemeProps): ThemeTokens => {
		const { buttonStyles, spinnerStyles } = current(props);

		return {
			buttonStyles: {
				...buttonStyles,
				...primaryButton.default,
				...(props.isSelected && primaryButton.selected),
				fontWeight: token('font.weight.medium'),
				padding: `0 ${token('space.050')}`,
				marginLeft: 0,
				marginRight: 0,
				':hover': props.isSelected ? primaryButton.selectedHover : primaryButton.hover,
				':focus': primaryButton.focus,
				// :active doesn't work in FF, because we do a
				// e.preventDefault() on mouse down in Button.
				// '&&' is required to add more CSS specificity
				// && it not a valid CSSObject property
				'&&': {
					...(props.state === 'active' && primaryButton.active),
				},
			},
			spinnerStyles,
		};
	};
