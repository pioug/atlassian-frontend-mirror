import { EnvironmentType, PRODUCTION, STAGING } from '../../common/constants';

export function _getEnvironmentFromDomain(): EnvironmentType {
	const hostname = globalThis.location?.hostname;
	if (!hostname) {
		return PRODUCTION;
	}

	if (hostname.match(/stg\.atlassian-us-gov-mod\.(com|net)/)) {
		return STAGING;
	}

	if (hostname.match(/atlassian-stg-fedm\.net/)) {
		return STAGING;
	}

	if (hostname.match(/atlassian-us-gov-mod\.(com|net)/)) {
		return PRODUCTION;
	}

	if (hostname.match(/stg(\.internal)?\.atlassian\.com/)) {
		return STAGING;
	}

	if (hostname.match(/jira-dev\.com/)) {
		return STAGING;
	}

	return PRODUCTION;
}
