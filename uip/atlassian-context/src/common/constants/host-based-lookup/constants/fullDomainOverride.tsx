import type { DomainKey } from '../types';

import { type DomainConfig } from './domains';

import { COMMERCIAL, DEV, FEDRAMP_MODERATE, PRODUCTION, STAGING } from './index';

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
