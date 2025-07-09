import type { EditorCommand } from '@atlaskit/editor-common/types';

import { ACTIONS } from '../actions';
import { pluginKey as typeAheadPluginKey } from '../key';

export const clearListError = (): EditorCommand => {
	return ({ tr }) => {
		tr.setMeta(typeAheadPluginKey, {
			action: ACTIONS.CLEAR_LIST_ERROR,
			params: {
				errorInfo: null,
			},
		});

		return tr;
	};
};
