import { hostname } from '../../common/utils/hostname';

/**
 * @deprecated
 * This is a copy of the logic from @atlaskit/atlassian-context
 * We should delete it once we can register the teams domain in the context library
 */
export function isFedRampStaging(): boolean {
	const host = hostname();

	// *.stg.atlassian-us-gov-mod.com OR *.stg.atlassian-us-gov-mod.net
	if (host.match(/stg\.atlassian-us-gov-mod\.(com|net)/)) {
		return true;
	}

	// *.atlassian-stg-fedm.net
	if (host.match(/atlassian-stg-fedm\.net/)) {
		return true;
	}

	return false;
}
