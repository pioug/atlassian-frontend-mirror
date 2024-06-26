import type { Command } from '@atlaskit/editor-common/types';

import { ACTIONS } from '../pm-plugins/actions';
import { pluginKey as typeAheadPluginKey } from '../pm-plugins/key';
import type { TypeAheadItem } from '../types';

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
