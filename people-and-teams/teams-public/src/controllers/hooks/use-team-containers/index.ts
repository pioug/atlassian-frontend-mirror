import { useCallback, useEffect } from 'react';

import { type Action, createHook, createStore } from 'react-sweet-state';

import { useAnalyticsEvents } from '@atlaskit/analytics-next';
import { fg } from '@atlaskit/platform-feature-flags';
import { useAnalyticsEvents as useAnalyticsEventsNext } from '@atlaskit/teams-app-internal-analytics';
import { teamsClient as externalTeamsClient } from '@atlaskit/teams-client';

import { type TeamContainer } from '../../../common/types';
import { AnalyticsAction, usePeopleAndTeamAnalytics } from '../../../common/utils/analytics';
import { teamsClient } from '../../../services';
import type { UnlinkContainerMutationError } from '../../../services/agg-client/utils/mutations/unlink-container-mutation';
import { type TeamContainers, type TeamWithMemberships } from '../../../services/types';

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

function containersEqual<T extends { id: string }>(arr1: T[], arr2: T[]) {
	const sortById = (a: T, b: T) => a.id.localeCompare(b.id);
	return JSON.stringify([...arr1].sort(sortById)) === JSON.stringify([...arr2].sort(sortById));
}

const actions = {
	fetchTeamContainers:
		(
			teamId: string,
			fireAnalytics: (action: string, actionSubject: string, error?: Error) => void,
			fireAnalyticsNext: ReturnType<typeof useAnalyticsEventsNext>['fireEvent'],
		): Action<State> =>
		async ({ setState, getState }) => {
			const { teamId: currentTeamId } = getState();
			if (currentTeamId === teamId) {
				return;
			}
			setState({ loading: true, error: null, teamContainers: [], teamId, hasLoaded: false });
			try {
				const containers = await (fg('enable_teams_public_migration_using_teams-client')
					? externalTeamsClient.getTeamContainers(teamId)
					: teamsClient.getTeamContainers(teamId));
				if (fg('ptc-enable-teams-public-analytics-refactor')) {
					fireAnalyticsNext('operational.fetchTeamContainers.succeeded', {
						teamId,
					});
				} else {
					fireAnalytics(AnalyticsAction.SUCCEEDED, 'fetchTeamContainers');
				}
				setState({ teamContainers: containers, loading: false, error: null, hasLoaded: true });
			} catch (err) {
				if (fg('ptc-enable-teams-public-analytics-refactor')) {
					fireAnalyticsNext('operational.fetchTeamContainers.failed', {
						teamId,
						error: {
							message: (err as Error).message || JSON.stringify(err),
							stack: (err as Error).stack,
						},
					});
				} else {
					fireAnalytics(AnalyticsAction.FAILED, 'fetchTeamContainers', err as Error);
				}
				setState({ teamContainers: [], error: err as Error, loading: false, hasLoaded: true });
			}
		},
	refetchTeamContainers:
		(
			fireAnalytics: (action: string, actionSubject: string, error?: Error) => void,
			fireAnalyticsNext: ReturnType<typeof useAnalyticsEventsNext>['fireEvent'],
		): Action<State> =>
		async ({ setState, getState }) => {
			const { teamId } = getState();
			if (!teamId) {
				return;
			}
			try {
				const containers = await (fg('enable_teams_public_migration_using_teams-client')
					? externalTeamsClient.getTeamContainers(teamId)
					: teamsClient.getTeamContainers(teamId));

				if (fg('ptc-enable-teams-public-analytics-refactor')) {
					fireAnalyticsNext('operational.refetchTeamContainers.succeeded', {
						teamId,
					});
				} else {
					fireAnalytics(AnalyticsAction.SUCCEEDED, 'refetchTeamContainers');
				}
				// optimisation to avoid unnecessary state updates
				if (!containersEqual(containers, getState().teamContainers)) {
					setState({ teamContainers: containers, loading: false, error: null, hasLoaded: true });
				}
			} catch (err) {
				if (fg('ptc-enable-teams-public-analytics-refactor')) {
					fireAnalyticsNext('operational.refetchTeamContainers.failed', {
						teamId,
						error: {
							message: (err as Error).message || JSON.stringify(err),
							stack: (err as Error).stack,
						},
					});
				} else {
					fireAnalytics(AnalyticsAction.FAILED, 'refetchTeamContainers', err as Error);
				}
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
			fireAnalytics: (props: FireAnalyticsProps) => void,
			fireAnalyticsNext: ReturnType<typeof useAnalyticsEventsNext>['fireEvent'],
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
				const numberOfTeams = await (fg('enable_teams_public_migration_using_teams-client')
					? externalTeamsClient.getNumberOfConnectedTeams(containerId)
					: teamsClient.getNumberOfConnectedTeams(containerId));
				if (fg('ptc-enable-teams-public-analytics-refactor')) {
					fireAnalyticsNext('operational.fetchNumberOfConnectedTeams.succeeded', {
						numberOfTeams,
						containerId,
					});
				} else {
					fireAnalytics({
						action: AnalyticsAction.SUCCEEDED,
						actionSubject: 'fetchNumberOfConnectedTeams',
						containerId,
						numberOfTeams,
					});
				}
				setState({
					connectedTeams: {
						...initialConnectedTeamsState,
						containerId,
						numberOfTeams,
					},
				});
			} catch (e) {
				if (fg('ptc-enable-teams-public-analytics-refactor')) {
					fireAnalyticsNext('operational.fetchNumberOfConnectedTeams.failed', {
						numberOfTeams: initialConnectedTeamsState.numberOfTeams || null,
						containerId,
						error: {
							message: (e as Error).message || JSON.stringify(e),
							stack: (e as Error).stack,
						},
					});
				} else {
					fireAnalytics({
						action: AnalyticsAction.FAILED,
						actionSubject: 'fetchNumberOfConnectedTeams',
						containerId,
						numberOfTeams: initialConnectedTeamsState.numberOfTeams,
						error: e as Error,
					});
				}

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
			fireAnalytics: (props: FireAnalyticsProps) => void,
			fireAnalyticsNext: ReturnType<typeof useAnalyticsEventsNext>['fireEvent'],
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
				const teams = await (fg('enable_teams_public_migration_using_teams-client')
					? externalTeamsClient.getConnectedTeams(containerId)
					: teamsClient.getConnectedTeams(containerId));
				if (fg('ptc-enable-teams-public-analytics-refactor')) {
					fireAnalyticsNext('operational.fetchConnectedTeams.succeeded', {
						numberOfTeams: numberOfTeams || null,
						containerId,
					});
				} else {
					fireAnalytics({
						action: AnalyticsAction.SUCCEEDED,
						actionSubject: 'fetchConnectedTeams',
						containerId,
						numberOfTeams,
					});
				}
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
				if (fg('ptc-enable-teams-public-analytics-refactor')) {
					fireAnalyticsNext('operational.fetchConnectedTeams.failed', {
						numberOfTeams: numberOfTeams || null,
						containerId,
						error: {
							message: (e as Error).message || JSON.stringify(e),
							stack: (e as Error).stack,
						},
					});
				} else {
					fireAnalytics({
						action: AnalyticsAction.FAILED,
						actionSubject: 'fetchConnectedTeams',
						containerId,
						numberOfTeams,
						error: e as Error,
					});
				}
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
				const mutationResult = await (fg('enable_teams_public_migration_using_teams-client')
					? externalTeamsClient.unlinkTeamContainer(teamId, containerId)
					: teamsClient.unlinkTeamContainer(teamId, containerId));
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
	const { fireEvent } = useAnalyticsEventsNext();

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
			actions.fetchTeamContainers(teamId, fireOperationalAnalytics, fireEvent);
		}
	}, [teamId, actions, enable, fireOperationalAnalytics, fireEvent]);

	const refetchTeamContainers = useCallback(
		async () => actions.refetchTeamContainers(fireOperationalAnalytics, fireEvent),
		[actions, fireOperationalAnalytics, fireEvent],
	);

	return {
		...state,
		addTeamContainer: actions.addTeamContainer,
		unlinkTeamContainers: (containerId: string) =>
			actions.unlinkTeamContainers(teamId, containerId),
		refetchTeamContainers,
	};
};

export const useConnectedTeams = () => {
	const [state, actions] = useTeamContainersHook();
	const { fireOperationalEvent } = usePeopleAndTeamAnalytics();
	const { createAnalyticsEvent } = useAnalyticsEvents();
	const { fireEvent } = useAnalyticsEventsNext();
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
			actions.fetchNumberOfConnectedTeams(containerId, fireOperationalAnalytics, fireEvent),
		fetchConnectedTeams: (containerId: string) =>
			actions.fetchConnectedTeams(containerId, fireOperationalAnalytics, fireEvent),
	};
};
