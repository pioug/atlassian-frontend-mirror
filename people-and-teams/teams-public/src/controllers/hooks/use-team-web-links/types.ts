import { type StoreActionApi } from 'react-sweet-state';

import { type TeamWebLink } from '../../../common/types';

export interface TeamLinkIconData {
	linkUrl?: string;
	iconUrl?: string;
	productName?: string;
}

export interface TeamWebLinksState {
	teamId: string;
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

export type StoreApi = StoreActionApi<TeamWebLinksState>;
