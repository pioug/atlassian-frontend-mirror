import { useCallback, useEffect } from 'react';

import { type Action, createHook, createStore } from 'react-sweet-state';

import { fg } from '@atlaskit/platform-feature-flags';
import { useAnalyticsEvents } from '@atlaskit/teams-app-internal-analytics';
import { teamsClient } from '@atlaskit/teams-client';
import type {
	TeamContainers,
	TeamWithMemberships,
	UnlinkContainerMutationError,
} from '@atlaskit/teams-client/types';

import { type TeamContainer } from '../../../common/types';

import { useConnectedTeams as useConnectedTeamsMulti, useTeamContainers as useTeamContainersMulti } from './multi-team';

type ConnectedTeams = {
	containerId: string | undefined;
	isLoading: boolean;
	hasLoaded: boolean;
	teams: TeamWithMemberships[] | undefined;
	error: Error | null;
	numberOfTeams: number | undefined;
};

type State = {
	teamContainers: TeamContainers;
	loading: boolean;
	hasLoaded: boolean;
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
	numberOfTeams: undefined,
};

const initialState: State = {
	teamContainers: [],
	loading: true,
	hasLoaded: false,
	error: null,
	unlinkError: null,
	teamId: null,
	connectedTeams: initialConnectedTeamsState,
};

function containersEqual<T extends { id: string }>(arr1: T[], arr2: T[]) {
	const sortById = (a: T, b: T) => a.id.localeCompare(b.id);
	return JSON.stringify([...arr1].sort(sortById)) === JSON.stringify([...arr2].sort(sortById));
}

const actions = {
	fetchTeamContainers:
		(
			teamId: string,
			fireAnalytics: ReturnType<typeof useAnalyticsEvents>['fireEvent'],
		): Action<State> =>
		async ({ setState, getState }) => {
			const { teamId: currentTeamId } = getState();
			if (currentTeamId === teamId) {
				return;
			}
			setState({ loading: true, error: null, teamContainers: [], teamId, hasLoaded: false });
			try {
				const containers = await teamsClient.getTeamContainers(teamId);
				fireAnalytics('operational.fetchTeamContainers.succeeded', {
					teamId,
				});
				setState({ teamContainers: containers, loading: false, error: null, hasLoaded: true });
			} catch (err) {
				fireAnalytics('operational.fetchTeamContainers.failed', {
					teamId,
					error: {
						message: (err as Error).message || JSON.stringify(err),
						stack: (err as Error).stack,
					},
				});
				setState({ teamContainers: [], error: err as Error, loading: false, hasLoaded: true });
			}
		},
	refetchTeamContainers:
		(fireAnalytics: ReturnType<typeof useAnalyticsEvents>['fireEvent']): Action<State> =>
		async ({ setState, getState }) => {
			const { teamId } = getState();
			if (!teamId) {
				return;
			}
			try {
				const containers = await teamsClient.getTeamContainers(teamId);

				fireAnalytics('operational.refetchTeamContainers.succeeded', {
					teamId,
				});
				// optimisation to avoid unnecessary state updates
				if (!containersEqual(containers, getState().teamContainers)) {
					setState({ teamContainers: containers, loading: false, error: null, hasLoaded: true });
				}
			} catch (err) {
				fireAnalytics('operational.refetchTeamContainers.failed', {
					teamId,
					error: {
						message: (err as Error).message || JSON.stringify(err),
						stack: (err as Error).stack,
					},
				});
				setState({
					teamContainers: getState().teamContainers,
					error: err as Error,
					loading: false,
					hasLoaded: true,
				});
			}
		},
	fetchNumberOfConnectedTeams:
		(
			containerId: string,
			fireAnalytics: ReturnType<typeof useAnalyticsEvents>['fireEvent'],
		): Action<State> =>
		async ({ setState, getState }) => {
			const {
				connectedTeams: { containerId: currentContainerId },
			} = getState();
			if (currentContainerId === containerId) {
				return;
			}
			setState({
				connectedTeams: {
					...initialConnectedTeamsState,
					containerId,
					numberOfTeams: undefined,
				},
			});
			try {
				const numberOfTeams = await teamsClient.getNumberOfConnectedTeams(containerId);
				fireAnalytics('operational.fetchNumberOfConnectedTeams.succeeded', {
					numberOfTeams,
					containerId,
				});
				setState({
					connectedTeams: {
						...initialConnectedTeamsState,
						containerId,
						numberOfTeams,
					},
				});
			} catch (e) {
				fireAnalytics('operational.fetchNumberOfConnectedTeams.failed', {
					numberOfTeams: initialConnectedTeamsState.numberOfTeams || null,
					containerId,
					error: {
						message: (e as Error).message || JSON.stringify(e),
						stack: (e as Error).stack,
					},
				});

				setState({
					connectedTeams: {
						...initialConnectedTeamsState,
						containerId,
						error: e as Error,
					},
				});
			}
		},
	fetchConnectedTeams:
		(
			containerId: string,
			fireAnalytics: ReturnType<typeof useAnalyticsEvents>['fireEvent'],
		): Action<State> =>
		async ({ setState, getState }) => {
			const {
				connectedTeams: { containerId: currentContainerId, numberOfTeams, hasLoaded },
			} = getState();
			if (currentContainerId === containerId && hasLoaded) {
				return;
			}
			setState({
				connectedTeams: {
					containerId,
					isLoading: true,
					hasLoaded: false,
					teams: undefined,
					error: null,
					numberOfTeams,
				},
			});
			try {
				const teams = await teamsClient.getConnectedTeams(containerId);
				fireAnalytics('operational.fetchConnectedTeams.succeeded', {
					numberOfTeams: numberOfTeams || null,
					containerId,
				});
				setState({
					connectedTeams: {
						containerId,
						isLoading: false,
						hasLoaded: true,
						teams,
						error: null,
						numberOfTeams,
					},
				});
			} catch (e) {
				fireAnalytics('operational.fetchConnectedTeams.failed', {
					numberOfTeams: numberOfTeams || null,
					containerId,
					error: {
						message: (e as Error).message || JSON.stringify(e),
						stack: (e as Error).stack,
					},
				});
				setState({
					connectedTeams: {
						containerId,
						isLoading: false,
						hasLoaded: false,
						teams: [],
						error: e as Error,
						numberOfTeams,
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
	const useMultiTeam = fg('enable_multi_team_containers_state');
	const multiTeamResult = useTeamContainersMulti(teamId, useMultiTeam ? enable : false);
	const { fireEvent } = useAnalyticsEvents();

	useEffect(() => {
		if (enable && !useMultiTeam) {
			actions.fetchTeamContainers(teamId, fireEvent);
		}
	}, [teamId, actions, enable, fireEvent, useMultiTeam]);

	const refetchTeamContainers = useCallback(
		async (): Promise<void> => actions.refetchTeamContainers(fireEvent),
		[actions, fireEvent],
	);

	if (useMultiTeam) {
		return multiTeamResult;
	}

	return {
		...state,
		addTeamContainer: actions.addTeamContainer,
		unlinkTeamContainers: (containerId: string) =>
			actions.unlinkTeamContainers(teamId, containerId),
		refetchTeamContainers,
	};
};

export const useConnectedTeams = (teamId?: string) => {
	const [state, actions] = useTeamContainersHook();
	const useMultiTeam = fg('enable_multi_team_containers_state');
	const multiTeamResult = useConnectedTeamsMulti(useMultiTeam ? (teamId || '') : '');

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
