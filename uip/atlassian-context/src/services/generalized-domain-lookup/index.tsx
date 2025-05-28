import {
	COMMERCIAL,
	type EnvironmentType,
	ISOLATED_CLOUD_PERIMETERS,
	type IsolatedCloudPerimeterType,
	NON_ISOLATED_CLOUD_PERIMETERS,
	type NonIsolatedCloudPerimeterType,
	PRODUCTION,
} from '../../common/constants';
import { fullDomainOverride, globalDomains } from '../../common/constants/domains';
import { type AtlCtxCookieValues, parseAtlCtxCookies } from '../atl-cookies-lookup';

import {
	AtlDomainMapping,
	isolatedCloudFunctions,
	nonIsolatedCloudFunctions,
	ReservedNameMapping,
} from './constants';

/**
 *
 * Gets the full domain for an Atlassian experience in the context of the current request.
 * Returns undefined only when a new perimeter has been created that is not yet supported by the atlassian-context library.
 *
 * For Non Isolated Cloud, the domain will be determined by the perimeter and environment combination unless the subdomain belongs in the list of global domains or overrides.
 * For Isolated Cloud, the domain type defaults to the vanity name pattern.
 *
 * @param subdomain - The Atlassian experience subdomain
 * @param envType - The environment to get the domain for ('dev', 'staging', or 'prod'). When in Isolated Cloud, the same value will be returned for all env types.
 * @returns The full domain associated with the subdomain for the given environment
 */
export function getDomainInContext(
	subdomain: string,
	envType: EnvironmentType,
): string | undefined {
	const atlCtxCookieValues: AtlCtxCookieValues | undefined = parseAtlCtxCookies();

	// Form domain for non-isolated commercial
	if (atlCtxCookieValues === undefined) {
		return getDomainForNonIsolatedCloud(subdomain, COMMERCIAL, envType);
	}

	// Cookie values validity check
	const isIsolatedCloudPerimeterType = ISOLATED_CLOUD_PERIMETERS.includes(
		atlCtxCookieValues.perimeter as IsolatedCloudPerimeterType,
	);
	const isNonIsolatedCloudPerimeterType = NON_ISOLATED_CLOUD_PERIMETERS.includes(
		atlCtxCookieValues.perimeter as NonIsolatedCloudPerimeterType,
	);
	if (!isIsolatedCloudPerimeterType && !isNonIsolatedCloudPerimeterType) {
		console.warn(
			`Atl Ctx cookies are passing in invalid perimeter ${atlCtxCookieValues.perimeter}`,
		);
		return undefined;
	}

	// Form domain for isolated-cloud
	const isIsolatedCloud: boolean =
		isIsolatedCloudPerimeterType && atlCtxCookieValues.icDomain !== undefined;

	if (isIsolatedCloud) {
		const perimeter = atlCtxCookieValues.perimeter as IsolatedCloudPerimeterType;
		return getDomainForIsolatedCloud(subdomain, perimeter, atlCtxCookieValues);
	}

	// Form domain for non-isolated, non-commercial perimeter (aka fedramp)
	const perimeter = atlCtxCookieValues.perimeter as NonIsolatedCloudPerimeterType;
	return getDomainForNonIsolatedCloud(subdomain, perimeter, envType);
}

/**
 * Gets the full Isolated Cloud domain
 * Returns undefined only if ic_domain cannot be determined from the atl-ctx cookies
 * Defaults to returning the vanity name pattern
 * @param subdomain - The Atlassian experience subdomain
 * @param perimeter - The Isolated Cloud perimeter to get the domain for
 * @param atlCtxCookieValues - The atl-ctx cookie to get the IC domain from
 * @returns The full domain associated with the subdomain in a specific IC
 */
function getDomainForIsolatedCloud(
	subdomain: string,
	perimeter: IsolatedCloudPerimeterType,
	atlCtxCookieValues: AtlCtxCookieValues,
) {
	const domainMappings = isolatedCloudFunctions[perimeter];

	const isolatedCloudDomain = atlCtxCookieValues.icDomain;
	if (!isolatedCloudDomain) {
		console.warn('No isolated cloud domain found in atl-ctx cookie values');
		return undefined;
	}

	if (ReservedNameMapping[perimeter].includes(subdomain)) {
		return domainMappings.isolatedCloudReservedNameDomain(subdomain, isolatedCloudDomain);
	}

	if (AtlDomainMapping[perimeter].includes(subdomain)) {
		return domainMappings.isolatedCloudAtlDomain(subdomain, isolatedCloudDomain);
	}

	return domainMappings.isolatedCloudVanityDomain(subdomain, isolatedCloudDomain);
}

/**
 * Gets the full domain in an non-Isolated Cloud perimeter
 *
 * @param subdomain - The Atlassian experience subdomain
 * @param perimeter - The non-isolated cloud perimeter to get the domain for
 * @param The environment to get the domain for ('dev', 'staging', or 'prod'). When in Isolated Cloud, the same value will be returned for all env types.
 * @returns The full domain associated with the subdomain for the given perimeter and environment
 */
function getDomainForNonIsolatedCloud(
	subdomain: string,
	perimeter: NonIsolatedCloudPerimeterType,
	envType: EnvironmentType,
) {
	// First, check if the subdomain is associated with a global domain
	if (globalDomains[subdomain]) {
		return globalDomains[subdomain];
	}

	// Second, check if the subdomain is associated with a full domain override (ex. a domain that uses a different pattern in other perimeters/environments)
	const override = fullDomainOverride[subdomain];
	if (override) {
		return (
			override[perimeter]?.[envType] ?? override[COMMERCIAL][PRODUCTION] // Default to commercial production if no environment-specific override is found
		);
	}

	// Use default domain ending for the given perimeter
	const domainMappings = nonIsolatedCloudFunctions[perimeter];
	return domainMappings.defaultDomainEnding(subdomain, envType);
}

/**
 *
 * Gets the full URL for an Atlassian experience in the context of the current request
 * Returns undefined only when a new perimeter has been created that is not yet supported by the atlassian-context library
 *
 * @param subdomain - The Atlassian experience subdomain
 * @param The environment to get the domain for ('dev', 'staging', or 'prod'). When in Isolated Cloud, the same value will be returned for all env types.
 * @returns The full URL for the given subdomain and environment
 */
export function getUrlForDomainInContext(
	subdomain: string,
	envType: EnvironmentType,
): string | undefined {
	const domain = getDomainInContext(subdomain, envType);
	if (!domain) {
		console.warn(`Domain could not be determined for requested subdomain: ${subdomain}`);
		return undefined;
	}
	return `${globalThis.location.protocol}//${domain}`;
}
