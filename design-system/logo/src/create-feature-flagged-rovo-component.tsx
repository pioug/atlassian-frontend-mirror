import React from 'react';

import { tempSizeWrapper } from './temp-size-wrapper';
import { type LogoProps } from './types';
import { type AppIconProps, type AppLogoProps } from './utils/types';

export const createFeatureFlaggedRovoComponent: (
	LegacyComponent: React.ComponentType<LogoProps>,
	NewComponent: React.ComponentType<AppLogoProps> | React.ComponentType<AppIconProps>,
	NewHexComponent: React.ComponentType<AppLogoProps> | React.ComponentType<AppIconProps>,
) => ({
	shouldUseHexLogo,
	...props
}: LogoProps & {
	/**
	 * After the hex design is rolled out, this prop will do nothing - it is maintained for now to enable backwards compatibility and safe roll-out
	 */
	shouldUseNewLogoDesign?: boolean;
	/**
	 * Forces the new rovo hex logo to be used.
	 */
	shouldUseHexLogo?: boolean;
}) => React.JSX.Element = (
	_LegacyComponent: React.ComponentType<LogoProps>,
	_NewComponent: React.ComponentType<AppLogoProps> | React.ComponentType<AppIconProps>,
	NewHexComponent: React.ComponentType<AppLogoProps> | React.ComponentType<AppIconProps>,
) => {
	const RovoHexWrapped = tempSizeWrapper(NewHexComponent);

	return ({
		shouldUseHexLogo: _shouldUseHexLogo,
		...props
	}: LogoProps & {
		/**
		 * After the hex design is rolled out, this prop will do nothing - it is maintained for now to enable backwards compatibility and safe roll-out
		 */
		shouldUseNewLogoDesign?: boolean;
		/**
		 * Forces the new rovo hex logo to be used.
		 */
		shouldUseHexLogo?: boolean;
	}): React.JSX.Element => {
		// Hex logo is now always used (platform-logo-rebrand-rovo-hex fully launched)
		return <RovoHexWrapped {...props} />;
	};
};
