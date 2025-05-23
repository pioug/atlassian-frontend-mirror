import {
	COMMERCIAL,
	DEV,
	type EnvironmentType,
	FEDRAMP_MODERATE,
	PRODUCTION,
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
	[COMMERCIAL]: ['home', 'start', 'id', 'api', 'admin', 'auth', 'bitbucket'],
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
		defaultDomainEnding: (subdomain: string, envType: EnvironmentType) => {
			switch (envType) {
				case PRODUCTION:
					return `${subdomain}.atlassian.com`;
				case STAGING:
					return `${subdomain}.stg.atlassian.com`;
				case DEV:
					return `${subdomain}.dev.atlassian.com`;
				default:
					console.warn(
						`Cannot get non-isolated commercial domain for provided environment, ${envType} is unsupported`,
					);
					return '';
			}
		},
	},
	[FEDRAMP_MODERATE]: {
		defaultDomainEnding: (subdomain: string, envType: EnvironmentType) => {
			switch (envType) {
				case PRODUCTION:
					return `${subdomain}.atlassian-us-gov-mod.com`;
				case STAGING:
					return `${subdomain}.stg.atlassian-us-gov-mod.com`;
				default:
					console.warn(
						`Cannot get fedramp-moderate domain for provided environment, ${envType} is unsupported`,
					);
					return '';
			}
		},
	},
};
