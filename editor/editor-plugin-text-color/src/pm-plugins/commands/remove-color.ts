import { removeMark } from '@atlaskit/editor-common/mark';
import { FORMAT_SELECTION_SYNC_META } from '@atlaskit/editor-common/selection';
import type { Command } from '@atlaskit/editor-common/types';

import { ACTIONS, pluginKey } from '../main';

export const removeColor = (): Command => (state, dispatch) => {
	const { schema } = state;
	const { textColor } = schema.marks;

	const tr = state.tr;

	removeMark(textColor)({ tr });

	if (dispatch) {
		if (tr.docChanged) {
			tr.setMeta(FORMAT_SELECTION_SYNC_META, true);
		}

		dispatch(tr.setMeta(pluginKey, { action: ACTIONS.RESET_COLOR }));
	}
	return true;
};
