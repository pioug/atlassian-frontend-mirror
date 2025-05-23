import { COMMERCIAL, DEV, FEDRAMP_MODERATE, PRODUCTION, STAGING } from './index';

export type DomainConfig = {
	[COMMERCIAL]: RequiredDomainEnvironment;
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

export const globalDomains: Record<string, string> = {
	confluence: 'confluence.atlassian.com', // Atlassian design system documentation
	design: 'design.atlassian.com', // Atlassian design system documentation
	extranet: 'extranet.atlassian.com', // Old staff intranet (now hello.atlassian.net)
	go: 'go.atlassian.com', // Go links
	my: 'my.atlassian.com',
	surveys: 'surveys.atlassian.com',
	'wac-cdn': 'wac-cdn.atlassian.com', // WAC CDN links
	integrations: 'integrations.atlassian.com', // Integrations links
	permalink: 'permalink.atlassian.com',
	support: 'support.atlassian.com',
};

/**
 * Contains overrides for domains where the pattern of subdomain only doesn't work.
 * Priority is exact match > fallback to commercial production
 *
 * IF YOU ADD SOMETHING HERE YOU MUST EXPLICITLY ADD EVERY PERIMETER AND EVERY ENVIRONMENT
 * ANYTHING NOT SET EXPLICITLY WILL DEFAULT TO COMMERCIAL/PRODUCTION
 */
export const fullDomainOverride: Record<string, DomainConfig> = {
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
};
