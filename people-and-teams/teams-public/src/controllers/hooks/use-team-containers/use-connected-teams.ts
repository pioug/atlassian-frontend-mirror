import { fg } from '@atlaskit/platform-feature-flags/fg';
import { useAnalyticsEvents } from '@atlaskit/teams-app-internal-analytics/use-analytics-events';
import type { TeamWithMemberships } from '@atlaskit/teams-client/membership';

import { useConnectedTeams as useConnectedTeamsMulti } from './use-connected-teams-2';
import { useTeamContainersHook } from './use-team-containers-hook';

export const useConnectedTeams = (
	teamId?: string,
): {
	fetchNumberOfConnectedTeams: (containerId: string) => void | Promise<void>;
	fetchConnectedTeams: (containerId: string) => void | Promise<void>;
	containerId: string | undefined;
	isLoading: boolean;
	hasLoaded: boolean;
	teams: TeamWithMemberships[] | undefined;
	error: Error | null;
	numberOfTeams: number | undefined;
} => {
	const [state, actions] = useTeamContainersHook();
	const useMultiTeam = fg('enable_multi_team_containers_state');
	const multiTeamResult = useConnectedTeamsMulti(useMultiTeam ? teamId || '' : '');

	const { fireEvent } = useAnalyticsEvents();

	if (useMultiTeam) {
		return multiTeamResult;
	}

	return {
		...state.connectedTeams,
		fetchNumberOfConnectedTeams: (containerId: string) =>
			actions.fetchNumberOfConnectedTeams(containerId, fireEvent),
		fetchConnectedTeams: (containerId: string) =>
			actions.fetchConnectedTeams(containerId, fireEvent),
	};
};
