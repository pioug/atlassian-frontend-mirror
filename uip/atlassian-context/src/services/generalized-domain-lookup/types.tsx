import type {
	EnvironmentType,
	IsolatedCloudPerimeterType,
	NonIsolatedCloudPerimeterType,
} from '../../common/constants';

/**
 * Type for a collection of domain endings for isolated cloud perimeters
 */
export type IsolatedCloudDomainPatterns = {
	isolatedCloudReservedNameDomain: (subdomain: string, isolatedCloudDomain: string) => string;
	isolatedCloudAtlDomain: (subdomain: string, isolatedCloudDomain: string) => string;
	isolatedCloudVanityDomain: (subdomain: string, isolatedCloudDomain: string) => string;
};

/**
 * Type for collection of domain endings for non-isolated cloud perimeters
 */
export type NonIsolatedCloudDomainPatterns = {
	defaultDomainEnding: (subdomain: string, env: EnvironmentType) => string;
};

/**
 * Type for a mapping of every isolated cloud perimeter to its domain ending patterns
 */
export type IsolatedCloudDomainPatternMap = {
	[K in IsolatedCloudPerimeterType]: IsolatedCloudDomainPatterns;
};

/**
 * Type for a mapping of every non-isolated cloud perimeter to its domain ending ending patterns
 */
export type NonIsolatedCloudDomainPatternMap = {
	[K in NonIsolatedCloudPerimeterType]: NonIsolatedCloudDomainPatterns;
};

/**
 * Type for a collection of Atlassian experiences that have a specific Isolated Cloud domain ending
 */
export type IsolatedCloudDomainTypeEnumeration = {
	[K in IsolatedCloudPerimeterType]: string[];
};
