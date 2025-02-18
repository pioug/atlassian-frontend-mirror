import { useEffect } from 'react';

import { type Action, createHook, createStore } from 'react-sweet-state';

import { teamsClient } from '../../../services';
import { type TeamContainers } from '../../../services/types';

type State = {
	teamContainers: TeamContainers;
	loading: boolean;
	error: Error | null;
};

type Actions = typeof actions;

const initialState: State = {
	teamContainers: [],
	loading: true,
	error: null,
};

const actions = {
	fetchTeamContainers:
		(teamId: string): Action<State> =>
		async ({ setState }) => {
			setState({ loading: true, error: null });
			try {
				const containers = await teamsClient.getTeamContainers(teamId);
				setState({ teamContainers: containers, loading: false, error: null });
			} catch (err) {
				setState({ teamContainers: [], error: err as Error, loading: false });
			}
		},
};

const Store = createStore<State, Actions>({
	initialState,
	actions,
	name: 'teamContainersStore',
});

export const useTeamContainersHook = createHook(Store);

export const useTeamContainers = (teamId: string) => {
	const [state, actions] = useTeamContainersHook();

	useEffect(() => {
		actions.fetchTeamContainers(teamId);
	}, [teamId, actions]);

	return state;
};
