import { createHook, createStore } from 'react-sweet-state';

import { fg } from '@atlaskit/platform-feature-flags';
import { teamsClient } from '@atlaskit/teams-client';

import { type NewTeamWebLink, type TeamWebLink } from '../../../common/types';

import {
	type StoreApi,
	type TeamLinkIconData,
	type TeamWebLinksState as TeamWebLinksStateType,
} from './types';

type TeamWebLinksTeamState = {
	isLoading: boolean;
	hasLoaded: boolean;
	hasError: boolean;
	errorType: Error | null;
	shouldReload: boolean;
	links: TeamWebLink[];
	linkIcons: TeamLinkIconData[];
	iconsLoading: boolean;
	iconsError: boolean;
	iconHasLoaded: boolean;
};

type TeamWebLinksState = {
	teams: Record<string, TeamWebLinksTeamState>;
	currentTeamId: string;
};

const getInitialTeamState = (): TeamWebLinksTeamState => ({
	isLoading: false,
	hasLoaded: false,
	hasError: false,
	errorType: null,
	shouldReload: false,
	links: [],
	linkIcons: [],
	iconsLoading: false,
	iconsError: false,
	iconHasLoaded: false,
});

const initialState: TeamWebLinksState = {
	teams: {},
	currentTeamId: '',
};

