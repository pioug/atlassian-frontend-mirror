import { removeMark } from '@atlaskit/editor-common/mark';
import type { Command } from '@atlaskit/editor-common/types';

import { ACTIONS, pluginKey } from '../pm-plugins/main';

export const removeColor = (): Command => (state, dispatch) => {
	const { schema } = state;
	const { textColor } = schema.marks;

	let tr = state.tr;

	removeMark(textColor)({ tr });

	if (dispatch) {
		dispatch(tr.setMeta(pluginKey, { action: ACTIONS.RESET_COLOR }));
	}
	return true;
};
