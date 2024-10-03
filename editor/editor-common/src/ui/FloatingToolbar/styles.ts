import { token } from '@atlaskit/tokens';

export const iconOnlySpacing = {
	'&&': {
		padding: '0px',
		/**
      Increased specificity here because css for .hyperlink-open-link defined in
      packages/editor/editor-core/src/ui/ContentStyles/index.tsx file
      overrides padding left-right 2px with 4px.
    */
		'&&[href]': {
			padding: '0 2px',
		},
	},
	'& > span': {
		margin: '0px',
	},
};

interface Property {
	[key: string]: {
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

const background: Property = {
	danger: {
		default: { light: 'inherit', dark: 'inherit' },
		hover: {
			light: token('color.background.neutral.subtle.hovered'),
			dark: token('color.background.neutral.subtle.hovered'),
		},
		active: {
			light: token('color.background.neutral.pressed'),
			dark: token('color.background.neutral.pressed'),
		},
	},
};

const color = {
	danger: {
		default: {
			light: token('color.icon'),
			dark: token('color.icon'),
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

export const getButtonStyles = (props: any) => ({
	background: getStyles(background, props),
	color: getStyles(color, props),
});