export const actions = {
	getTeamWebLinks:
		(teamId: string) =>
		async ({ getState, setState, dispatch }: StoreApi<TeamWebLinksState>) => {
			const { teams } = getState();
			const currentTeamState = teams[teamId];
			const currentLinks = currentTeamState?.links || [];

			// Only skip if already loaded and not currently loading (prevents duplicate fetches)
			// Feature flag check: if enabled, also skip if hasLoaded and has links
			if (
				currentTeamState?.hasLoaded &&
				!currentTeamState.isLoading &&
				(!fg('prevent_parallel_team_web_links_fetch') || currentLinks.length > 0)
			) {
				return;
			}
			// Skip if currently loading to prevent concurrent fetches
			if (currentTeamState?.isLoading) {
				return;
			}

			setState({
				teams: {
					...teams,
					[teamId]: {
						...getInitialTeamState(),
						links: currentLinks,
						isLoading: true,
					},
				},
				currentTeamId: teamId,
			});

			try {
				const { entities } = await teamsClient.getTeamLinksByTeamId(teamId);

				// Get fresh state after async operation
				const currentState = getState();
				if (!currentState.teams[teamId] || currentState.teams[teamId].isLoading === false) {
					// Team state was cleared or fetch was cancelled, don't update
					return;
				}

				setState({
					teams: {
						...currentState.teams,
						[teamId]: {
							...currentState.teams[teamId],
							isLoading: false,
							hasLoaded: true,
							hasError: false,
							shouldReload: false,
							links: entities,
							linkIcons: currentTeamState?.linkIcons || [],
							iconsLoading: currentTeamState?.iconsLoading || false,
							iconsError: currentTeamState?.iconsError || false,
							iconHasLoaded: currentTeamState?.iconHasLoaded || false,
						},
					},
					currentTeamId: teamId,
				});

				if (entities.length > 0) {
					dispatch(actions.getTeamWebLinkIcons(teamId));
				}
			} catch (e) {
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
							isLoading: false,
							hasLoaded: true,
							hasError: true,
							errorType: e instanceof Error ? e : null,
							shouldReload: false,
							links: [],
						},
					},
					currentTeamId: teamId,
				});
			}
		},

	getTeamWebLinkIcons:
		(teamId: string) =>
		async ({ getState, setState }: StoreApi<TeamWebLinksState>) => {
			const { teams } = getState();
			const currentTeamState = teams[teamId];
			if (!currentTeamState) {
				return;
			}

			const { links, linkIcons: currentIcons } = currentTeamState;

			if (links.length === 0) {
				return;
			}

			const linkUrls = links.map((link) => link.linkUri);

			const uncachedUrls = linkUrls.filter(
				(url) => !currentIcons.some((icon) => icon.linkUrl === url),
			);

			if (uncachedUrls.length > 0) {
				try {
					setState({
						teams: {
							...teams,
							[teamId]: {
								...currentTeamState,
								iconsLoading: true,
								iconsError: false,
							},
						},
					});
					const newIconData = await teamsClient.getTeamLinkIcons(uncachedUrls);
					const currentState = getState();
					const updatedTeamState = currentState.teams[teamId];
					if (updatedTeamState) {
						// Use fresh state to get current icons
						const freshIcons = updatedTeamState.linkIcons;
						setState({
							teams: {
								...currentState.teams,
								[teamId]: {
									...updatedTeamState,
									linkIcons: [...freshIcons, ...(newIconData || [])],
									iconsLoading: false,
									iconsError: false,
									iconHasLoaded: true,
								},
							},
						});
					}
				} catch {
					const currentState = getState();
					const updatedTeamState = currentState.teams[teamId];
					if (updatedTeamState) {
						setState({
							teams: {
								...currentState.teams,
								[teamId]: {
									...updatedTeamState,
									iconsLoading: false,
									iconsError: true,
									iconHasLoaded: true,
								},
							},
						});
					}
				}
			} else {
				setState({
					teams: {
						...teams,
						[teamId]: {
							...currentTeamState,
							iconsLoading: false,
							iconsError: false,
							iconHasLoaded: true,
						},
					},
				});
			}
		},

	createTeamWebLink:
		(teamId: string, newLink: NewTeamWebLink) =>
		async ({ getState, setState, dispatch }: StoreApi<TeamWebLinksState>) => {
			const result = await teamsClient.createTeamLink(teamId, newLink);

			const currentState = getState();
			const currentTeamState = currentState.teams[teamId];
			if (!currentTeamState) {
				return result;
			}

			setState({
				teams: {
					...currentState.teams,
					[teamId]: {
						...currentTeamState,
						links: [...currentTeamState.links, result],
					},
				},
			});

			dispatch(actions.getTeamWebLinkIcons(teamId));

			return result;
		},

	updateTeamWebLink:
		(teamId: string, linkId: string, newLink: NewTeamWebLink) =>
		async ({ getState, setState, dispatch }: StoreApi<TeamWebLinksState>) => {
			const result = await teamsClient.updateTeamLink(teamId, linkId, newLink);

			const { teams } = getState();
			const currentTeamState = teams[teamId];
			if (!currentTeamState) {
				return result;
			}

			const oldLink = currentTeamState.links.find((link) => link.linkId === linkId);
			const urlChanged = oldLink && oldLink.linkUri !== result.linkUri;

			setState({
				teams: {
					...teams,
					[teamId]: {
						...currentTeamState,
						links: currentTeamState.links.map((link) => (link.linkId === linkId ? result : link)),
					},
				},
			});

			if (urlChanged && oldLink) {
				// Get fresh state to ensure we have the updated links
				const freshState = getState();
				const freshTeamState = freshState.teams[teamId];
				if (!freshTeamState) {
					return result;
				}
				const updatedIcons = freshTeamState.linkIcons.filter(
					(icon) => icon.linkUrl !== oldLink.linkUri,
				);
				setState({
					teams: {
						...freshState.teams,
						[teamId]: {
							...freshTeamState,
							linkIcons: updatedIcons,
						},
					},
				});

				dispatch(actions.getTeamWebLinkIcons(teamId));
			}

			return result;
		},

	removeWebLink:
		(teamId: string, linkId: string) =>
		async ({ getState, setState }: StoreApi<TeamWebLinksState>) => {
			await teamsClient.deleteTeamLink(teamId, linkId);

			// Get fresh state after async operation
			const currentState = getState();
			const currentTeamState = currentState.teams[teamId];
			if (!currentTeamState) {
				return;
			}

			setState({
				teams: {
					...currentState.teams,
					[teamId]: {
						...currentTeamState,
						links: currentTeamState.links.filter((link) => link.linkId !== linkId),
					},
				},
			});
		},

	fetchWebLinkTitle:
		(url: string) =>
		async ({ setState: _setState }: StoreApi<TeamWebLinksState>): Promise<string | undefined> => {
			if (!url) {
				return undefined;
			}

			try {
				const title = await teamsClient.getWebLinkTitle(url);
				return title;
			} catch {
				return undefined;
			}
		},

	initialState:
		() =>
		({ setState }: StoreApi<TeamWebLinksState>) => {
			setState({
				teams: {},
				currentTeamId: '',
			});
		},
};

const TeamWebLinksStore = createStore<TeamWebLinksState, typeof actions>({
	initialState,
	actions,
	name: 'multiTeamWebLinksStore',
});

const useTeamWebLinksHook = createHook(TeamWebLinksStore);

export const useTeamWebLinks = (teamId: string): [TeamWebLinksStateType, typeof actions] => {
	const [state, actions] = useTeamWebLinksHook();
	const teamState = state.teams[teamId] || getInitialTeamState();

	return [
		{
			teamId,
			...teamState,
		},
		actions,
	];
};

export const useTeamWebLinksActions = useTeamWebLinksHook;
