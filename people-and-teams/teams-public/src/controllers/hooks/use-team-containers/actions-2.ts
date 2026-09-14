import { type Action } from 'react-sweet-state';

import type { useAnalyticsEvents as useAnalyticsEventsNext } from '@atlaskit/teams-app-internal-analytics/use-analytics-events';
import { teamsClient } from '@atlaskit/teams-client/client';

import { type TeamContainer } from '../../../common/types';

import { containersEqual } from './containers-equal';
import type { FireAnalyticsProps } from './fire-analytics-props';
import { getErrorDetails } from './get-error-details';
import { getInitialTeamState } from './get-initial-team-state';
import { initialConnectedTeamsState } from './initial-connected-teams-state';
import { normalizeError } from './normalize-error';
import type { State } from './state';

export const actions = {
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
