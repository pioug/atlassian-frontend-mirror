import {
	COMMERCIAL,
	type EnvironmentLookupResult,
	PRODUCTION,
} from '../../../common/constants/host-based-lookup/constants';
import { domainMap } from '../../../common/constants/host-based-lookup/constants/domainMap';
import { fullDomainOverride } from '../../../common/constants/host-based-lookup/constants/fullDomainOverride';
import { subdomainOverride } from '../../../common/constants/host-based-lookup/constants/subdomainOverride';
import { AllowedDomains, type DomainKey } from '../../../common/constants/host-based-lookup/types';

import { _getEnvironmentFromDomain } from './_getEnvironmentFromDomain';

function isValidDomainKey(domainKey: unknown): domainKey is DomainKey {
	if (!AllowedDomains.includes(domainKey as DomainKey)) {
		return false;
	}
	return true;
}

export function getATLContextDomain(
	domain: DomainKey | string,
	environment?: EnvironmentLookupResult,
): string {
	// Validate this is a valid domain
	if (!isValidDomainKey(domain)) {
		throw new Error(`Domain ${domain} is not supported.
      Supported domains: ${AllowedDomains.join(', ')}`);
	}

	// First priority, always return the global context if the product has onboarded
	// @ts-ignore - This is causing ts errors when this package is being enrolled into jira local consumption so temporarily ts ignoring this line for now
	const data = globalThis.ATL_CONTEXT_DOMAIN;
	if (data) {
		return data[domain];
	}

	const [env, perimeter] = environment ?? _getEnvironmentFromDomain();

	// Second priority, return if there is a full domain override
	const override = fullDomainOverride[domain];
	if (override) {
		return (
			// Exact match preferred
			override[perimeter]?.[env] ?? override[COMMERCIAL][PRODUCTION] // Fallback to mandatory commercial production
		);
	}

	// Third priority, join the subdomain
	const tld = domainMap[perimeter]?.[env] ?? domainMap[COMMERCIAL][PRODUCTION];
	const subdomain = subdomainOverride[domain] ?? domain;
	return `${subdomain}.${tld}`;
}
