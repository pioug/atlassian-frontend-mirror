import React from 'react';

import { fg } from '@atlaskit/platform-feature-flags';

import { type LogoProps } from './types';
import { type AppIconProps, type AppLogoProps } from './utils/types';

/**
 * Creates a feature flagged component that renders the legacy logo or the new logo
 * based on the platform-logo-rebrand feature flag.
 *
 * @param LegacyComponent - The legacy logo component.
 * @param NewComponent - The new logo component.
 * @returns A feature flagged component that renders the legacy logo or the new logo.
 */
export const createFeatureFlaggedServiceCollectionComponent: (
	LegacyComponent: React.ComponentType<LogoProps>,
	NewComponent: React.ComponentType<AppLogoProps> | React.ComponentType<AppIconProps>,
) => ({ size, shouldUseNewLogoDesign, ...props }: LogoProps) => React.JSX.Element = (
	LegacyComponent: React.ComponentType<LogoProps>,
	NewComponent: React.ComponentType<AppLogoProps> | React.ComponentType<AppIconProps>,
) => {
	// Note: textColor and iconColor aren't supported on all new logos
	// These props will be deprecated in the future
	return ({ size, shouldUseNewLogoDesign, ...props }: LogoProps): React.JSX.Element => {
		if (fg('platform-logo-rebrand') || shouldUseNewLogoDesign) {
			// Size defaults need to be set, as the temp library had different defaults
			return <NewComponent size={size || 'medium'} {...props} />;
		}

		return <LegacyComponent size={size} {...props} />;
	};
};
