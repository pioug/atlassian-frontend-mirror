import { useCallback, useEffect } from 'react';

import { type Action, createHook, createStore } from 'react-sweet-state';

import { useAnalyticsEvents } from '@atlaskit/analytics-next';
import { useAnalyticsEvents as useAnalyticsEventsNext } from '@atlaskit/teams-app-internal-analytics';
import { teamsClient } from '@atlaskit/teams-client';
import type { TeamContainers, TeamWithMemberships, UnlinkContainerMutationError } from '@atlaskit/teams-client/types';

import { type TeamContainer } from '../../../common/types';
import { usePeopleAndTeamAnalytics } from '../../../common/utils/analytics';


type ConnectedTeams = {
	containerId: string | undefined;
	isLoading: boolean;
	hasLoaded: boolean;
	teams: TeamWithMemberships[] | undefined;
	error: Error | null;
	numberOfTeams: number | undefined;
};

type TeamState = {
	teamContainers: TeamContainers;
	loading: boolean;
	hasLoaded: boolean;
	error: Error | null;
	unlinkError: UnlinkContainerMutationError | null;
	teamId: string | null;
	connectedTeams: ConnectedTeams;
};

type State = {
	teams: Record<string, TeamState>;
	unlinkError: UnlinkContainerMutationError | null;
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

const getInitialTeamState = (): TeamState => ({
	teamContainers: [],
	loading: false,
	hasLoaded: false,
	error: null,
	unlinkError: null,
	teamId: null,
	connectedTeams: initialConnectedTeamsState,
});

const initialState: State = {
	teams: {},
	unlinkError: null,
};

function containersEqual<T extends { id: string }>(arr1: T[], arr2: T[]): boolean {
	if (arr1.length !== arr2.length) {
		return false;
	}
	const sortById = (a: T, b: T) => a.id.localeCompare(b.id);
	const sorted1 = [...arr1].sort(sortById);
	const sorted2 = [...arr2].sort(sortById);
	return sorted1.every((item, index) => item.id === sorted2[index].id);
}

function normalizeError(err: unknown): Error {
	if (err instanceof Error) {
		return err;
	}
	return new Error(typeof err === 'string' ? err : JSON.stringify(err));
}

function getErrorDetails(err: unknown): { message: string; stack?: string } {
	const error = normalizeError(err);
	return {
		message: error.message,
		stack: error.stack,
	};
}

const actions = {
	fetchTeamContainers:
		(
			teamId: string,
			fireAnalytics: (action: string, actionSubject: string, error?: Error) => void,
			fireAnalyticsNext: ReturnType<typeof useAnalyticsEventsNext>['fireEvent'],
		): Action<State> =>
		async ({ setState, getState }) => {
			const { teams } = getState();
			const currentTeamState = teams[teamId];
			// Only skip if already loaded and not currently loading (prevents duplicate fetches)
			if (currentTeamState?.hasLoaded && !currentTeamState.loading) {
				return;
			}
			// Skip if currently loading to prevent concurrent fetches
			if (currentTeamState?.loading) {
				return;
			}
			setState({
				teams: {
					...teams,
					[teamId]: {
						...getInitialTeamState(),
						teamContainers: [], // Ensure empty containers for new fetch
						loading: true,
						hasLoaded: false,
					},
				},
			});
			try {
				const containers = await teamsClient.getTeamContainers(teamId);

				fireAnalyticsNext('operational.fetchTeamContainers.succeeded', {
					teamId,
				});

				// Get fresh state after async operation
				const currentState = getState();
				const currentTeamState = currentState.teams[teamId];
				if (!currentTeamState || currentTeamState.loading === false) {
					// Team state was cleared or fetch was cancelled, don't update
					return;
				}
				// Only update if we're still loading (prevents race conditions when teamId changes)
				if (currentTeamState.loading) {
					setState({
						teams: {
							...currentState.teams,
							[teamId]: {
								...currentTeamState,
								teamContainers: containers,
								loading: false,
								error: null,
								hasLoaded: true,
								teamId,
							},
						},
					});
				}
			} catch (err) {
				fireAnalyticsNext('operational.fetchTeamContainers.failed', {
					teamId,
					error: getErrorDetails(err),
				});

				// Get fresh state after async operation
				const currentState = getState();
				if (!currentState.teams[teamId]) {
					return;
				}
				setState({
					teams: {
						...currentState.teams,
						[teamId]: {
							...currentState.teams[teamId],
							teamContainers: [],
							error: normalizeError(err),
							loading: false,
							hasLoaded: true,
							teamId,
						},
					},
				});
			}
		},
	refetchTeamContainers:
		(
			teamId: string,
			fireAnalytics: (action: string, actionSubject: string, error?: Error) => void,
			fireAnalyticsNext: ReturnType<typeof useAnalyticsEventsNext>['fireEvent'],
		): Action<State> =>
		async ({ setState, getState }) => {
			const { teams } = getState();
			const currentTeamState = teams[teamId];
			if (!currentTeamState) {
				return;
			}
			try {
				const containers = await teamsClient.getTeamContainers(teamId);

				fireAnalyticsNext('operational.refetchTeamContainers.succeeded', {
					teamId,
				});

				if (!containersEqual(containers, currentTeamState.teamContainers)) {
					setState({
						teams: {
							...teams,
							[teamId]: {
								...currentTeamState,
								teamContainers: containers,
								loading: false,
								error: null,
								hasLoaded: true,
								teamId,
							},
						},
					});
				}
			} catch (err) {
				fireAnalyticsNext('operational.refetchTeamContainers.failed', {
					teamId,
					error: getErrorDetails(err),
				});

				setState({
					teams: {
						...teams,
						[teamId]: {
							...currentTeamState,
							error: normalizeError(err),
							loading: false,
							hasLoaded: true,
							teamId,
						},
					},
				});
			}
		},
	fetchNumberOfConnectedTeams:
		(
			teamId: string,
			containerId: string,
			fireAnalytics: (props: FireAnalyticsProps) => void,
			fireAnalyticsNext: ReturnType<typeof useAnalyticsEventsNext>['fireEvent'],
		): Action<State> =>
		async ({ setState, getState }) => {
			const { teams } = getState();
			const currentTeamState = teams[teamId];
			if (!currentTeamState) {
				return;
			}
			const {
				connectedTeams: { containerId: currentContainerId },
			} = currentTeamState;
			if (currentContainerId === containerId) {
				return;
			}
			setState({
				teams: {
					...teams,
					[teamId]: {
						...currentTeamState,
						connectedTeams: {
							...initialConnectedTeamsState,
							containerId,
							numberOfTeams: undefined,
						},
					},
				},
			});
			try {
				const numberOfTeams = await teamsClient.getNumberOfConnectedTeams(containerId);

				fireAnalyticsNext('operational.fetchNumberOfConnectedTeams.succeeded', {
					numberOfTeams,
					containerId,
				});

				const currentState = getState();
				const updatedTeamState = currentState.teams[teamId];
				if (updatedTeamState) {
					setState({
						teams: {
							...currentState.teams,
							[teamId]: {
								...updatedTeamState,
								connectedTeams: {
									...initialConnectedTeamsState,
									containerId,
									numberOfTeams,
									hasLoaded: true,
								},
							},
						},
					});
				}
			} catch (e) {
				fireAnalyticsNext('operational.fetchNumberOfConnectedTeams.failed', {
					numberOfTeams: initialConnectedTeamsState.numberOfTeams || null,
					containerId,
					error: getErrorDetails(e),
				});

				const currentState = getState();
				const updatedTeamState = currentState.teams[teamId];
				if (updatedTeamState) {
					setState({
						teams: {
							...currentState.teams,
							[teamId]: {
								...updatedTeamState,
								connectedTeams: {
									...initialConnectedTeamsState,
									containerId,
									error: normalizeError(e),
								},
							},
						},
					});
				}
			}
		},
	fetchConnectedTeams:
		(
			teamId: string,
			containerId: string,
			fireAnalytics: (props: FireAnalyticsProps) => void,
			fireAnalyticsNext: ReturnType<typeof useAnalyticsEventsNext>['fireEvent'],
		): Action<State> =>
		async ({ setState, getState }) => {
			const { teams } = getState();
			const currentTeamState = teams[teamId];
			if (!currentTeamState) {
				return;
			}
			const {
				connectedTeams: { containerId: currentContainerId, numberOfTeams, hasLoaded },
			} = currentTeamState;
			if (currentContainerId === containerId && hasLoaded) {
				return;
			}
			setState({
				teams: {
					...teams,
					[teamId]: {
						...currentTeamState,
						connectedTeams: {
							containerId,
							isLoading: true,
							hasLoaded: false,
							teams: undefined,
							error: null,
							numberOfTeams,
						},
					},
				},
			});
			try {
				const teamsResult = await teamsClient.getConnectedTeams(containerId);

				fireAnalyticsNext('operational.fetchConnectedTeams.succeeded', {
					numberOfTeams: numberOfTeams || null,
					containerId,
				});

				const currentState = getState();
				const updatedTeamState = currentState.teams[teamId];
				if (updatedTeamState) {
					setState({
						teams: {
							...currentState.teams,
							[teamId]: {
								...updatedTeamState,
								connectedTeams: {
									containerId,
									isLoading: false,
									hasLoaded: true,
									teams: teamsResult,
									error: null,
									numberOfTeams,
								},
							},
						},
					});
				}
			} catch (e) {
				fireAnalyticsNext('operational.fetchConnectedTeams.failed', {
					numberOfTeams: numberOfTeams || null,
					containerId,
					error: getErrorDetails(e),
				});

				const currentState = getState();
				const updatedTeamState = currentState.teams[teamId];
				if (updatedTeamState) {
					setState({
						teams: {
							...currentState.teams,
							[teamId]: {
								...updatedTeamState,
								connectedTeams: {
									containerId,
									isLoading: false,
									hasLoaded: false,
									teams: [],
									error: normalizeError(e),
									numberOfTeams,
								},
							},
						},
					});
				}
			}
		},
	unlinkTeamContainers:
		(teamId: string, containerId: string): Action<State> =>
		async ({ setState, getState }) => {
			const { teams } = getState();
			const currentTeamState = teams[teamId];
			if (currentTeamState) {
				setState({
					teams: {
						...teams,
						[teamId]: {
							...currentTeamState,
							unlinkError: null,
						},
					},
				});
			}
			try {
				const mutationResult = await teamsClient.unlinkTeamContainer(teamId, containerId);

				const currentState = getState();
				const updatedTeamState = currentState.teams[teamId];
				if (!updatedTeamState) {
					return;
				}
				if (mutationResult.deleteTeamConnectedToContainer.errors.length) {
					// Just handle 1 error at a time should be sufficient as we disconnect only 1 container at a time
					setState({
						teams: {
							...currentState.teams,
							[teamId]: {
								...updatedTeamState,
								unlinkError: mutationResult.deleteTeamConnectedToContainer.errors[0],
							},
						},
					});
				} else {
					const newContainers = updatedTeamState.teamContainers.filter(
						(container) => container.id !== containerId,
					);
					const shouldResetConnectedTeams =
						updatedTeamState.connectedTeams.containerId === containerId;
					setState({
						teams: {
							...currentState.teams,
							[teamId]: {
								...updatedTeamState,
								teamContainers: newContainers,
								...(shouldResetConnectedTeams && {
									connectedTeams: initialConnectedTeamsState,
								}),
								unlinkError: null,
							},
						},
					});
				}
			} catch (err) {
				const currentState = getState();
				const updatedTeamState = currentState.teams[teamId];
				if (updatedTeamState) {
					setState({
						teams: {
							...currentState.teams,
							[teamId]: {
								...updatedTeamState,
								unlinkError: normalizeError(err),
							},
						},
					});
				}
			}
		},
	addTeamContainer:
		(teamId: string, teamContainer: TeamContainer): Action<State> =>
		async ({ setState, getState }) => {
			const { teams } = getState();
			const currentTeamState = teams[teamId];
			if (!currentTeamState) {
				return;
			}
			const containerExists = currentTeamState.teamContainers.some(
				(container) => container.id === teamContainer.id,
			);

			if (containerExists) {
				return;
			}
			const shouldResetConnectedTeams =
				currentTeamState.connectedTeams.containerId === teamContainer.id;
			setState({
				teams: {
					...teams,
					[teamId]: {
						...currentTeamState,
						teamContainers: [...currentTeamState.teamContainers, teamContainer],
						...(shouldResetConnectedTeams && {
							connectedTeams: initialConnectedTeamsState,
						}),
						teamId,
					},
				},
			});
		},
};

const Store = createStore<State, Actions>({
	initialState,
	actions,
	name: 'multiTeamContainersStore',
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
						error: getErrorDetails(error),
					}),
				},
			});
		},
		[fireOperationalEvent, createAnalyticsEvent, teamId],
	);

	useEffect(() => {
		if (enable) {
			// Get fresh state to ensure we're checking the correct team
			const currentState = state;
			const teamState = currentState.teams[teamId];
			// Only fetch if not already loaded or loading
			if (!teamState?.hasLoaded && !teamState?.loading) {
				actions.fetchTeamContainers(teamId, fireOperationalAnalytics, fireEvent);
			}
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [teamId, enable]);

	const refetchTeamContainers = useCallback(
		async () => actions.refetchTeamContainers(teamId, fireOperationalAnalytics, fireEvent),
		[teamId, actions, fireOperationalAnalytics, fireEvent],
	);

	// Always get the state for the specific teamId to avoid showing wrong team's data
	const teamState = state.teams[teamId] || getInitialTeamState();

	return {
		teamContainers: teamState.teamContainers,
		loading: teamState.loading,
		hasLoaded: teamState.hasLoaded,
		error: teamState.error,
		unlinkError: teamState.unlinkError,
		teamId: teamState.teamId,
		connectedTeams: teamState.connectedTeams,
		addTeamContainer: (teamContainer: TeamContainer) =>
			actions.addTeamContainer(teamId, teamContainer),
		unlinkTeamContainers: (containerId: string) =>
			actions.unlinkTeamContainers(teamId, containerId),
		refetchTeamContainers,
	};
};

export const useConnectedTeams = (teamId: string) => {
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
						error: getErrorDetails(error),
					}),
				},
			});
		},
		[fireOperationalEvent, createAnalyticsEvent],
	);

	const teamState = state.teams[teamId] || getInitialTeamState();

	return {
		...teamState.connectedTeams,
		fetchNumberOfConnectedTeams: (containerId: string) =>
			actions.fetchNumberOfConnectedTeams(teamId, containerId, fireOperationalAnalytics, fireEvent),
		fetchConnectedTeams: (containerId: string) =>
			actions.fetchConnectedTeams(teamId, containerId, fireOperationalAnalytics, fireEvent),
	};
};
