import { getATLContextUrl } from '@atlaskit/atlassian-context/get-atl-context-url';
import { getUrlForDomainInContext } from '@atlaskit/atlassian-context/get-url-for-domain-in-context';
import { isFedRamp } from '@atlaskit/atlassian-context/is-fedramp';
import { isIsolatedCloud } from '@atlaskit/atlassian-context/is-isolated-cloud';

import type { RequireOrgIdOrCloudId } from '../../common/types';
import { getEnvironment } from './getEnvironment';
import { isFedRampStaging } from './isFedRampStaging';

export function generateTeamsAppPath(
	path: string,
	config: RequireOrgIdOrCloudId,
	query: URLSearchParams = new URLSearchParams(),
	anchor?: string,
): string {
	if (config.cloudId) {
		query.set('cloudId', config.cloudId);
	}

	const pathWithLeadingSlash = path.startsWith('/') ? path : `/${path}`;
	const pathWithPeoplePrefix = pathWithLeadingSlash.startsWith('/people')
		? pathWithLeadingSlash
		: `/people${pathWithLeadingSlash}`;
	const pathWithoutPeoplePrefix = pathWithLeadingSlash.startsWith('/people')
		? pathWithLeadingSlash.replace(/^\/people\//, '/')
		: pathWithLeadingSlash;

	// URLSearchParams.size doesn't work in jest
	const queryString = [...new Set(query.keys())].length > 0 ? `?${query.toString()}` : '';

	// Home & therefore the Teams app, is not deployed to FedRamp, instead we have deployed Standalone directory.
	// At some point, likely both Commercial & FedRamp will follow the same URL convention and we can remove this,
	// but for now, we need to generate a different URL for FedRamp.
	if (isFedRamp()) {
		// We can't use getATLContextUrl here as the URL doesn't yet exist in commercial. When it does, we should properly define it there.
		return `https://teams${
			isFedRampStaging() ? '.stg' : ''
		}.atlassian-us-gov-mod.com${pathWithoutPeoplePrefix}${
			anchor ? `#${anchor}` : ''
		}${queryString}`;
	}

	const orgIdString = config.orgId ? `/o/${config.orgId}` : '';

	if (isIsolatedCloud()) {
		return `${getUrlForDomainInContext(
			'home',
			getEnvironment(),
		)}${orgIdString}${pathWithPeoplePrefix}${anchor ? `#${anchor}` : ''}${queryString}`;
	}

	return `${getATLContextUrl('home')}${orgIdString}${pathWithPeoplePrefix}${
		anchor ? `#${anchor}` : ''
	}${queryString}`;
}
