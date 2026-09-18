import { useCallback, useEffect } from 'react';

import { useAnalyticsEvents } from '@atlaskit/analytics-next/useAnalyticsEvents';
import { useAnalyticsEvents as useAnalyticsEventsNext } from '@atlaskit/teams-app-internal-analytics/use-analytics-events';
import type { TeamContainers } from '@atlaskit/teams-client/team-containers';
import type { UnlinkContainerMutationError } from '@atlaskit/teams-client/unlink-container-mutation';

import { type TeamContainer } from '../../../common/types';
import { usePeopleAndTeamAnalytics } from '../../../common/utils/analytics';
import type { ConnectedTeams } from './connected-teams';
import { getErrorDetails } from './get-error-details';
import { getInitialTeamState } from './get-initial-team-state';
import { useTeamContainersHook } from './multi-team';

export const useTeamContainers = (
	teamId: string,
	enable = true,
): {
	teamContainers: TeamContainers;
	loading: boolean;
	hasLoaded: boolean;
	error: Error | null;
	unlinkError: UnlinkContainerMutationError | null;
	teamId: string | null;
	connectedTeams: ConnectedTeams;
	addTeamContainer: (teamContainer: TeamContainer) => void | Promise<void>;
	unlinkTeamContainers: (containerId: string) => void | Promise<void>;
	refetchTeamContainers: () => Promise<void>;
} => {
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
		async (): Promise<void> =>
			actions.refetchTeamContainers(teamId, fireOperationalAnalytics, fireEvent),
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
		addTeamContainer: (teamContainer: TeamContainer): void | Promise<void> =>
			actions.addTeamContainer(teamId, teamContainer),
		unlinkTeamContainers: (containerId: string): void | Promise<void> =>
			actions.unlinkTeamContainers(teamId, containerId),
		refetchTeamContainers,
	};
};
