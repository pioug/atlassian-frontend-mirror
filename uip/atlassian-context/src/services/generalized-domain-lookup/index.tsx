import {
	type CloudEnvironment,
	COMMERCIAL,
	type EnvironmentType,
	type IsolatedCloudPerimeterType,
	type NonIsolatedCloudPerimeterType,
} from '../../common/constants';
import { fullDomainOverride, globalDomains } from '../../common/constants/domains';
import { cloudEnvironment, isolatedCloudDomain } from '../perimeter';

import {
	AtlDomainMapping,
	isolatedCloudFunctions,
	nonIsolatedCloudFunctions,
	ReservedNameMapping,
} from './constants';

/**
 *
 * Gets the full domain for an Atlassian experience in the context of the current request.
 * Returns undefined only when a new perimeter has been created that is not yet supported by the atlassian-context library or when the ic domain cannot be retrieved.
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
	const currentCloudEnvironment: CloudEnvironment | undefined = cloudEnvironment();
	if (currentCloudEnvironment === undefined) {
		return undefined;
	}

	if (currentCloudEnvironment.type === 'isolated-cloud') {
		const domain = isolatedCloudDomain();
		if (domain === undefined) {
			return undefined;
		}
		return getDomainForIsolatedCloud(subdomain, COMMERCIAL, domain);
	}

	return getDomainForNonIsolatedCloud(subdomain, currentCloudEnvironment.perimeter, envType);
}

/**
 * Gets the full Isolated Cloud domain
 * Returns undefined only if ic_domain cannot be determined from the atl-ctx cookies
 * Defaults to returning the vanity name pattern
 * @param subdomain - The Atlassian experience subdomain
 * @param perimeter - The Isolated Cloud perimeter to get the domain for
 * @param isolatedCloudDomain - The IC domain (ex. "company.atlassian-isolated.net")
 * @returns The full domain associated with the subdomain in a specific IC
 */

function getDomainForIsolatedCloud(
	subdomain: string,
	perimeter: IsolatedCloudPerimeterType,
	isolatedCloudDomain: string,
) {
	const domainMappings = isolatedCloudFunctions[perimeter];

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
	const override = fullDomainOverride[subdomain]?.[perimeter]?.[envType];
	if (override) {
		return override;
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
