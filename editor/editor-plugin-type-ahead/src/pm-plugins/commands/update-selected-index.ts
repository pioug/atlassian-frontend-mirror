import type { Command, ExtractInjectionAPI } from '@atlaskit/editor-common/types';

import type { TypeAheadPlugin } from '../../typeAheadPluginType';
import { ACTIONS } from '../actions';
import { itemIsDisabled } from '../item-is-disabled';
import { pluginKey as typeAheadPluginKey } from '../key';

export const updateSelectedIndex = (
	selectedIndex: number,
	api: ExtractInjectionAPI<TypeAheadPlugin> | undefined,
): Command => {
	return (state, dispatch) => {
		const pluginState = typeAheadPluginKey.getState(state);

		if (pluginState?.selectedIndex === selectedIndex) {
			return false;
		}

		// If the new index is disabled ignore this call, we can use the previous index
		if (itemIsDisabled(pluginState?.items[selectedIndex], api)) {
			return false;
		}

		const tr = state.tr;

		tr.setMeta(typeAheadPluginKey, {
			action: ACTIONS.UPDATE_SELECTED_INDEX,
			params: {
				selectedIndex,
			},
		});

		if (dispatch) {
			dispatch(tr);
		}

		return true;
	};
};
