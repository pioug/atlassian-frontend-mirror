import { initialConnectedTeamsState } from './initial-connected-teams-state';
import type { TeamState } from './team-state';

export const getInitialTeamState = (): TeamState => ({
	teamContainers: [],
	loading: false,
	hasLoaded: false,
	error: null,
	unlinkError: null,
	teamId: null,
	connectedTeams: initialConnectedTeamsState,
});
