import { type DomainConfig } from './domains';

import { COMMERCIAL, DEV, FEDRAMP_MODERATE, PRODUCTION, STAGING } from './index';

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
