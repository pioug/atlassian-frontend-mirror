import React from 'react';

import { type LogoProps } from './types';
import { type AppIconProps, type AppLogoProps } from './utils/types';

/**
 * Creates a component that renders the new logo design.
 *
 * @param LegacyComponent - The legacy logo component (no longer used).
 * @param NewComponent - The new logo component.
 * @returns A component that renders the new logo.
 */
export const createFeatureFlaggedComponent: (
	LegacyComponent: React.ComponentType<LogoProps>,
	NewComponent: React.ComponentType<AppLogoProps> | React.ComponentType<AppIconProps>,
) => ({ size, shouldUseNewLogoDesign, ...props }: LogoProps) => React.JSX.Element = (
	_LegacyComponent: React.ComponentType<LogoProps>,
	NewComponent: React.ComponentType<AppLogoProps> | React.ComponentType<AppIconProps>,
) => {
	// Note: textColor and iconColor aren't supported on all new logos
	// These props will be deprecated in the future
	return ({
		size,
		shouldUseNewLogoDesign: _shouldUseNewLogoDesign,
		...props
	}: LogoProps): React.JSX.Element => {
		// Size defaults need to be set, as the temp library had different defaults
		return <NewComponent size={size || 'medium'} {...props} />;
	};
};
