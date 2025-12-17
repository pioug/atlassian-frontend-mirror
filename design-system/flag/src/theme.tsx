import React, { type ReactElement } from 'react';

import ErrorIcon from '@atlaskit/icon/core/status-error';
import InformationIcon from '@atlaskit/icon/core/status-information';
import SuccessIcon from '@atlaskit/icon/core/status-success';
import WarningIcon from '@atlaskit/icon/core/status-warning';
import { type BackgroundColor } from '@atlaskit/primitives/compiled';
import { B400, N0, N30A, N500, N700, N800 } from '@atlaskit/theme/colors';
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
	error: (
		<ErrorIcon
			label=""
			LEGACY_primaryColor={token('color.icon.inverse', N0)}
			LEGACY_secondaryColor={token('color.background.danger.bold')}
		/>
	),
	info: (
		<InformationIcon
			label=""
			LEGACY_primaryColor={token('color.icon.inverse', N0)}
			LEGACY_secondaryColor={token('color.background.neutral.bold')}
		/>
	),
	normal: (
		<InformationIcon
			label=""
			LEGACY_primaryColor={token('color.icon.subtle', N500)}
			LEGACY_secondaryColor={token('elevation.surface.overlay')}
		/>
	),
	success: (
		<SuccessIcon
			label=""
			LEGACY_primaryColor={token('color.icon.inverse', N0)}
			LEGACY_secondaryColor={token('color.background.success.bold')}
		/>
	),
	warning: (
		<WarningIcon
			label=""
			LEGACY_primaryColor={token('color.icon.warning.inverse', N700)}
			LEGACY_secondaryColor={token('color.background.warning.bold')}
		/>
	),
};

export const flagTextColor: Record<AppearanceTypes, HeadingColor> = {
	error: 'color.text.inverse',
	info: 'color.text.inverse',
	normal: 'color.text',
	success: 'color.text.inverse',
	warning: 'color.text.warning.inverse',
};

export const flagTextColorToken = {
	error: token('color.text.inverse', N0),
	info: token('color.text.inverse', N0),
	normal: token('color.text', N800),
	success: token('color.text.inverse', N0),
	warning: token('color.text.warning.inverse', N700),
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
		default: token('color.background.inverse.subtle', N30A),
		active: token('color.background.inverse.subtle.pressed', N30A),
		pressed: token('color.background.inverse.subtle.hovered', N30A),
	},
	info: {
		default: token('color.background.inverse.subtle', N30A),
		active: token('color.background.inverse.subtle.pressed', N30A),
		pressed: token('color.background.inverse.subtle.hovered', N30A),
	},
	error: {
		default: token('color.background.inverse.subtle', N30A),
		active: token('color.background.inverse.subtle.pressed', N30A),
		pressed: token('color.background.inverse.subtle.hovered', N30A),
	},
	warning: {
		default: token('color.background.inverse.subtle', N30A),
		active: token('color.background.inverse.subtle.pressed', N30A),
		pressed: token('color.background.inverse.subtle.hovered', N30A),
	},
	normal: {
		default: 'none',
		active: 'none',
		pressed: 'none',
	},
};

export const actionTextColor: Record<AppearanceTypes, string> = {
	success: token('color.text.inverse', N0),
	info: token('color.text.inverse', N0),
	error: token('color.text.inverse', N0),
	warning: token('color.text.warning.inverse', N700),
	normal: token('color.link', B400),
};
