import { createHook, type BoundActions, type HookReturnValue } from 'react-sweet-state';

import { fg } from '@atlaskit/platform-feature-flags/fg';
import type { TeamLink } from '@atlaskit/teams-client/links';

import { type NewTeamWebLink } from '../../../common/types';
import { useTeamWebLinks as useTeamWebLinksMulti } from './multi-team';
import { TeamWebLinksStore } from './store';
import { type StoreApi, type TeamWebLinksState } from './types';

const useTeamWebLinksOriginal = createHook(TeamWebLinksStore);

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
