import { type BoundActions, type HookReturnValue } from 'react-sweet-state';

import type { TeamLink } from '@atlaskit/teams-client/links';

import { type NewTeamWebLink } from '../../../common/types';
import { useTeamWebLinks as useTeamWebLinksMulti } from './multi-team';
import { type StoreApi, type TeamWebLinksState } from './types';

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
	return useTeamWebLinksMulti(teamId || '');
};
