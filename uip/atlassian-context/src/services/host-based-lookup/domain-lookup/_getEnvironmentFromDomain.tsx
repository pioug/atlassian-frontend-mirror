import {
	COMMERCIAL,
	type EnvironmentLookupResult,
	FEDRAMP_FEDEX,
	FEDRAMP_MODERATE,
	PRODUCTION,
	STAGING,
} from '../../../common/constants/host-based-lookup/constants';

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
