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
	 * @deprecated This prop no longer has any effect. The new logo design is now always used following the full launch of the `platform-logo-rebrand` feature flag. This prop is maintained for backwards compatibility only and will be removed in a future release.
	 */
	shouldUseNewLogoDesign?: boolean;
	/**
	 * @deprecated This prop no longer has any effect. The Rovo hex logo is now always used following the full launch of the `platform-logo-rebrand-rovo-hex` feature flag. This prop is maintained for backwards compatibility only and will be removed in a future release.
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
		 * @deprecated This prop no longer has any effect. The new logo design is now always used following the full launch of the `platform-logo-rebrand` feature flag. This prop is maintained for backwards compatibility only and will be removed in a future release.
		 */
		shouldUseNewLogoDesign?: boolean;
		/**
		 * @deprecated This prop no longer has any effect. The Rovo hex logo is now always used following the full launch of the `platform-logo-rebrand-rovo-hex` feature flag. This prop is maintained for backwards compatibility only and will be removed in a future release.
		 */
		shouldUseHexLogo?: boolean;
	}): React.JSX.Element => {
		// Hex logo is now always used (platform-logo-rebrand-rovo-hex fully launched)
		return <RovoHexWrapped {...props} />;
	};
};

export {
	logoDocsSchema,
	PROGRAM_LOGO_DOCS_ORDER,
	APP_LOGO_DOCS_ORDER,
	AGENT_LOGO_DOCS_ORDER,
	LEGACY_ONLY_LOGOS,
	SHARED_LOGOS,
	NEW_ONLY_LOGOS,
} from './logo-docs-schema';

export { createFeatureFlaggedComponent } from './create-feature-flagged-component';
export { createFeatureFlaggedServiceCollectionComponent } from './create-feature-flagged-service-collection-component';
export { tempSizeWrapper } from './temp-size-wrapper';
