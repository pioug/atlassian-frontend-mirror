import type React from 'react';

import { getATLContextUrl, isFedRamp } from '@atlaskit/atlassian-context';
import { fg } from '@atlaskit/platform-feature-flags';

import type {
	NavigationAction,
	NavigationActionCommon,
	RequireOrgIdOrCloudId,
} from '../../common/types';
import { hostname, openInNewTab, origin, pathname, redirect } from '../../common/utils';
import { isTeamsAppEnabled } from '../../common/utils/is-teams-app-enabled';

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
		return `https://teams${isFedRampStaging() ? '.stg' : ''}.atlassian-us-gov-mod.com${pathWithoutPeoplePrefix}${anchor ? `#${anchor}` : ''}${queryString}`;
	}

	const orgIdString = config.orgId ? `/o/${config.orgId}` : '';

	return `${getATLContextUrl('home')}${orgIdString}${pathWithPeoplePrefix}${anchor ? `#${anchor}` : ''}${queryString}`;
}

export function generatePath(
	path: string,
	config: Pick<NavigationActionCommon, 'hostProduct' | 'userHasNav4Enabled'> &
		RequireOrgIdOrCloudId,
	query: URLSearchParams = new URLSearchParams(),
	anchor?: string,
): string {
	if (isTeamsAppEnabled(config) || config.hostProduct === 'home' || !config.hostProduct) {
		return generateTeamsAppPath(path, config, query, anchor);
	}
	const queryString = [...new Set(query.keys())].length > 0 ? `?${query.toString()}` : '';
	return `${origin()}/${config.hostProduct === 'confluence' ? 'wiki' : 'jira'}/people/${path}${queryString}`;
}

export const onNavigateBase =
	(href: string, config: NavigationActionCommon) =>
	(e?: React.MouseEvent | React.KeyboardEvent): void => {
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
	return id.includes('/') ? id.split('/').pop() || '' : id;
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
			// Safety check for undefined userId, just redirect to the landing page as the profile redirect will fail
			if (!action.payload?.userId) {
				return { path: '' };
			}
			return { path: `${stripAriFromId(action.payload.userId)}`, anchor: action.payload.section };
		case 'TEAM':
			// Safety check for undefined teamId, just redirect to the landing page as the team redirect will fail
			if (!action.payload?.teamId) {
				return { path: '' };
			}
			return { path: `team/${stripAriFromId(action.payload.teamId)}` };
		case 'AGENT':
			// Safety check for undefined agentId, just redirect to the landing page as the agent redirect will fail
			if (!action.payload?.agentId) {
				return { path: '' };
			}
			return { path: `agent/${stripAriFromId(action.payload.agentId)}` };
		case 'KUDOS':
			// Safety check for undefined kudosId, just redirect to the landing page as the kudos redirect will fail
			if (!action.payload?.kudosId) {
				return { path: '' };
			}
			return { path: `kudos/${stripAriFromId(action.payload.kudosId)}` };
		case 'TEAMS_DIRECTORY':
			return { path: '', query: new URLSearchParams({ screen: 'SEARCH_TEAMS' }) };
		case 'PEOPLE_DIRECTORY':
			if (fg('enable_teams_app_breadcrumb_respect_directories')) {
				return { path: '', query: new URLSearchParams({ screen: 'SEARCH_PEOPLE' }) };
			}
			return { path: `search/people`, query: new URLSearchParams(action.payload.query) };
		case 'USER_WORK':
			return { path: `${stripAriFromId(action.payload.userId)}/work` };
		case 'CURRENT_USER_PROFILE':
			return { path: 'me' };
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

	// *.atlassian-stg-fedm.net
	if (host.match(/atlassian-stg-fedm\.net/) && fg('teams-app-fedramp-stg-fedm-hostname-support')) {
		return true;
	}

	return false;
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
