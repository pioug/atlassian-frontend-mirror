import { createHook, createStore } from 'react-sweet-state';

import { teamsClient } from '@atlaskit/teams-client';

import { type NewTeamWebLink } from '../../../common/types';

import { type Actions, type StoreApi, type TeamWebLinksState } from './types';

const initialState: TeamWebLinksState = {
	teamId: '',
	isLoading: false,
	hasLoaded: false,
	hasError: false,
	shouldReload: false,
	errorType: null,
	links: [],
};

export const actions = {
	getTeamWebLinks:
		(teamId: string) =>
		async ({ getState, setState }: StoreApi) => {
			const { links, teamId: currentTeamId } = getState();
			const initialLinks = teamId === currentTeamId ? links : [];

			setState({
				teamId,
				isLoading: true,
				hasLoaded: false,
				hasError: false,
				shouldReload: false,
				links: initialLinks,
			});

			try {
				const { entities } = await teamsClient.getTeamLinksByTeamId(teamId);

				if (getState().teamId !== teamId) {
					return;
				}
				setState({
					isLoading: false,
					hasLoaded: true,
					hasError: false,
					shouldReload: false,
					links: entities,
				});
			} catch (e) {
				if (getState().teamId !== teamId) {
					return;
				}

				setState({
					isLoading: false,
					hasLoaded: true,
					hasError: true,
					errorType: e instanceof Error ? e : undefined,
					shouldReload: false,
					links: [],
				});
			}
		},

	createTeamWebLink: (teamId: string, newLink: NewTeamWebLink) => async () => {
		return await teamsClient.createTeamLink(teamId, newLink);
	},

	updateTeamWebLink: (teamId: string, linkId: string, newLink: NewTeamWebLink) => async () => {
		return await teamsClient.updateTeamLink(teamId, linkId, newLink);
	},

	removeWebLink:
		(teamId: string, linkId: string) =>
		async ({ dispatch }: StoreApi) => {
			await teamsClient.deleteTeamLink(teamId, linkId);
			await dispatch(actions.getTeamWebLinks(teamId));
		},

	initialState:
		(state: Partial<TeamWebLinksState>) =>
		({ setState }: StoreApi) => {
			setState({
				...initialState,
				...state,
			});
		},
};

const TeamWebLinksStore = createStore<TeamWebLinksState, Actions>({
	initialState,
	actions,
});

export const useTeamWebLinks = createHook(TeamWebLinksStore);

export const useTeamWebLinksActions = createHook(TeamWebLinksStore, {
	selector: null,
});
