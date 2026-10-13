import type { TeamWithMemberships } from '@atlaskit/teams-client/membership';

import { useConnectedTeams as useConnectedTeamsMulti } from './use-connected-teams-2';

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
	return useConnectedTeamsMulti(teamId || '');
};
