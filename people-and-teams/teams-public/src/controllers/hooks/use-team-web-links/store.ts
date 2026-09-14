import { createStore, type Store } from 'react-sweet-state';

import { actions } from './actions';
import { initialState } from './initial-state';
import { type TeamWebLinksState } from './types';

export const TeamWebLinksStore: Store<TeamWebLinksState, typeof actions> = createStore<
	TeamWebLinksState,
	typeof actions
>({
	initialState,
	actions,
	name: 'teamWebLinksStore',
});
