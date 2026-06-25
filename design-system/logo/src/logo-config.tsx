import React from 'react';

import { fg } from '@atlaskit/platform-feature-flags';

import { createFeatureFlaggedServiceCollectionComponent } from './create-feature-flagged-service-collection-component';
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
	 * When the feature flag `platform-logo-rebrand-rovo-hex` is set to false, this flag changes the rovo logo to a tile.
	 * After the hex design is rolled out, this prop will do nothing - it is maintained for now to enable backwards compatibility and safe roll-out
	 */
	shouldUseNewLogoDesign?: boolean;
	/**
	 * Forces the new rovo hex logo to be used.
	 */
	shouldUseHexLogo?: boolean;
}) => React.JSX.Element = (
	LegacyComponent: React.ComponentType<LogoProps>,
	NewComponent: React.ComponentType<AppLogoProps> | React.ComponentType<AppIconProps>,
	NewHexComponent: React.ComponentType<AppLogoProps> | React.ComponentType<AppIconProps>,
) => {
	const RovoHexWrapped = tempSizeWrapper(NewHexComponent);
	const RovoServiceCollectionWrapped = createFeatureFlaggedServiceCollectionComponent(
		LegacyComponent,
		NewComponent,
	);

	return ({
		shouldUseHexLogo,
		...props
	}: LogoProps & {
		/**
		 * When the feature flag `platform-logo-rebrand-rovo-hex` is set to false, this flag changes the rovo logo to a tile.
		 * After the hex design is rolled out, this prop will do nothing - it is maintained for now to enable backwards compatibility and safe roll-out
		 */
		shouldUseNewLogoDesign?: boolean;
		/**
		 * Forces the new rovo hex logo to be used.
		 */
		shouldUseHexLogo?: boolean;
	}): React.JSX.Element => {
		// Return hex logo if feature flag enabled. Otherwise revert to old set of components
		if (fg('platform-logo-rebrand-rovo-hex') || shouldUseHexLogo) {
			return <RovoHexWrapped {...props} />;
		} else {
			return <RovoServiceCollectionWrapped {...props} />;
		}
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
