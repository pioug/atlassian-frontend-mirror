import { useEffect } from 'react';

import { type Action, createHook, createStore } from 'react-sweet-state';

import { type TeamContainer } from '../../../common/types';
import { teamsClient } from '../../../services';
import {
	type TeamContainers,
	TeamWithMemberships,
	type UnlinkContainerMutationError,
} from '../../../services/types';

type ConnectedTeams = {
	containerId: string | undefined;
	isLoading: boolean;
	hasLoaded: boolean;
	teams: TeamWithMemberships[] | undefined;
	error: Error | null;
};

type State = {
	teamContainers: TeamContainers;
	loading: boolean;
	error: Error | null;
	unlinkError: UnlinkContainerMutationError | null;
	teamId: string | null;
	connectedTeams: ConnectedTeams;
};

type Actions = typeof actions;

const initialConnectedTeamsState = {
	containerId: undefined,
	isLoading: false,
	hasLoaded: false,
	teams: undefined,
	error: null,
};

const initialState: State = {
	teamContainers: [],
	loading: true,
	error: null,
	unlinkError: null,
	teamId: null,
	connectedTeams: initialConnectedTeamsState,
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
	fetchConnectedTeams:
		(containerId: string): Action<State> =>
		async ({ setState, getState }) => {
			const {
				connectedTeams: { containerId: currentContainerId },
			} = getState();
			if (currentContainerId === containerId) {
				return;
			}
			setState({
				connectedTeams: {
					containerId,
					isLoading: true,
					hasLoaded: false,
					teams: undefined,
					error: null,
				},
			});
			try {
				const teams = await teamsClient.getConnectedTeams(containerId);
				setState({
					connectedTeams: {
						containerId,
						isLoading: false,
						hasLoaded: true,
						teams,
						error: null,
					},
				});
			} catch (e) {
				setState({
					connectedTeams: {
						containerId,
						isLoading: false,
						hasLoaded: false,
						teams: [],
						error: e as Error,
					},
				});
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
					const { teamContainers, connectedTeams } = getState();
					const newContainers = teamContainers.filter((container) => container.id !== containerId);
					if (connectedTeams.containerId === containerId) {
						setState({ teamContainers: newContainers, connectedTeams: initialConnectedTeamsState });
					} else {
						setState({ teamContainers: newContainers });
					}
				}
			} catch (err) {
				setState({ unlinkError: err as Error });
			}
		},
	addTeamContainer:
		(teamContainer: TeamContainer): Action<State> =>
		async ({ setState, getState }) => {
			const { teamContainers, connectedTeams } = getState();
			const containerExists = teamContainers.some((container) => container.id === teamContainer.id);

			if (containerExists) {
				return;
			}
			if (connectedTeams.containerId === teamContainer.id) {
				setState({
					teamContainers: [...teamContainers, teamContainer],
					connectedTeams: initialConnectedTeamsState,
				});
			} else {
				setState({
					teamContainers: [...teamContainers, teamContainer],
				});
			}
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

export const useConnectedTeams = () => {
	const [state, actions] = useTeamContainersHook();

	return { ...state.connectedTeams, fetchConnectedTeams: actions.fetchConnectedTeams };
};
