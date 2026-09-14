import type { TeamWithMemberships } from '@atlaskit/teams-client/membership';

export type ConnectedTeams = {
	containerId: string | undefined;
	isLoading: boolean;
	hasLoaded: boolean;
	teams: TeamWithMemberships[] | undefined;
	error: Error | null;
	numberOfTeams: number | undefined;
};
