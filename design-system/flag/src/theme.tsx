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

/* eslint-disable-next-line @repo/internal/deprecations/deprecation-ticket-required -- VOLTC-139 tracks removal of these deprecated re-export shims. */
/**
 * @deprecated Use `import { flagBackgroundColor } from '@atlaskit/flag/flag-background-color'` instead.
 */
export { flagBackgroundColor } from './flag-background-color';
/* eslint-disable-next-line @repo/internal/deprecations/deprecation-ticket-required -- VOLTC-139 tracks removal of these deprecated re-export shims. */
/**
 * @deprecated Use `import { flagIconColor } from '@atlaskit/flag/flag-icon-color'` instead.
 */
export { flagIconColor } from './flag-icon-color';
/* eslint-disable-next-line @repo/internal/deprecations/deprecation-ticket-required -- VOLTC-139 tracks removal of these deprecated re-export shims. */
/**
 * @deprecated Use `import { flagIconGlyph } from '@atlaskit/flag/flag-icon-glyph'` instead.
 */
export { flagIconGlyph } from './flag-icon-glyph';
/* eslint-disable-next-line @repo/internal/deprecations/deprecation-ticket-required -- VOLTC-139 tracks removal of these deprecated re-export shims. */
/**
 * @deprecated Use `import { flagTextColor } from '@atlaskit/flag/flag-text-color'` instead.
 */
export { flagTextColor } from './flag-text-color';
/* eslint-disable-next-line @repo/internal/deprecations/deprecation-ticket-required -- VOLTC-139 tracks removal of these deprecated re-export shims. */
/**
 * @deprecated Use `import { flagTextColorToken } from '@atlaskit/flag/flag-text-color-token'` instead.
 */
export { flagTextColorToken } from './flag-text-color-token';
/* eslint-disable-next-line @repo/internal/deprecations/deprecation-ticket-required -- VOLTC-139 tracks removal of these deprecated re-export shims. */
/**
 * @deprecated Use `import { actionTextColor } from '@atlaskit/flag/action-text-color'` instead.
 */
export { actionTextColor } from './action-text-color';
