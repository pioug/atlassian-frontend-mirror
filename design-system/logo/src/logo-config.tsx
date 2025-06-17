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

// Logos that only exist in @atlaskit/logo
export const LEGACY_ONLY_LOGOS = [
	'atlassian',
	'atlas',
	'atlassian-marketplace',
	'atlassian-access',
	'atlassian-administration',
	'atlassian-admin',
	'jira-software',
	'jira-work-management',
	'loom-attribution',
];

// Logos that exist in both packages
export const SHARED_LOGOS = [
	'atlassian-analytics',
	'bitbucket',
	'compass',
	'confluence',
	'jira',
	'jira-align',
	'jira-product-discovery',
	'jira-service-management',
	'loom',
	'opsgenie',
	'statuspage',
	'trello',
	'rovo',
	'guard',
	'focus',
];

// Logos that only exist in @atlaskit/temp-nav-app-icons
export const NEW_ONLY_LOGOS = [
	'assets',
	'chat',
	'customer-service-management',
	'goals',
	'home',
	'hub',
	'projects',
	'search',
	'studio',
	'talent',
	'teams',
];
