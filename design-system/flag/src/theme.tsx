import React, { type ReactElement } from 'react';

import ErrorIcon from '@atlaskit/icon/core/status-error';
import InformationIcon from '@atlaskit/icon/core/status-information';
import SuccessIcon from '@atlaskit/icon/core/status-success';
import WarningIcon from '@atlaskit/icon/core/status-warning';
import { type BackgroundColor } from '@atlaskit/primitives/compiled';
import { token } from '@atlaskit/tokens';

import { type AppearanceTypes, type HeadingColor } from './types';

export const flagBackgroundColor: Record<AppearanceTypes, BackgroundColor> = {
	error: 'color.background.danger.bold',
	info: 'color.background.neutral.bold',
	normal: 'elevation.surface.overlay',
	success: 'color.background.success.bold',
	warning: 'color.background.warning.bold',
};

export const flagIconColor: Record<AppearanceTypes, string> = {
	error: token('color.icon.inverse'),
	info: token('color.icon.inverse'),
	normal: token('color.icon.subtle'),
	success: token('color.icon.inverse'),
	warning: token('color.icon.warning.inverse'),
};

export const flagIconGlyph: Record<AppearanceTypes, ReactElement> = {
	error: <ErrorIcon label="" />,
	info: <InformationIcon label="" />,
	normal: <InformationIcon label="" />,
	success: <SuccessIcon label="" />,
	warning: <WarningIcon label="" />,
};

export const flagTextColor: Record<AppearanceTypes, HeadingColor> = {
	error: 'color.text.inverse',
	info: 'color.text.inverse',
	normal: 'color.text',
	success: 'color.text.inverse',
	warning: 'color.text.warning.inverse',
};

export const flagTextColorToken: {
	error: 'var(--ds-text-inverse)';
	info: 'var(--ds-text-inverse)';
	normal: 'var(--ds-text)';
	success: 'var(--ds-text-inverse)';
	warning: 'var(--ds-text-warning-inverse)';
} = {
	error: token('color.text.inverse'),
	info: token('color.text.inverse'),
	normal: token('color.text'),
	success: token('color.text.inverse'),
	warning: token('color.text.warning.inverse'),
};

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

export const actionTextColor: Record<AppearanceTypes, string> = {
	success: token('color.text.inverse'),
	info: token('color.text.inverse'),
	error: token('color.text.inverse'),
	warning: token('color.text.warning.inverse'),
	normal: token('color.link'),
};
