import { token } from '@atlaskit/tokens';

import { type Mode } from './types';

const defaultTheme: { mode: Mode } = {
	mode: {
		create: {
			active: {
				color: token('color.text.inverse'),
				backgroundColor: token('color.background.brand.bold.pressed'),
				boxShadow: '',
			},
			default: {
				color: token('color.text.inverse'),
				backgroundColor: token('color.background.brand.bold'),
				boxShadow: '',
			},
			focus: {
				color: token('color.text.inverse'),
				backgroundColor: '',
				boxShadow: '',
			},
			hover: {
				color: token('color.text.inverse'),
				backgroundColor: token('color.background.brand.bold.hovered'),
				boxShadow: '',
			},
			selected: { color: '', backgroundColor: '', boxShadow: '' },
		},
		iconButton: {
			active: {
				color: token('color.text.subtle'),
				backgroundColor: token('color.background.neutral.subtle.pressed'),
				boxShadow: '',
			},
			default: {
				color: token('color.text.subtle'),
				backgroundColor: 'transparent',
				boxShadow: '',
			},
			focus: {
				color: token('color.text.subtle'),
				backgroundColor: '',
				boxShadow: '',
			},
			hover: {
				color: token('color.text.subtle'),
				backgroundColor: token('color.background.neutral.subtle.hovered'),
				boxShadow: '',
			},
			selected: {
				color: token('color.text.selected'),
				backgroundColor: token('color.background.selected'),
				boxShadow: '',
			},
			selectedHover: {
				color: token('color.text.selected'),
				backgroundColor: token('color.background.selected.hovered'),
				boxShadow: '',
			},
		},
		navigation: {
			backgroundColor: token('elevation.surface'),
			color: token('color.text.subtlest'),
		},
		productHome: {
			backgroundColor: token('color.text.brand'),
			color: token('color.text'),
			borderRight: `${token('border.width')} solid ${token('color.border')}`,
			// TODO: replace with token after brand refresh
			iconColor: '#357DE8',
			textColor: token('color.text'),
		},
		primaryButton: {
			active: {
				color: token('color.text.subtle'),
				backgroundColor: token('color.background.neutral.subtle.pressed'),
				boxShadow: '',
			},
			default: {
				color: token('color.text.subtle'),
				backgroundColor: 'transparent',
				boxShadow: '',
			},
			focus: {
				color: token('color.text.subtle'),
				backgroundColor: '',
				boxShadow: '',
			},
			hover: {
				color: token('color.text.subtle'),
				backgroundColor: token('color.background.neutral.subtle.hovered'),
				boxShadow: '',
			},
			selected: {
				color: token('color.text.selected'),
				backgroundColor: token('color.background.selected'),
				boxShadow: '',
				borderColor: token('color.border.selected'),
			},
			selectedHover: {
				color: token('color.text.selected'),
				backgroundColor: token('color.background.selected.hovered'),
				boxShadow: '',
				borderColor: token('color.border.selected'),
			},
		},
		search: {
			default: {
				backgroundColor: token('color.background.input'),
				color: token('color.text.subtlest'),
				borderColor: token('color.border.input'),
			},
			focus: {
				borderColor: token('color.border.focused'),
			},
			hover: {
				backgroundColor: token('color.background.input.hovered'),
			},
		},
		skeleton: {
			backgroundColor: token('color.background.neutral'),
			opacity: 1,
		},
	},
};

// Create deep copy of defaultTheme
const defaultThemeCopy = JSON.parse(JSON.stringify(defaultTheme));

// Update iconColor and textColor in defaultThemeBrandRefresh
defaultThemeCopy.mode.productHome.iconColor = undefined;
defaultThemeCopy.mode.productHome.textColor = undefined;

export const defaultThemeBrandRefresh: any = defaultThemeCopy;

export const DEFAULT_THEME_NAME = 'atlassian';
export default defaultTheme;
