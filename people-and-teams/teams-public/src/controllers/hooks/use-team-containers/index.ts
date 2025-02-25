import { useEffect } from 'react';

import { type Action, createHook, createStore } from 'react-sweet-state';

import { teamsClient } from '../../../services';
import { type TeamContainers, type UnlinkContainerMutationError } from '../../../services/types';

type State = {
	teamContainers: TeamContainers;
	loading: boolean;
	error: Error | null;
	unlinkError: UnlinkContainerMutationError | null;
};

type Actions = typeof actions;

const initialState: State = {
	teamContainers: [],
	loading: true,
	error: null,
	unlinkError: null,
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
	unlinkTeamContainers:
		(teamId: string, containerId: string): Action<State> =>
		async ({ setState, dispatch }) => {
			setState({ unlinkError: null });
			try {
				const mutationResult = await teamsClient.unlinkTeamContainer(teamId, containerId);
				if (mutationResult.deleteTeamConnectedToContainer.errors.length) {
					// Just handle 1 error at a time should be suffcient as we disconenct only 1 container at a time
					setState({
						unlinkError: mutationResult.deleteTeamConnectedToContainer.errors[0],
					});
				} else {
					dispatch(actions.fetchTeamContainers(teamId));
				}
			} catch (err) {
				setState({ unlinkError: err as Error });
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
