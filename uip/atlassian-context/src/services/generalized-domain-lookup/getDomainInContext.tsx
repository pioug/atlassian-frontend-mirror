import {
	type CloudEnvironment,
	COMMERCIAL,
	type EnvironmentType,
	type IsolatedCloudPerimeterType,
	type NonIsolatedCloudPerimeterType,
} from '../../common/constants';
import { fullDomainOverride } from '../../common/constants/fullDomainOverride';
import { globalDomains } from '../../common/constants/globalDomains';
import { cloudEnvironment } from '../perimeter/cloudEnvironment';
import { isolatedCloudDomain } from '../perimeter/isolatedCloudDomain';

import {
	AtlDomainMapping,
	isolatedCloudFunctions,
	nonIsolatedCloudFunctions,
	ReservedNameMapping,
} from './constants';

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
