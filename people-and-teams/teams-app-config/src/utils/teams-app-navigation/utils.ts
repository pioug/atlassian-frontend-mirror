import React from 'react';

import { getATLContextUrl, isFedRamp } from '@atlaskit/atlassian-context';
import { fg } from '@atlaskit/platform-feature-flags';

import { hostname, openInNewTab, redirect } from '../../common/utils';

import type { NavigationAction, NavigationActionCommon } from './types';

export function generatePath(
	path: string,
	config: Pick<NavigationActionCommon, 'orgId' | 'cloudId' | 'hostProduct'>,
	query: URLSearchParams = new URLSearchParams(),
) {
	if (
		fg('should-redirect-directory-to-teams-app') ||
		config.hostProduct === 'home' ||
		!config.hostProduct
	) {
		query.set('cloudId', config.cloudId);

		// Home & therefore the Teams app, is not deployed to FedRamp, instead we have deployed Standalone directory.
		// At some point, likely both Commercial & FedRamp will follow the same URL convention and we can remove this,
		// but for now, we need to generate a different URL for FedRamp.
		if (isFedRamp()) {
			// We can't use getATLContextUrl here as the URL doesn't yet exist in commercial. When it does, we should properly define it there.
			return `https://teams${isFedRampStaging() ? '.stg' : ''}.atlassian-us-gov.com/${path}?${query.toString()}`;
		}

		return `${getATLContextUrl('home')}/o/${config.orgId}/people/${path}?${query.toString()}`;
	}
	return `${getATLContextUrl(config.hostProduct)}/people/${path}${query.size > 0 ? `?${query.toString()}` : ''}`;
}

export const onNavigateBase =
	(href: string, config: NavigationActionCommon) =>
	(e?: React.MouseEvent | React.KeyboardEvent) => {
		if (e) {
			e.preventDefault();
		}

		if (fg('should-redirect-directory-to-teams-app')) {
			if (config.shouldOpenInSameTab) {
				redirect(href);
				return;
			}
			openInNewTab(href);
			return;
		} else {
			if (config.shouldOpenInSameTab) {
				if (config.push) {
					config.push(href);
					return;
				}
				redirect(href);
				return;
			} else {
				openInNewTab(href);
				return;
			}
		}
	};

type PathAndQuery = {
	path: string;
	query?: URLSearchParams;
};

export function getPathAndQuery(action: NavigationAction): PathAndQuery {
	switch (action.type) {
		case 'LANDING':
		case 'DIRECTORY':
			return { path: '' };
		case 'USER':
			return { path: `${action.payload.userId}` };
		case 'TEAM':
			return { path: `team/${action.payload.teamId}` };
		case 'AGENT':
			return { path: `agent/${action.payload.agentId}` };
		case 'KUDOS':
			return { path: `kudos/${action.payload.kudosId}` };
		default:
			return { path: '' };
	}
}

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
	return false;
}
