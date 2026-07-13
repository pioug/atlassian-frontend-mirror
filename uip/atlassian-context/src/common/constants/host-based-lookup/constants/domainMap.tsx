import { type DomainConfig } from './domains';

import { COMMERCIAL, FEDRAMP_FEDEX, FEDRAMP_MODERATE, PRODUCTION, STAGING } from './index';

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
