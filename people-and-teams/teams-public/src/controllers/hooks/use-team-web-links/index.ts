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

	createTeamWebLink:
		(teamId: string, newLink: NewTeamWebLink) =>
		async ({ getState, setState }: StoreApi) => {
			const result = await teamsClient.createTeamLink(teamId, newLink);

			const currentState = getState();
			if (currentState.teamId === teamId) {
				setState({
					links: [...currentState.links, result],
				});
			}

			return result;
		},

	updateTeamWebLink:
		(teamId: string, linkId: string, newLink: NewTeamWebLink) =>
		async ({ getState, setState }: StoreApi) => {
			const result = await teamsClient.updateTeamLink(teamId, linkId, newLink);

			const currentState = getState();
			if (currentState.teamId === teamId) {
				setState({
					links: currentState.links.map((link) => (link.linkId === linkId ? result : link)),
				});
			}

			return result;
		},

	removeWebLink:
		(teamId: string, linkId: string) =>
		async ({ getState, setState }: StoreApi) => {
			await teamsClient.deleteTeamLink(teamId, linkId);

			const currentState = getState();
			if (currentState.teamId === teamId) {
				setState({
					links: currentState.links.filter((link) => link.linkId !== linkId),
				});
			}
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
