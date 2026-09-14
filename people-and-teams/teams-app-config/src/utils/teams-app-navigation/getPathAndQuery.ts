import type { NavigationAction } from '../../common/types';

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
			return { path: '', query: new URLSearchParams({ screen: 'SEARCH_PEOPLE' }) };
		case 'USER_WORK':
			return { path: `${stripAriFromId(action.payload.userId)}/work` };
		case 'CURRENT_USER_PROFILE':
			return { path: 'me' };
		default:
			return { path: '' };
	}
}
