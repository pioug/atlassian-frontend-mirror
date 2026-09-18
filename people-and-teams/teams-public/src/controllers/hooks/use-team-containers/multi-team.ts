import {
	type Action,
	type BoundActions,
	createHook,
	createStore,
	type HookFunction,
} from 'react-sweet-state';

import type { useAnalyticsEvents as useAnalyticsEventsNext } from '@atlaskit/teams-app-internal-analytics/use-analytics-events';

import { type TeamContainer } from '../../../common/types';
import { actions } from './actions-2';
import type { FireAnalyticsProps } from './fire-analytics-props';
import type { State } from './state';

type Actions = typeof actions;

const initialState: State = {
	teams: {},
	unlinkError: null,
};

const Store = createStore<State, Actions>({
	initialState,
	actions,
	name: 'multiTeamContainersStore',
});

export const useTeamContainersHook: HookFunction<
	State,
	BoundActions<
		State,
		{
			fetchTeamContainers: (
				teamId: string,
				fireAnalytics: (action: string, actionSubject: string, error?: Error) => void,
				fireAnalyticsNext: ReturnType<typeof useAnalyticsEventsNext>['fireEvent'],
			) => Action<State>;
			refetchTeamContainers: (
				teamId: string,
				fireAnalytics: (action: string, actionSubject: string, error?: Error) => void,
				fireAnalyticsNext: ReturnType<typeof useAnalyticsEventsNext>['fireEvent'],
			) => Action<State>;
			fetchNumberOfConnectedTeams: (
				teamId: string,
				containerId: string,
				fireAnalytics: (props: FireAnalyticsProps) => void,
				fireAnalyticsNext: ReturnType<typeof useAnalyticsEventsNext>['fireEvent'],
			) => Action<State>;
			fetchConnectedTeams: (
				teamId: string,
				containerId: string,
				fireAnalytics: (props: FireAnalyticsProps) => void,
				fireAnalyticsNext: ReturnType<typeof useAnalyticsEventsNext>['fireEvent'],
			) => Action<State>;
			unlinkTeamContainers: (teamId: string, containerId: string) => Action<State>;
			addTeamContainer: (teamId: string, teamContainer: TeamContainer) => Action<State>;
		}
	>,
	void
> = createHook(Store);
