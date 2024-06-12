import {
	COMMERCIAL,
	type EnvironmentLookupResult,
	FEDRAMP_FEDEX,
	FEDRAMP_MODERATE,
	PRODUCTION,
	STAGING,
} from '../../common/constants';
import { domainMap, fullDomainOverride, subdomainOverride } from '../../common/constants/domains';
import { AllowedDomains, type DomainConfig, type DomainKey } from '../../common/types';

export function configure(data: DomainConfig): void {
	if (!data || Object.keys(data).length < 1) {
		throw new Error('Data are not available');
	}

	globalThis.ATL_CONTEXT_DOMAIN = data;
}

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
			override[perimeter]?.[env] ??
			// Fallback to mandatory commercial production
			override[COMMERCIAL][PRODUCTION]
		);
	}

	// Third priority, join the subdomain
	const tld = domainMap[perimeter]?.[env] ?? domainMap[COMMERCIAL][PRODUCTION];
	const subdomain = subdomainOverride[domain] ?? domain;
	return `${subdomain}.${tld}`;
}

export function getATLContextUrl(domain: DomainKey | string): string {
	return `${globalThis.location.protocol}//${getATLContextDomain(domain)}`;
}

export function _getEnvironmentFromDomain(): EnvironmentLookupResult {
	const hostname = globalThis.location?.hostname;
	if (!hostname) {
		// default if no location available
		return [PRODUCTION, COMMERCIAL];
	}

	// *.atlassian-fex.com
	if (hostname.match(/atlassian-fex\.com/)) {
		return [STAGING, FEDRAMP_FEDEX];
	}

	// *.stg.atlassian-us-gov-mod.com OR *.stg.atlassian-us-gov-mod.net
	if (hostname.match(/stg\.atlassian-us-gov-mod\.(com|net)/)) {
		return [STAGING, FEDRAMP_MODERATE];
	}

	// *.atlassian-stg-fedm.net
	if (hostname.match(/atlassian-stg-fedm\.net/)) {
		return [STAGING, FEDRAMP_MODERATE];
	}

	// *.atlassian-us-gov-mod.com OR *.atlassian-us-gov-mod.net
	if (hostname.match(/atlassian-us-gov-mod\.(com|net)/)) {
		return [PRODUCTION, FEDRAMP_MODERATE];
	}

	// *.stg.atlassian.com OR *.stg.internal.atlassian.com
	if (hostname.match(/stg(\.internal)?\.atlassian\.com/)) {
		return [STAGING, COMMERCIAL];
	}

	// *.jira-dev.com
	if (hostname.match(/jira-dev\.com/)) {
		return [STAGING, COMMERCIAL];
	}

	// default fallthrough
	return [PRODUCTION, COMMERCIAL];
}
