import { token } from '@atlaskit/tokens';

export const iconOnlySpacing = {
	'&&': {
		padding: '0px',
	},
	'& > span': {
		margin: '0px',
	},
};

interface Property {
	[key: string]: {
		// Ignored via go/ees005
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		[key: string]: any;
	};
}

const getStyles = (
	property: Property,
	{ appearance = 'default', state = 'default', mode = 'light' },
) => {
	if (!property[appearance] || !property[appearance][state]) {
		return 'initial';
	}
	return property[appearance][state][mode];
};

const backgroundVisualRefresh: Property = {
	danger: {
		default: { light: 'inherit', dark: 'inherit' },
		hover: {
			light: token('color.background.danger.hovered'),
			dark: token('color.background.danger.hovered'),
		},
		active: {
			light: token('color.background.danger.pressed'),
			dark: token('color.background.danger.pressed'),
		},
	},
};

const colorVisualRefresh = {
	danger: {
		default: {
			light: token('color.icon.subtle'),
			dark: token('color.icon.subtle'),
		},
		hover: {
			light: token('color.icon.danger'),
			dark: token('color.icon.danger'),
		},
		active: {
			light: token('color.icon.danger'),
			dark: token('color.icon.danger'),
		},
	},
};

// Ignored via go/ees005
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const getButtonStyles = (
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	props: any,
): {
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	background: any;
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	color: any;
} => ({
	background: getStyles(backgroundVisualRefresh, props),
	color: getStyles(colorVisualRefresh, props),
});
