import { type TeamWebLinksState } from './types';

export const initialState: TeamWebLinksState = {
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
