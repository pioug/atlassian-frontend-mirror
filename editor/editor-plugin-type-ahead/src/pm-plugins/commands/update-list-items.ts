import type { Command, TypeAheadItem } from '@atlaskit/editor-common/types';

import type { TypeAheadResolvedSection } from '../../types';
import { ACTIONS } from '../actions';
import { pluginKey as typeAheadPluginKey } from '../key';

export const updateListItem = (
	items: Array<TypeAheadItem>,
	sections: Array<TypeAheadResolvedSection> = [],
): Command => {
	return (state, dispatch) => {
		const tr = state.tr;

		tr.setMeta(typeAheadPluginKey, {
			action: ACTIONS.UPDATE_LIST_ITEMS,
			params: {
				items,
				sections,
			},
		});

		if (dispatch) {
			dispatch(tr);
		}

		return true;
	};
};
