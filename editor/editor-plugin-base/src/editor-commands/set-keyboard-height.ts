import type { Command } from '@atlaskit/editor-common/types';

import { scrollGutterPluginKey } from '../pm-plugins/scroll-gutter/plugin-key';

export const setKeyboardHeight =
	(keyboardHeight: number): Command =>
	(state, dispatch) => {
		const { tr } = state;
		tr.setMeta(scrollGutterPluginKey, { keyboardHeight });
		if (dispatch) {
			dispatch(tr);
		}
		return true;
	};
