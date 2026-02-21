import React, { type ComponentType } from 'react';

import StatusDiscoveryIcon from '@atlaskit/icon/core/status-discovery';
import ErrorIcon from '@atlaskit/icon/core/status-error';
import InfoIcon from '@atlaskit/icon/core/status-information';
import SuccessIcon from '@atlaskit/icon/core/status-success';
import WarningIcon from '@atlaskit/icon/core/status-warning';
import { B50, B500, G50, G500, P50, P500, R50, R500, Y50, Y500 } from '@atlaskit/theme/colors';
import { token } from '@atlaskit/tokens';

import type { Appearance, SectionMessageProps } from '../types';

interface AppearanceIconSchema {
	backgroundColor: string;
	primaryIconColor: string;
	Icon: ComponentType<any>;
	LegacyFallbackIcon?: ComponentType<any>;
}

const appearanceIconSchema: {
	[key in Appearance]: AppearanceIconSchema;
} = {
	information: {
		backgroundColor: token('color.background.information', B50),
		Icon: InfoIcon,
		primaryIconColor: token('color.icon.information', B500),
	},
	warning: {
		backgroundColor: token('color.background.warning', Y50),
		Icon: WarningIcon,
		primaryIconColor: token('color.icon.warning', Y500),
	},
	error: {
		backgroundColor: token('color.background.danger', R50),
		Icon: ErrorIcon,
		primaryIconColor: token('color.icon.danger', R500),
	},
	success: {
		backgroundColor: token('color.background.success', G50),
		Icon: SuccessIcon,
		primaryIconColor: token('color.icon.success', G500),
	},
	discovery: {
		backgroundColor: token('color.background.discovery', P50),
		Icon: StatusDiscoveryIcon,
		primaryIconColor: token('color.icon.discovery', P500),
	},
};

export function getAppearanceIconStyles(
	appearance: Appearance,
	icon: SectionMessageProps['icon'],
): {
	Icon:
		| React.ElementType<any, keyof React.JSX.IntrinsicElements>
		| (({ primaryColor }: { primaryColor: string }) => React.JSX.Element);
	backgroundColor: string;
	primaryIconColor: string;
	LegacyFallbackIcon?: ComponentType<any>;
} {
	const appearanceIconStyles = appearanceIconSchema[appearance] || appearanceIconSchema.information;
	const AppearanceIcon = ({ primaryColor }: { primaryColor: string }): React.JSX.Element => (
		<appearanceIconStyles.Icon color={primaryColor} spacing="spacious" label={appearance} />
	);
	const Icon = icon || AppearanceIcon;

	return {
		...appearanceIconStyles,
		Icon,
	};
}
