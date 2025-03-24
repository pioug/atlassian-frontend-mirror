import { useEffect } from 'react';

import { type Action, createHook, createStore } from 'react-sweet-state';

import { type TeamContainer } from '../../../common/types';
import { teamsClient } from '../../../services';
import { type TeamContainers, type UnlinkContainerMutationError } from '../../../services/types';

type State = {
	teamContainers: TeamContainers;
	loading: boolean;
	error: Error | null;
	unlinkError: UnlinkContainerMutationError | null;
	teamId: string | null;
};

type Actions = typeof actions;

const initialState: State = {
	teamContainers: [],
	loading: true,
	error: null,
	unlinkError: null,
	teamId: null,
};

const actions = {
	fetchTeamContainers:
		(teamId: string): Action<State> =>
		async ({ setState, getState }) => {
			const { teamId: currentTeamId } = getState();
			if (currentTeamId === teamId) {
				return;
			}
			setState({ loading: true, error: null, teamContainers: [], teamId });
			try {
				const containers = await teamsClient.getTeamContainers(teamId);
				setState({ teamContainers: containers, loading: false, error: null });
			} catch (err) {
				setState({ teamContainers: [], error: err as Error, loading: false });
			}
		},
	unlinkTeamContainers:
		(teamId: string, containerId: string): Action<State> =>
		async ({ setState, getState }) => {
			setState({ unlinkError: null });
			try {
				const mutationResult = await teamsClient.unlinkTeamContainer(teamId, containerId);
				if (mutationResult.deleteTeamConnectedToContainer.errors.length) {
					// Just handle 1 error at a time should be suffcient as we disconenct only 1 container at a time
					setState({
						unlinkError: mutationResult.deleteTeamConnectedToContainer.errors[0],
					});
				} else {
					const { teamContainers } = getState();
					const newContainers = teamContainers.filter((container) => container.id !== containerId);
					setState({ teamContainers: newContainers });
				}
			} catch (err) {
				setState({ unlinkError: err as Error });
			}
		},
	addTeamContainer:
		(teamContainer: TeamContainer): Action<State> =>
		async ({ setState, getState }) => {
			const { teamContainers } = getState();
			const containerExists = teamContainers.some((container) => container.id === teamContainer.id);
			if (containerExists) {
				return;
			}

			setState({ teamContainers: [teamContainer, ...teamContainers] });
		},
};

const Store = createStore<State, Actions>({
	initialState,
	actions,
	name: 'teamContainersStore',
});

export const useTeamContainersHook = createHook(Store);

export const useTeamContainers = (teamId: string, enable = true) => {
	const [state, actions] = useTeamContainersHook();

	useEffect(() => {
		if (enable) {
			actions.fetchTeamContainers(teamId);
		}
	}, [teamId, actions, enable]);

	return { ...state, addTeamContainer: actions.addTeamContainer };
};
