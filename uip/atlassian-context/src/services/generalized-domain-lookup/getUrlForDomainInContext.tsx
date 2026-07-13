import { type EnvironmentType } from '../../common/constants';

import { getDomainInContext } from './getDomainInContext';

export function getUrlForDomainInContext(
	subdomain: string,
	envType: EnvironmentType,
): string | undefined {
	const domain = getDomainInContext(subdomain, envType);
	if (!domain) {
		console.warn(`Domain could not be determined for requested subdomain: ${subdomain}`);
		return undefined;
	}
	return `${globalThis.location?.protocol ?? 'https:'}//${domain}`;
}
