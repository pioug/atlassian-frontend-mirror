import React from 'react';

import { fg } from '@atlaskit/platform-feature-flags';
import {
	type IconProps as TempIconProps,
	type LogoProps as TempLogoProps,
} from '@atlaskit/temp-nav-app-icons/types';

import { type LogoProps } from './types';

/**
 * Creates a feature flagged component that renders the legacy logo or the new logo
 * based on the platform-logo-rebrand feature flag.
 *
 * @param LegacyComponent - The legacy logo component.
 * @param NewComponent - The new logo component.
 * @returns A feature flagged component that renders the legacy logo or the new logo.
 */
export const createFeatureFlaggedComponent = (
	LegacyComponent: React.ComponentType<LogoProps>,
	NewComponent: React.ComponentType<TempLogoProps> | React.ComponentType<TempIconProps>,
) => {
	// Note: textColor and iconColor aren't supported on all new logos
	// These props will be deprecated in the future
	return ({ size, shouldUseNewLogoDesign, ...props }: LogoProps) => {
		if (fg('platform-logo-rebrand') || shouldUseNewLogoDesign) {
			// Size defaults need to be set, as the temp library had different defaults
			return <NewComponent size={size || 'medium'} {...props} />;
		}

		return <LegacyComponent size={size} {...props} />;
	};
};

/**
 * Creates a wrapper around the new logo or icon component to ensure it receives the correct default (medium) size prop.
 *
 * @param NewComponent - The new logo or icon component.
 */
export const tempSizeWrapper = (
	NewComponent: React.ComponentType<TempLogoProps> | React.ComponentType<TempIconProps>,
) => {
	return ({ size, ...props }: LogoProps) => {
		return <NewComponent size={size || 'medium'} {...props} />;
	};
};

export const logoDocsSchema = [
	// Program logos
	{ name: 'atlassian', type: 'legacy', category: 'program', deprecated: false },
	{ name: 'atlassian-access', type: 'legacy', category: 'program', deprecated: false },
	{ name: 'atlassian-marketplace', type: 'legacy', category: 'program', deprecated: false },
	// Home collection
	{ name: 'home', type: 'new', category: 'app', deprecated: false },
	{ name: 'hub', type: 'new', category: 'app', deprecated: false },
	// Teamwork collection
	{ name: 'confluence', type: 'migration', category: 'app', deprecated: false },
	{ name: 'jira', type: 'migration', category: 'app', deprecated: false },
	{ name: 'loom', type: 'migration', category: 'app', deprecated: false },
	{ name: 'loom-attribution', type: 'migration', category: 'app', deprecated: false },
	{ name: 'rovo', type: 'migration', category: 'app', deprecated: false },
	// Strategy collection
	{ name: 'align', type: 'new', category: 'app', deprecated: false },
	{ name: 'focus', type: 'migration', category: 'app', deprecated: false },
	{ name: 'talent', type: 'new', category: 'app', deprecated: false },
	// Product collection
	{ name: 'jira-product-discovery', type: 'migration', category: 'app', deprecated: false },
	// Dev collection
	{ name: 'bitbucket', type: 'migration', category: 'app', deprecated: false },
	{ name: 'compass', type: 'migration', category: 'app', deprecated: false },
	// Customer collection
	{ name: 'jira-service-management', type: 'migration', category: 'app', deprecated: false },
	{ name: 'assets', type: 'new', category: 'app', deprecated: false },
	{ name: 'customer-service-management', type: 'new', category: 'app', deprecated: false },
	{ name: 'opsgenie', type: 'migration', category: 'app', deprecated: false },
	{ name: 'statuspage', type: 'migration', category: 'app', deprecated: false },
	{ name: 'trello', type: 'migration', category: 'app', deprecated: false },
	// Platform Collection
	{ name: 'admin', type: 'new', category: 'app', deprecated: false },
	{ name: 'analytics', type: 'new', category: 'app', deprecated: false },
	{ name: 'chat', type: 'new', category: 'app', deprecated: false },
	{ name: 'goals', type: 'new', category: 'app', deprecated: false },
	{ name: 'guard', type: 'migration', category: 'app', deprecated: false },
	{ name: 'projects', type: 'new', category: 'app', deprecated: false },
	{ name: 'search', type: 'new', category: 'app', deprecated: false },
	{ name: 'studio', type: 'new', category: 'app', deprecated: false },
	{ name: 'teams', type: 'new', category: 'app', deprecated: false },
	// Data Center
	{ name: 'jira-data-center', type: 'new', category: 'app', deprecated: false },
	{ name: 'confluence-data-center', type: 'new', category: 'app', deprecated: false },
	{ name: 'bitbucket-data-center', type: 'new', category: 'app', deprecated: false },
	// Deprecated
	{ name: 'atlassian-administration', type: 'legacy', category: 'app', deprecated: true },
	{ name: 'atlassian-admin', type: 'legacy', category: 'app', deprecated: true },
	{ name: 'atlassian-analytics', type: 'legacy', category: 'app', deprecated: true },
	{ name: 'atlas', type: 'legacy', category: 'app', deprecated: true },
	{ name: 'jira-align', type: 'legacy', category: 'app', deprecated: true },
	{ name: 'jira-software', type: 'legacy', category: 'app', deprecated: true },
	{ name: 'jira-work-management', type: 'legacy', category: 'app', deprecated: true },
] as const;

export const PROGRAM_LOGO_DOCS_ORDER = logoDocsSchema
	.filter((logo) => logo.category === 'program' && !logo.deprecated)
	.map((logo) => logo.name);
export const APP_LOGO_DOCS_ORDER = logoDocsSchema
	.filter((logo) => logo.category === 'app' && !logo.deprecated)
	.map((logo) => logo.name);

export const LEGACY_ONLY_LOGOS = logoDocsSchema.filter((logo) => logo.type === 'legacy');
export const SHARED_LOGOS = logoDocsSchema.filter((logo) => logo.type === 'migration');
export const NEW_ONLY_LOGOS = logoDocsSchema.filter((logo) => logo.type === 'new');
