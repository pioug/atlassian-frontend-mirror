import type { HistoryPluginState } from '../historyPluginType';

import type { HistoryAction } from './actions';
import { HistoryActionTypes } from './actions';

const reducer = (state: HistoryPluginState, action: HistoryAction): HistoryPluginState => {
	switch (action.type) {
		case HistoryActionTypes.UPDATE:
			return {
				canUndo: action.canUndo,
				canRedo: action.canRedo,
			};
	}

	return state;
};

export default reducer;
