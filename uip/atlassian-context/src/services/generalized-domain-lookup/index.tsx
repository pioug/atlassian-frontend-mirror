import {
	COMMERCIAL,
	EnvironmentType,
	ISOLATED_CLOUD_PERIMETERS,
	IsolatedCloudPerimeterType,
	NON_ISOLATED_CLOUD_PERIMETERS,
	NonIsolatedCloudPerimeterType,
	PRODUCTION,
} from '../../common/constants';
import { fullDomainOverride } from '../../common/constants/domains';
import { AllowedDomains, DomainKey } from '../../common/types';
import { AtlContextCookie, parseAtlCtxCookie } from '../perimeter/utils';

import {
	AtlDomainMapping,
	isolatedCloudFunctions,
	nonIsolatedCloudFunctions,
	ReservedNameMapping,
} from './constants';
import { _getEnvironmentFromDomain } from './utils';

/**
 * WARNING: This function depends on the availability of the `atl-ctx` cookie, which is to be set by Isolated Cloud GlobalEdge.
 * If this note is still visible, this likely means that the cookie is not available yet.
 *
 * Gets the full domain for an Atlassian experience in the context of the current request
 * Returns undefined only when a new perimeter has been created that is not yet supported by the atlassian-context library
 *
 * @param subdomain - The Atlassian experience subdomain
 * @param environment - The environment to get the domain for. Not needed if this function will only be called from Isolated Cloud. If environment is not provided for non-isolated cloud, the hostname will be inspected to determine the environment.
 * @returns The full domain associated with the subdomain for the given environment
 */
export function getDomainInContext(
	subdomain: string,
	environment?: EnvironmentType,
): string | undefined {
	const atlCtxCookie: AtlContextCookie | undefined = parseAtlCtxCookie();

	if (atlCtxCookie === undefined) {
		// when the atl-ctx cookie is not set, the perimeter is assumed to be regular Commercial
		const env = getEnv(environment);
		return getDomainForNonIsolatedCloud(subdomain, COMMERCIAL, env);
	}

	const isIsolatedCloud: boolean =
		ISOLATED_CLOUD_PERIMETERS.includes(atlCtxCookie.perimeter as IsolatedCloudPerimeterType) &&
		atlCtxCookie.ic_domain != null;

	if (isIsolatedCloud) {
		const perimeter = atlCtxCookie.perimeter as IsolatedCloudPerimeterType;
		return getDomainForIsolatedCloud(subdomain, perimeter, atlCtxCookie);
	} else if (
		!NON_ISOLATED_CLOUD_PERIMETERS.includes(atlCtxCookie.perimeter as NonIsolatedCloudPerimeterType)
	) {
		console.warn(
			`atlCtxCookie.perimeter has value ${atlCtxCookie.perimeter} which is not yet supported by the atlassian-context library`,
		);
		return undefined;
	}

	const env = getEnv(environment);
	const perimeter = atlCtxCookie.perimeter as NonIsolatedCloudPerimeterType;
	return getDomainForNonIsolatedCloud(subdomain, perimeter, env);
}

/**
 * Gets the full Isolated Cloud domain
 * Returns undefined only when a new perimeter has been created that is not yet supported by the atlassian-context library or if ic_domain cannot be determined
 *
 * @param subdomain - The Atlassian experience subdomain
 * @param perimeter - The Isolated Cloud perimeter to get the domain for
 * @param atlCtxCookie - The atl-ctx cookie to get the IC domain from
 * @returns The full domain associated with the subdomain in a specific IC
 */
function getDomainForIsolatedCloud(
	subdomain: string,
	perimeter: IsolatedCloudPerimeterType,
	atlCtxCookie: AtlContextCookie,
) {
	const domainMappings = isolatedCloudFunctions[perimeter];

	const isolatedCloudDomain = atlCtxCookie.ic_domain;
	if (!isolatedCloudDomain) {
		console.warn('No isolated cloud domain found in atl-ctx cookie');
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
 * @param environment - The environment to get the domain for
 * @returns The full domain associated with the subdomain for the given perimeter and environment
 */
function getDomainForNonIsolatedCloud(
	subdomain: string,
	perimeter: NonIsolatedCloudPerimeterType,
	environment: EnvironmentType,
) {
	// First check if the subdomain is associated with a full domain override, ex. for global domains that are the same across all perimeters/environments
	if (AllowedDomains.includes(subdomain as DomainKey)) {
		const override = fullDomainOverride[subdomain as DomainKey];
		if (override) {
			return (
				override[perimeter]?.[environment] ?? override[COMMERCIAL][PRODUCTION] // Default to commercial production if no environment-specific override is found
			);
		}
	}

	const domainMappings = nonIsolatedCloudFunctions[perimeter];
	return domainMappings.defaultDomainEnding(subdomain, environment);
}

/**
 * If the environment is already known, then it will be returned.
 * Otherwise, the hostname will be inspected to determine the environment.
 *
 * @param environment
 * @returns The environment
 */
function getEnv(environment?: EnvironmentType): EnvironmentType {
	if (environment) {
		return environment;
	}
	console.warn(
		'In non-isolated cloud but no environment has been provided. Hostname will be inspected to determine environment instead.',
	);
	return _getEnvironmentFromDomain();
}

/**
 * WARNING: This function depends on the availability of the `atl-ctx` cookie, which is to be set by Isolated Cloud GlobalEdge.
 * If this note is still visible, this likely means that the cookie is not available yet.
 *
 * Gets the full URL for an Atlassian experience in the context of the current request
 * Returns undefined only in the case where the specific IC domain (i.e <icLabel>.<baseDomain>) in an Isolation Cloud cannot be determined
 *
 * @param subdomain - The Atlassian experience subdomain
 * @param environment - The environment to get the domain for. Not needed if this function will only be called from Isolated Cloud. If environment is not provided for non-isolated cloud, the hostname will be inspected to determine the environment.
 * @returns The full URL
 */
export function getUrlForDomainInContext(
	subdomain: string,
	environment: EnvironmentType,
): string | undefined {
	const domain = getDomainInContext(subdomain, environment);
	if (!domain) {
		console.warn(`Domain could not be determined for requested subdomain: ${subdomain}`);
		return undefined;
	}
	return `${globalThis.location.protocol}//${domain}`;
}
