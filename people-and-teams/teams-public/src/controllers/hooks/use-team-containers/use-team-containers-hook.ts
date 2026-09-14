import { type Action, type BoundActions, createHook, type HookFunction } from 'react-sweet-state';

import type { useAnalyticsEvents } from '@atlaskit/teams-app-internal-analytics/use-analytics-events';

import { type TeamContainer } from '../../../common/types';

import { TeamContainersStore } from './store';
import type { TeamContainersState } from './team-containers-state';

export const useTeamContainersHook: HookFunction<
	TeamContainersState,
	BoundActions<
		TeamContainersState,
		{
			fetchTeamContainers: (
				teamId: string,
				fireAnalytics: ReturnType<typeof useAnalyticsEvents>['fireEvent'],
			) => Action<TeamContainersState>;
			refetchTeamContainers: (
				fireAnalytics: ReturnType<typeof useAnalyticsEvents>['fireEvent'],
			) => Action<TeamContainersState>;
			fetchNumberOfConnectedTeams: (
				containerId: string,
				fireAnalytics: ReturnType<typeof useAnalyticsEvents>['fireEvent'],
			) => Action<TeamContainersState>;
			fetchConnectedTeams: (
				containerId: string,
				fireAnalytics: ReturnType<typeof useAnalyticsEvents>['fireEvent'],
			) => Action<TeamContainersState>;
			unlinkTeamContainers: (teamId: string, containerId: string) => Action<TeamContainersState>;
			addTeamContainer: (teamContainer: TeamContainer) => Action<TeamContainersState>;
		}
	>,
	void
> = createHook(TeamContainersStore);
