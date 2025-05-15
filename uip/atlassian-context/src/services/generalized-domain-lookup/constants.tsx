import {
	COMMERCIAL,
	type EnvironmentType,
	FEDRAMP_MODERATE,
	STAGING,
} from '../../common/constants';

import type {
	IsolatedCloudDomainPatternMap,
	IsolatedCloudDomainTypeEnumeration,
	NonIsolatedCloudDomainPatternMap,
} from './types';

/**
 * Contains list of Atlassian experiences that have a reserved name.
 * For Oasis EAP, reserved names are assumed to exist in every IC.
 */
export const ReservedNameMapping: IsolatedCloudDomainTypeEnumeration = {
	[COMMERCIAL]: ['id', 'admin', 'api'],
};

/**
 * Contains list of Atlassian experiences that use the Atlassian namespace subdomain.
 */
export const AtlDomainMapping: IsolatedCloudDomainTypeEnumeration = {
	[COMMERCIAL]: ['packages'],
};

/**
 * Contains the domain patterns for each isolated cloud perimeter
 */
export const isolatedCloudFunctions: IsolatedCloudDomainPatternMap = {
	[COMMERCIAL]: {
		isolatedCloudReservedNameDomain: (subdomain: string, isolatedCloudDomain: string) =>
			`${subdomain}.${isolatedCloudDomain}`,
		isolatedCloudAtlDomain: (subdomain: string, isolatedCloudDomain: string) =>
			`${subdomain}.atl.${isolatedCloudDomain}`,
		isolatedCloudVanityDomain: (subdomain: string, isolatedCloudDomain: string) =>
			`${subdomain}.services.${isolatedCloudDomain}`,
	},
};

/**
 * Contains the domain patterns for each non-isolated cloud perimeter and environment
 */
export const nonIsolatedCloudFunctions: NonIsolatedCloudDomainPatternMap = {
	[COMMERCIAL]: {
		defaultDomainEnding: (subdomain: string, env: EnvironmentType) =>
			env === STAGING ? `${subdomain}.stg.atlassian.com` : `${subdomain}.atlassian.com`,
	},
	[FEDRAMP_MODERATE]: {
		defaultDomainEnding: (subdomain: string, env: EnvironmentType) =>
			env === STAGING
				? `${subdomain}.stg.atlassian-us-gov-mod.com`
				: `${subdomain}.atlassian-us-gov-mod.com`,
	},
};
