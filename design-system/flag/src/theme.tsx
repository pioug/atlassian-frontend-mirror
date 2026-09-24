import { token } from '@atlaskit/tokens';

import { type AppearanceTypes } from './types';

type ActionBackgroundColor = Record<
	Exclude<AppearanceTypes, 'normal'>,
	{
		default: 'var(--ds-background-inverse-subtle)';
		active: 'var(--ds-background-inverse-subtle-pressed)';
		pressed: 'var(--ds-background-inverse-subtle-hovered)';
	}
> &
	Record<
		Extract<AppearanceTypes, 'normal'>,
		{
			default: 'none';
			active: 'none';
			pressed: 'none';
		}
	>;

// TODO: DSP-2519 Interaction tokens should be used for hovered and pressed states
// https://product-fabric.atlassian.net/browse/DSP-2519
export const actionBackgroundColor: ActionBackgroundColor = {
	success: {
		default: token('color.background.inverse.subtle'),
		active: token('color.background.inverse.subtle.pressed'),
		pressed: token('color.background.inverse.subtle.hovered'),
	},
	info: {
		default: token('color.background.inverse.subtle'),
		active: token('color.background.inverse.subtle.pressed'),
		pressed: token('color.background.inverse.subtle.hovered'),
	},
	error: {
		default: token('color.background.inverse.subtle'),
		active: token('color.background.inverse.subtle.pressed'),
		pressed: token('color.background.inverse.subtle.hovered'),
	},
	warning: {
		default: token('color.background.inverse.subtle'),
		active: token('color.background.inverse.subtle.pressed'),
		pressed: token('color.background.inverse.subtle.hovered'),
	},
	normal: {
		default: 'none',
		active: 'none',
		pressed: 'none',
	},
};
