import { createHook, type BoundActions, type HookReturnValue } from 'react-sweet-state';

import { fg } from '@atlaskit/platform-feature-flags/fg';
import type { TeamLink } from '@atlaskit/teams-client/links';

import { type NewTeamWebLink, type TeamWebLink } from '../../../common/types';
import { useTeamWebLinksActions as useTeamWebLinksActionsMulti } from './multi-team';
import { TeamWebLinksStore } from './store';
import { type StoreApi, type TeamLinkIconData, type TeamWebLinksState } from './types';

const useTeamWebLinksActionsOriginal = createHook(TeamWebLinksStore, {
	selector: null,
});

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
