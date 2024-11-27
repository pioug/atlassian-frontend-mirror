import type { CustomAutoformatAction, Reducer } from '../types';

import { finish, matched, resolved, setProvider } from './actions';

const reduce: Reducer<CustomAutoformatAction> = (state, action) => {
	switch (action.action) {
		case 'matched':
			return matched(state, action);
		case 'resolved':
			return resolved(state, action);
		case 'finish':
			return finish(state, action);
		case 'setProvider':
			return setProvider(state, action);
		default:
			return state;
	}
};

export default reduce;
