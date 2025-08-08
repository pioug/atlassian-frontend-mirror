import { createHook, createStore } from 'react-sweet-state';

import { fg } from '@atlaskit/platform-feature-flags';
import { teamsClient } from '@atlaskit/teams-client';

import { type NewTeamWebLink } from '../../../common/types';

import { type StoreApi, type TeamWebLinksState } from './types';

const initialState: TeamWebLinksState = {
	teamId: '',
	isLoading: false,
	hasLoaded: false,
	hasError: false,
	shouldReload: false,
	errorType: null,
	links: [],
	linkIcons: [],
	iconsLoading: false,
	iconsError: false,
	iconHasLoaded: false,
};

export const actions = {
	getTeamWebLinks:
		(teamId: string) =>
		async ({ getState, setState, dispatch }: StoreApi) => {
			const { links, teamId: currentTeamId, hasLoaded, isLoading } = getState();

			if (
				(isLoading || (teamId === currentTeamId && hasLoaded && links.length > 0)) &&
				fg('prevent_parallel_team_web_links_fetch')
			) {
				return;
			}

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

				if (entities.length > 0) {
					dispatch(actions.getTeamWebLinkIcons(teamId));
				}
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

	getTeamWebLinkIcons:
		(teamId: string) =>
		async ({ getState, setState }: StoreApi) => {
			const { links, linkIcons: currentIcons } = getState();

			if (links.length === 0) {
				return;
			}

			const linkUrls = links.map((link) => link.linkUri);

			const uncachedUrls = linkUrls.filter(
				(url) => !currentIcons.some((icon) => icon.linkUrl === url),
			);

			if (uncachedUrls.length > 0) {
				try {
					setState({ iconsLoading: true, iconsError: false });
					const newIconData = await teamsClient.getTeamLinkIcons(uncachedUrls);
					if (getState().teamId === teamId) {
						setState({
							linkIcons: [...currentIcons, ...(newIconData || [])],
							iconsLoading: false,
							iconsError: false,
							iconHasLoaded: true,
						});
					}
				} catch (iconError) {
					if (getState().teamId === teamId) {
						setState({
							iconsLoading: false,
							iconsError: true,
							iconHasLoaded: true,
						});
					}
				}
			} else {
				setState({
					iconsLoading: false,
					iconsError: false,
					iconHasLoaded: true,
				});
			}
		},

	createTeamWebLink:
		(teamId: string, newLink: NewTeamWebLink) =>
		async ({ getState, setState, dispatch }: StoreApi) => {
			const result = await teamsClient.createTeamLink(teamId, newLink);

			const currentState = getState();
			if (currentState.teamId !== teamId) {
				return result;
			}

			setState({
				links: [...currentState.links, result],
			});

			dispatch(actions.getTeamWebLinkIcons(teamId));

			return result;
		},

	updateTeamWebLink:
		(teamId: string, linkId: string, newLink: NewTeamWebLink) =>
		async ({ getState, setState, dispatch }: StoreApi) => {
			const result = await teamsClient.updateTeamLink(teamId, linkId, newLink);

			const currentState = getState();
			if (currentState.teamId !== teamId) {
				return result;
			}

			const oldLink = currentState.links.find((link) => link.linkId === linkId);
			const urlChanged = oldLink && oldLink.linkUri !== result.linkUri;

			setState({
				links: currentState.links.map((link) => (link.linkId === linkId ? result : link)),
			});

			if (urlChanged) {
				const updatedIcons = currentState.linkIcons.filter(
					(icon) => icon.linkUrl !== oldLink.linkUri,
				);
				setState({
					linkIcons: updatedIcons,
				});

				dispatch(actions.getTeamWebLinkIcons(teamId));
			}

			return result;
		},

	removeWebLink:
		(teamId: string, linkId: string) =>
		async ({ getState, setState }: StoreApi) => {
			const currentState = getState();
			if (currentState.teamId !== teamId) {
				return;
			}

			await teamsClient.deleteTeamLink(teamId, linkId);

			setState({
				links: currentState.links.filter((link) => link.linkId !== linkId),
			});
		},

	fetchWebLinkTitle:
		(url: string) =>
		async ({ setState }: StoreApi): Promise<string | undefined> => {
			if (!url) {
				return undefined;
			}

			try {
				const title = await teamsClient.getWebLinkTitle(url);
				return title;
			} catch (error) {
				return undefined;
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

const TeamWebLinksStore = createStore<TeamWebLinksState, typeof actions>({
	initialState,
	actions,
});

export const useTeamWebLinks = createHook(TeamWebLinksStore);

export const useTeamWebLinksActions = createHook(TeamWebLinksStore, {
	selector: null,
});
