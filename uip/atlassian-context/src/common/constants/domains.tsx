import type { DomainKey } from '../types';

import { COMMERCIAL, DEV, FEDRAMP_FEDEX, FEDRAMP_MODERATE, PRODUCTION, STAGING } from './index';

export type DomainConfig = {
	[COMMERCIAL]: RequiredDomainEnvironment;
	[FEDRAMP_FEDEX]?: DomainEnvironment;
	[FEDRAMP_MODERATE]?: DomainEnvironment;
};

export type DomainEnvironment = {
	[STAGING]?: string;
	[PRODUCTION]?: string;
	[DEV]?: string;
};

export type RequiredDomainEnvironment = {
	[PRODUCTION]: string;
} & DomainEnvironment;

/**
 * Creates a mapping from perimeter to environment to domain, allowing simply substitutions
 * to minimize the amount of data we have to ship to the browser.
 */
export const domainMap: DomainConfig = {
	[COMMERCIAL]: {
		[STAGING]: 'stg.atlassian.com',
		[PRODUCTION]: 'atlassian.com',
	},
	[FEDRAMP_FEDEX]: {
		[STAGING]: 'atlassian-fex.com',
	},
	[FEDRAMP_MODERATE]: {
		[STAGING]: 'stg.atlassian-us-gov-mod.com',
		[PRODUCTION]: 'atlassian-us-gov-mod.com',
	},
};

// Contains overrides for subdomains where the DomainKey is different from the subdomain
export const subdomainOverride: Partial<Record<DomainKey, string>> = {};

/**
 * Contains overrides for domains where the pattern of subdomain only doesn't work.
 * Useful in situations where this is a global domain that won't vary per environment.
 * Priority is exact match > fallback to commercial production
 *
 * IF YOU ADD SOMETHING HERE YOU MUST EXPLICITLY ADD EVERY PERIMETER AND EVERY ENVIRONMENT
 * ANYTHING NOT SET EXPLICITLY WILL DEFEAULT TO COMMERCIAL/PRODUCTION
 */
export const fullDomainOverride: Partial<Record<DomainKey, DomainConfig>> = {
	analytics: {
		[COMMERCIAL]: {
			[PRODUCTION]: 'analytics.atlassian.com',
		},
	},

	// Marketing site
	confluence: {
		[COMMERCIAL]: {
			[PRODUCTION]: 'confluence.atlassian.com',
		},
	},

	// Atlassian design system documentation
	design: {
		[COMMERCIAL]: {
			[PRODUCTION]: 'design.atlassian.com',
		},
	},

	// Old staff intranet (now hello.atlassian.net)
	extranet: {
		[COMMERCIAL]: {
			[PRODUCTION]: 'extranet.atlassian.com',
		},
	},

	// Go links
	go: {
		[COMMERCIAL]: {
			[PRODUCTION]: 'go.atlassian.com',
		},
	},

	my: {
		[COMMERCIAL]: {
			[PRODUCTION]: 'my.atlassian.com',
		},
	},

	schema: {
		[COMMERCIAL]: {
			[PRODUCTION]: 'schema.atlassian.com',
		},
	},

	start: {
		[COMMERCIAL]: {
			[PRODUCTION]: 'start.atlassian.com',
			[STAGING]: 'start.stg.atlassian.com',
		},
		[FEDRAMP_MODERATE]: {
			[PRODUCTION]: 'start.atlassian-us-gov-mod.com',
			[STAGING]: 'start.stg.atlassian-us-gov-mod.com',
		},
	},

	surveys: {
		[COMMERCIAL]: {
			[PRODUCTION]: 'surveys.atlassian.com',
		},
	},

	'wac-cdn': {
		[COMMERCIAL]: {
			[PRODUCTION]: 'wac-cdn.atlassian.com',
		},
	},

	integrations: {
		[COMMERCIAL]: {
			[PRODUCTION]: 'integrations.atlassian.com',
		},
	},

	permalink: {
		[COMMERCIAL]: {
			[PRODUCTION]: 'permalink.atlassian.com',
		},
	},

	id: {
		[COMMERCIAL]: {
			[PRODUCTION]: 'id.atlassian.com',
			[STAGING]: 'id.stg.internal.atlassian.com',
			[DEV]: 'id.dev.internal.atlassian.com',
		},
		[FEDRAMP_MODERATE]: {
			[PRODUCTION]: 'id.atlassian-us-gov-mod.com',
			[STAGING]: 'id.stg.atlassian-us-gov-mod.com',
		},
	},
	support: {
		[COMMERCIAL]: {
			[PRODUCTION]: 'support.atlassian.com',
		},
	},
};
