import type { Command } from '@atlaskit/editor-common/types';

import { ACTIONS } from '../pm-plugins/actions';
import { pluginKey as typeAheadPluginKey } from '../pm-plugins/key';

export const updateQuery = (query: string): Command => {
	return (state, dispatch) => {
		const pluginState = typeAheadPluginKey.getState(state);

		if (pluginState?.query === query) {
			return false;
		}

		const tr = state.tr;

		tr.setMeta(typeAheadPluginKey, {
			action: ACTIONS.CHANGE_QUERY,
			params: {
				query,
			},
		});

		if (dispatch) {
			dispatch(tr);
		}

		return true;
	};
};
