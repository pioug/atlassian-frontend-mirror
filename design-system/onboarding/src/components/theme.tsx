import { token } from '@atlaskit/tokens';

const spotlightTheme = {
	default: {
		background: {
			default: token('color.background.inverse.subtle'),
			hover: token('color.background.inverse.subtle.hovered'),
			active: token('color.background.inverse.subtle.pressed'),
			disabled: token('color.background.disabled'),
			selected: token('color.background.inverse.subtle.pressed'),
			focus: token('color.background.inverse.subtle'),
		},
		color: {
			default: token('color.text.inverse'),
			hover: token('color.text.inverse'),
			active: token('color.text.inverse'),
			disabled: {
				light: token('color.text.disabled'),
				dark: token('color.text.disabled'),
			},
			selected: token('color.text.inverse'),
			focus: token('color.text.inverse'),
		},
	},
	subtle: {
		background: {
			default: 'none',
			hover: token('color.background.inverse.subtle.hovered'),
			active: token('color.background.inverse.subtle.pressed'),
			disabled: 'none',
			selected: {
				light: token('color.background.selected.hovered'),
				dark: token('color.background.selected.hovered'),
			},
			focusSelected: {
				light: token('color.background.selected.hovered'),
				dark: token('color.background.selected.hovered'),
			},
		},
		color: {
			default: token('color.text.inverse'),
			hover: token('color.text.inverse'),
			active: token('color.text.inverse'),
			disabled: token('color.text.disabled'),
			selected: token('color.text.inverse'),
			focus: token('color.text.inverse'),
		},
	},
	'subtle-link': {
		textDecoration: {
			hover: `underline ${token('color.text.inverse')}`,
		},
		textDecorationLine: {
			active: 'none',
		},
		color: {
			default: token('color.text.inverse'),
			hover: token('color.text.inverse'),
			active: token('color.text.inverse'),
			disabled: token('color.text.discovery'),
			selected: token('color.text.selected'),
			focus: token('color.text.inverse'),
		},
	},
};

const modalTheme = {
	primary: {
		background: {
			default: token('color.background.discovery.bold'),
			hover: token('color.background.discovery.bold.hovered'),
			active: token('color.background.discovery.bold.pressed'),
			disabled: {
				light: token('color.background.disabled'),
				dark: token('color.background.disabled'),
			},
			selected: token('color.background.selected.hovered'),
			focus: token('color.background.discovery.bold.hovered'),
		},
		color: {
			default: token('color.text.inverse'),
			disabled: {
				light: token('color.text.disabled'),
				dark: token('color.text.disabled'),
			},
			selected: token('color.text.selected'),
			focus: token('color.text.inverse'),
		},
	},
};

function extract(newTheme: any, { mode, appearance, state }: Record<string, any>) {
	if (!newTheme[appearance]) {
		return undefined;
	}

	const root = newTheme[appearance];

	return Object.keys(root).reduce((acc: { [index: string]: string }, val) => {
		let node = root;
		[val, state, mode].forEach((item) => {
			if (!node[item]) {
				return undefined;
			}
			if (typeof node[item] !== 'object') {
				acc[val] = node[item];
				return undefined;
			}
			node = node[item];
			return undefined;
		});
		return acc;
	}, {});
}

/**
 * @deprecated
 * Custom button themes are deprecated and will be removed in the future.
 */
export const spotlightButtonTheme = (current: any, themeProps: Record<string, any>): any => {
	const { buttonStyles, ...rest } = current(themeProps);

	return {
		buttonStyles: {
			...buttonStyles,
			...extract(spotlightTheme, themeProps),
		},
		...rest,
	};
};

/**
 * @deprecated
 * Custom button themes are deprecated and will be removed in the future.
 */
export const modalButtonTheme = (current: any, themeProps: Record<string, any>): any => {
	const { buttonStyles, ...rest } = current(themeProps);
	return {
		buttonStyles: {
			...buttonStyles,
			...extract(modalTheme, themeProps),
		},
		...rest,
	};
};
