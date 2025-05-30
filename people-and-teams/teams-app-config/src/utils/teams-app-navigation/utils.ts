import React from 'react';

import { getATLContextUrl, isFedRamp } from '@atlaskit/atlassian-context';
import { fg } from '@atlaskit/platform-feature-flags';

import { hostname, openInNewTab, redirect } from '../../common/utils';

import type { NavigationAction, NavigationActionCommon } from './types';

export function generatePath(
	path: string,
	config: Pick<NavigationActionCommon, 'orgId' | 'cloudId' | 'hostProduct' | 'userHasNav4Enabled'>,
	query: URLSearchParams = new URLSearchParams(),
) {
	if (isTeamsAppEnabled(config) || config.hostProduct === 'home' || !config.hostProduct) {
		if (config.cloudId) {
			query.set('cloudId', config.cloudId);
		}

		// URLSearchParams.size doesn't work in jest
		const queryString = [...new Set(query.keys())].length > 0 ? `?${query.toString()}` : '';

		// Home & therefore the Teams app, is not deployed to FedRamp, instead we have deployed Standalone directory.
		// At some point, likely both Commercial & FedRamp will follow the same URL convention and we can remove this,
		// but for now, we need to generate a different URL for FedRamp.
		if (isFedRamp()) {
			// We can't use getATLContextUrl here as the URL doesn't yet exist in commercial. When it does, we should properly define it there.
			return `https://teams${isFedRampStaging() ? '.stg' : ''}.atlassian-us-gov.com/${path}${queryString}`;
		}

		const orgIdString = config.orgId ? `/o/${config.orgId}` : '';

		return `${getATLContextUrl('home')}${orgIdString}/people/${path}${queryString}`;
	}
	const queryString = [...new Set(query.keys())].length > 0 ? `?${query.toString()}` : '';
	return `${getATLContextUrl(config.hostProduct)}/people/${path}${queryString}`;
}

export const onNavigateBase =
	(href: string, config: NavigationActionCommon) =>
	(e?: React.MouseEvent | React.KeyboardEvent) => {
		if (e) {
			e.preventDefault();
		}

		if (isTeamsAppEnabled(config)) {
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

export function isTeamsAppEnabled(config: Pick<NavigationActionCommon, 'userHasNav4Enabled'>) {
	if (!fg('should-redirect-directory-to-teams-app')) {
		// This is the base switch, without it, teams app is not enabled
		return false;
	}

	if (isFedRamp()) {
		// In FedRamp, we are ignoring the Nav4 dependency
		return true;
	}

	// We have a hard dependency on Nav4 being enabled in order to use the teams app
	return config.userHasNav4Enabled;
}
