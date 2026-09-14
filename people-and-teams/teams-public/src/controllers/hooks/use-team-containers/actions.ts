import { type Action } from 'react-sweet-state';

import type { useAnalyticsEvents } from '@atlaskit/teams-app-internal-analytics/use-analytics-events';
import { teamsClient } from '@atlaskit/teams-client/client';

import { type TeamContainer } from '../../../common/types';

import { containersDeepEqual } from './containers-deep-equal';
import { initialConnectedTeamsState } from './initial-connected-teams-state';
import type { TeamContainersState } from './team-containers-state';

export const actions = {
	fetchTeamContainers:
		(
			teamId: string,
			fireAnalytics: ReturnType<typeof useAnalyticsEvents>['fireEvent'],
		): Action<TeamContainersState> =>
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
		(
			fireAnalytics: ReturnType<typeof useAnalyticsEvents>['fireEvent'],
		): Action<TeamContainersState> =>
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
				if (!containersDeepEqual(containers, getState().teamContainers)) {
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
		): Action<TeamContainersState> =>
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
		): Action<TeamContainersState> =>
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
		(teamId: string, containerId: string): Action<TeamContainersState> =>
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
		(teamContainer: TeamContainer): Action<TeamContainersState> =>
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
