import type { ConnectedTeams } from './connected-teams';

export const initialConnectedTeamsState: ConnectedTeams = {
	containerId: undefined,
	isLoading: false,
	hasLoaded: false,
	teams: undefined,
	error: null,
	numberOfTeams: undefined,
};
