import {
	createHook,
	createStore,
	type BoundActions,
	type HookReturnValue,
} from 'react-sweet-state';

import { fg } from '@atlaskit/platform-feature-flags';
import { teamsClient } from '@atlaskit/teams-client';
import type { TeamLink } from '@atlaskit/teams-client/types';

import { type NewTeamWebLink, type TeamWebLink } from '../../../common/types';

import {
	useTeamWebLinksActions as useTeamWebLinksActionsMulti,
	useTeamWebLinks as useTeamWebLinksMulti,
} from './multi-team';
import { type StoreApi, type TeamLinkIconData, type TeamWebLinksState } from './types';

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
		async ({ getState, setState, dispatch }: StoreApi): Promise<void> => {
			const { links, teamId: currentTeamId, hasLoaded, isLoading } = getState();

			if (isLoading || (teamId === currentTeamId && hasLoaded && links.length > 0)) {
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
		async ({ getState, setState }: StoreApi): Promise<void> => {
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
				} catch {
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
		async ({ getState, setState, dispatch }: StoreApi): Promise<TeamLink> => {
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
		async ({ getState, setState, dispatch }: StoreApi): Promise<TeamLink> => {
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
		async ({ getState, setState }: StoreApi): Promise<void> => {
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
			} catch {
				return undefined;
			}
		},

	initialState:
		(state: Partial<TeamWebLinksState>) =>
		({ setState }: StoreApi): void => {
			setState({
				...initialState,
				...state,
			});
		},
};

const TeamWebLinksStore = createStore<TeamWebLinksState, typeof actions>({
	initialState,
	actions,
	name: 'teamWebLinksStore',
});

const useTeamWebLinksOriginal = createHook(TeamWebLinksStore);
const useTeamWebLinksActionsOriginal = createHook(TeamWebLinksStore, {
	selector: null,
});

export const useTeamWebLinks = (
	teamId?: string,
): HookReturnValue<
	TeamWebLinksState,
	BoundActions<
		TeamWebLinksState,
		{
			getTeamWebLinks: (
				teamId: string,
			) => ({ getState, setState, dispatch }: StoreApi) => Promise<void>;
			getTeamWebLinkIcons: (teamId: string) => ({ getState, setState }: StoreApi) => Promise<void>;
			createTeamWebLink: (
				teamId: string,
				newLink: NewTeamWebLink,
			) => ({ getState, setState, dispatch }: StoreApi) => Promise<TeamLink>;
			updateTeamWebLink: (
				teamId: string,
				linkId: string,
				newLink: NewTeamWebLink,
			) => ({ getState, setState, dispatch }: StoreApi) => Promise<TeamLink>;
			removeWebLink: (
				teamId: string,
				linkId: string,
			) => ({ getState, setState }: StoreApi) => Promise<void>;
			fetchWebLinkTitle: (url: string) => ({ setState }: StoreApi) => Promise<string | undefined>;
			initialState: (state: Partial<TeamWebLinksState>) => ({ setState }: StoreApi) => void;
		}
	>
> => {
	const originalResult = useTeamWebLinksOriginal();
	const multiResult = useTeamWebLinksMulti(teamId || '');

	if (fg('enable_multi_team_containers_state')) {
		return multiResult;
	}

	return originalResult;
};

export const useTeamWebLinksActions = ():
	| HookReturnValue<
			{
				teams: Record<
					string,
					{
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
					}
				>;
				currentTeamId: string;
			},
			BoundActions<
				{
					teams: Record<
						string,
						{
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
						}
					>;
					currentTeamId: string;
				},
				{
					getTeamWebLinks: (teamId: string) => ({
						getState,
						setState,
						dispatch,
					}: StoreApi<{
						teams: Record<
							string,
							{
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
							}
						>;
						currentTeamId: string;
					}>) => Promise<void>;
					getTeamWebLinkIcons: (teamId: string) => ({
						getState,
						setState,
					}: StoreApi<{
						teams: Record<
							string,
							{
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
							}
						>;
						currentTeamId: string;
					}>) => Promise<void>;
					createTeamWebLink: (
						teamId: string,
						newLink: NewTeamWebLink,
					) => ({
						getState,
						setState,
						dispatch,
					}: StoreApi<{
						teams: Record<
							string,
							{
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
							}
						>;
						currentTeamId: string;
					}>) => Promise<TeamLink>;
					updateTeamWebLink: (
						teamId: string,
						linkId: string,
						newLink: NewTeamWebLink,
					) => ({
						getState,
						setState,
						dispatch,
					}: StoreApi<{
						teams: Record<
							string,
							{
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
							}
						>;
						currentTeamId: string;
					}>) => Promise<TeamLink>;
					removeWebLink: (
						teamId: string,
						linkId: string,
					) => ({
						getState,
						setState,
					}: StoreApi<{
						teams: Record<
							string,
							{
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
							}
						>;
						currentTeamId: string;
					}>) => Promise<void>;
					fetchWebLinkTitle: (url: string) => ({
						setState,
					}: StoreApi<{
						teams: Record<
							string,
							{
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
							}
						>;
						currentTeamId: string;
					}>) => Promise<string | undefined>;
					initialState: () => ({
						setState,
					}: StoreApi<{
						teams: Record<
							string,
							{
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
							}
						>;
						currentTeamId: string;
					}>) => void;
				}
			>
	  >
	| HookReturnValue<
			TeamWebLinksState,
			BoundActions<
				TeamWebLinksState,
				{
					getTeamWebLinks: (
						teamId: string,
					) => ({ getState, setState, dispatch }: StoreApi) => Promise<void>;
					getTeamWebLinkIcons: (
						teamId: string,
					) => ({ getState, setState }: StoreApi) => Promise<void>;
					createTeamWebLink: (
						teamId: string,
						newLink: NewTeamWebLink,
					) => ({ getState, setState, dispatch }: StoreApi) => Promise<TeamLink>;
					updateTeamWebLink: (
						teamId: string,
						linkId: string,
						newLink: NewTeamWebLink,
					) => ({ getState, setState, dispatch }: StoreApi) => Promise<TeamLink>;
					removeWebLink: (
						teamId: string,
						linkId: string,
					) => ({ getState, setState }: StoreApi) => Promise<void>;
					fetchWebLinkTitle: (
						url: string,
					) => ({ setState }: StoreApi) => Promise<string | undefined>;
					initialState: (state: Partial<TeamWebLinksState>) => ({ setState }: StoreApi) => void;
				}
			>
	  > => {
	const originalResult = useTeamWebLinksActionsOriginal();
	const multiResult = useTeamWebLinksActionsMulti();

	if (fg('enable_multi_team_containers_state')) {
		return multiResult;
	}

	return originalResult;
};
