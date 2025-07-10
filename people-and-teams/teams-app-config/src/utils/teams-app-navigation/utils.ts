import type React from 'react';

import { getATLContextUrl, isFedRamp } from '@atlaskit/atlassian-context';
import { fg } from '@atlaskit/platform-feature-flags';

import { hostname, openInNewTab, origin, pathname, redirect } from '../../common/utils';

import type { NavigationAction, NavigationActionCommon } from './types';

export function generatePath(
	path: string,
	config: Pick<NavigationActionCommon, 'orgId' | 'cloudId' | 'hostProduct' | 'userHasNav4Enabled'>,
	query: URLSearchParams = new URLSearchParams(),
	anchor?: string,
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
			return `https://teams${isFedRampStaging() ? '.stg' : ''}.atlassian-us-gov.com/${path}${anchor ? `#${anchor}` : ''}${queryString}`;
		}

		const orgIdString = config.orgId ? `/o/${config.orgId}` : '';

		return `${getATLContextUrl('home')}${orgIdString}/people/${path}${anchor ? `#${anchor}` : ''}${queryString}`;
	}
	const queryString = [...new Set(query.keys())].length > 0 ? `?${query.toString()}` : '';
	return `${origin()}/${config.hostProduct === 'confluence' ? 'wiki' : 'jira'}/people/${path}${queryString}`;
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

function stripAriFromId(id: string): string {
	// Return everything after the last slash
	return id.split('/').pop() || '';
}

type PathAndQuery = {
	path: string;
	query?: URLSearchParams;
	anchor?: string;
};

export function getPathAndQuery(action: NavigationAction): PathAndQuery {
	switch (action.type) {
		case 'LANDING':
		case 'DIRECTORY':
			return { path: '' };
		case 'USER':
			return { path: `${stripAriFromId(action.payload.userId)}`, anchor: action.payload.section };
		case 'TEAM':
			return { path: `team/${stripAriFromId(action.payload.teamId)}` };
		case 'AGENT':
			return { path: `agent/${stripAriFromId(action.payload.agentId)}` };
		case 'KUDOS':
			return { path: `kudos/${stripAriFromId(action.payload.kudosId)}` };
		case 'TEAMS_DIRECTORY':
			return { path: '', query: new URLSearchParams({ screen: 'SEARCH_TEAMS' }) };
		case 'PEOPLE_DIRECTORY':
			return { path: `search/people`, query: new URLSearchParams(action.payload.query) };
		case 'USER_WORK':
			return { path: `${stripAriFromId(action.payload.userId)}/work` };
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
	return config.userHasNav4Enabled === undefined ? true : config.userHasNav4Enabled;
}

export function getHostProductFromPath() {
	const path = pathname();
	if (path.startsWith('/wiki')) {
		return 'confluence';
	}
	if (path.startsWith('/jira')) {
		return 'jira';
	}
	if (hostname().startsWith('home')) {
		return 'home';
	}
	return undefined;
}
