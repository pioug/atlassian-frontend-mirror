import { useCallback, useEffect } from 'react';

import { type Action, createHook, createStore } from 'react-sweet-state';

import { useAnalyticsEvents } from '@atlaskit/analytics-next';

import { type TeamContainer } from '../../../common/types';
import { AnalyticsAction, usePeopleAndTeamAnalytics } from '../../../common/utils/analytics';
import { teamsClient } from '../../../services';
import {
	type TeamContainers,
	type TeamWithMemberships,
	type UnlinkContainerMutationError,
} from '../../../services/types';

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

type FireAnalyticsProps = {
	action: string;
	actionSubject: string;
	containerId: string;
	numberOfTeams?: number;
	error?: Error;
};

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

const actions = {
	fetchTeamContainers:
		(
			teamId: string,
			fireAnalytics: (action: string, actionSubject: string, error?: Error) => void,
		): Action<State> =>
		async ({ setState, getState }) => {
			const { teamId: currentTeamId } = getState();
			if (currentTeamId === teamId) {
				return;
			}
			setState({ loading: true, error: null, teamContainers: [], teamId, hasLoaded: false });
			try {
				const containers = await teamsClient.getTeamContainers(teamId);
				fireAnalytics(AnalyticsAction.SUCCEEDED, 'fetchTeamContainers');
				setState({ teamContainers: containers, loading: false, error: null, hasLoaded: true });
			} catch (err) {
				fireAnalytics(AnalyticsAction.FAILED, 'fetchTeamContainers', err as Error);
				setState({ teamContainers: [], error: err as Error, loading: false, hasLoaded: true });
			}
		},
	fetchNumberOfConnectedTeams:
		(containerId: string, fireAnalytics: (props: FireAnalyticsProps) => void): Action<State> =>
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
				fireAnalytics({
					action: AnalyticsAction.SUCCEEDED,
					actionSubject: 'fetchNumberOfConnectedTeams',
					containerId,
					numberOfTeams,
				});
				setState({
					connectedTeams: {
						...initialConnectedTeamsState,
						containerId,
						numberOfTeams,
					},
				});
			} catch (e) {
				fireAnalytics({
					action: AnalyticsAction.FAILED,
					actionSubject: 'fetchNumberOfConnectedTeams',
					containerId,
					numberOfTeams: initialConnectedTeamsState.numberOfTeams,
					error: e as Error,
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
		(containerId: string, fireAnalytics: (props: FireAnalyticsProps) => void): Action<State> =>
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
				fireAnalytics({
					action: AnalyticsAction.SUCCEEDED,
					actionSubject: 'fetchConnectedTeams',
					containerId,
					numberOfTeams,
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
				fireAnalytics({
					action: AnalyticsAction.FAILED,
					actionSubject: 'fetchConnectedTeams',
					containerId,
					numberOfTeams,
					error: e as Error,
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
	const { fireOperationalEvent } = usePeopleAndTeamAnalytics();
	const { createAnalyticsEvent } = useAnalyticsEvents();

	const fireOperationalAnalytics = useCallback(
		(action: string, actionSubject: string, error?: Error) => {
			fireOperationalEvent(createAnalyticsEvent, {
				action: action,
				actionSubject: actionSubject,
				attributes: {
					teamId,
					...(error && {
						error: {
							message: error.message || JSON.stringify(error),
							stack: error.stack,
						},
					}),
				},
			});
		},
		[fireOperationalEvent, createAnalyticsEvent, teamId],
	);

	useEffect(() => {
		if (enable) {
			actions.fetchTeamContainers(teamId, fireOperationalAnalytics);
		}
	}, [teamId, actions, enable, fireOperationalAnalytics]);

	return {
		...state,
		addTeamContainer: actions.addTeamContainer,
		unlinkTeamContainers: (containerId: string) =>
			actions.unlinkTeamContainers(teamId, containerId),
	};
};

export const useConnectedTeams = () => {
	const [state, actions] = useTeamContainersHook();
	const { fireOperationalEvent } = usePeopleAndTeamAnalytics();
	const { createAnalyticsEvent } = useAnalyticsEvents();

	const fireOperationalAnalytics = useCallback(
		({ action, actionSubject, containerId, numberOfTeams, error }: FireAnalyticsProps) => {
			fireOperationalEvent(createAnalyticsEvent, {
				action: action,
				actionSubject: actionSubject,
				attributes: {
					containerId,
					numberOfTeams,
					...(error && {
						error: {
							message: error.message || JSON.stringify(error),
							stack: error.stack,
						},
					}),
				},
			});
		},
		[fireOperationalEvent, createAnalyticsEvent],
	);

	return {
		...state.connectedTeams,
		fetchNumberOfConnectedTeams: (containerId: string) =>
			actions.fetchNumberOfConnectedTeams(containerId, fireOperationalAnalytics),
		fetchConnectedTeams: (containerId: string) =>
			actions.fetchConnectedTeams(containerId, fireOperationalAnalytics),
	};
};
