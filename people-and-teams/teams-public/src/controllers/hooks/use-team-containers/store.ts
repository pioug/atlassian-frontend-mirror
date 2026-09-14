import { createStore, type Store } from 'react-sweet-state';

import { actions } from './actions';
import { initialConnectedTeamsState } from './initial-connected-teams-state';
import type { TeamContainersState } from './team-containers-state';

const initialState: TeamContainersState = {
	teamContainers: [],
	loading: true,
	hasLoaded: false,
	error: null,
	unlinkError: null,
	teamId: null,
	connectedTeams: initialConnectedTeamsState,
};

export const TeamContainersStore: Store<TeamContainersState, typeof actions> = createStore<
	TeamContainersState,
	typeof actions
>({
	initialState,
	actions,
	name: 'teamContainersStore',
});
