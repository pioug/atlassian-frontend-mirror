import { useCallback } from 'react';

import { useAnalyticsEvents } from '@atlaskit/analytics-next/useAnalyticsEvents';
import { useAnalyticsEvents as useAnalyticsEventsNext } from '@atlaskit/teams-app-internal-analytics/use-analytics-events';
import type { TeamWithMemberships } from '@atlaskit/teams-client/membership';

import { usePeopleAndTeamAnalytics } from '../../../common/utils/analytics';
import type { FireAnalyticsProps } from './fire-analytics-props';
import { getErrorDetails } from './get-error-details';
import { getInitialTeamState } from './get-initial-team-state';
import { useTeamContainersHook } from './multi-team';

export const useConnectedTeams = (
	teamId: string,
): {
	fetchNumberOfConnectedTeams: (containerId: string) => void | Promise<void>;
	fetchConnectedTeams: (containerId: string) => void | Promise<void>;
	containerId: string | undefined;
	isLoading: boolean;
	hasLoaded: boolean;
	teams: TeamWithMemberships[] | undefined;
	error: Error | null;
	numberOfTeams: number | undefined;
} => {
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
		fetchNumberOfConnectedTeams: (containerId: string): void | Promise<void> =>
			actions.fetchNumberOfConnectedTeams(teamId, containerId, fireOperationalAnalytics, fireEvent),
		fetchConnectedTeams: (containerId: string): void | Promise<void> =>
			actions.fetchConnectedTeams(teamId, containerId, fireOperationalAnalytics, fireEvent),
	};
};
