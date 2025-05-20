import { type StoreActionApi } from 'react-sweet-state';

import { type TeamWebLink } from '../../../common/types';

import { actions } from './index';

export interface TeamWebLinksState {
	teamId: string;
	isLoading: boolean;
	hasLoaded: boolean;
	hasError: boolean;
	errorType: Error | null;
	shouldReload: boolean;
	links: TeamWebLink[];
}

export type StoreApi = StoreActionApi<TeamWebLinksState>;
export type Actions = typeof actions;
