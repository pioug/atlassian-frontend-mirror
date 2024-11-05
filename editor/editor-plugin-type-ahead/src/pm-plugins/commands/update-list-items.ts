import type { Command } from '@atlaskit/editor-common/types';

import type { TypeAheadItem } from '../../types';
import { ACTIONS } from '../actions';
import { pluginKey as typeAheadPluginKey } from '../key';

export const updateListItem = (items: Array<TypeAheadItem>): Command => {
	return (state, dispatch) => {
		const tr = state.tr;

		tr.setMeta(typeAheadPluginKey, {
			action: ACTIONS.UPDATE_LIST_ITEMS,
			params: {
				items,
			},
		});

		if (dispatch) {
			dispatch(tr);
		}

		return true;
	};
};
