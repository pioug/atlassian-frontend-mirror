import type { Command } from '@atlaskit/editor-common/types';

import { ACTIONS } from '../actions';
import { pluginKey as typeAheadPluginKey } from '../key';

export const updateListError = (errorInfo: Record<string, string>): Command => {
	return (state, dispatch) => {
		const tr = state.tr;

		tr.setMeta(typeAheadPluginKey, {
			action: ACTIONS.UPDATE_LIST_ERROR,
			params: {
				errorInfo,
				items: [],
			},
		});

		if (dispatch) {
			dispatch(tr);
		}

		return true;
	};
};
