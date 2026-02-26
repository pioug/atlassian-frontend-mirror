import type { Command } from '@atlaskit/editor-common/types';
import type { ContentNodeWithPos } from '@atlaskit/editor-prosemirror/utils';

export const createDeleteCommand =
	(selectedNativeEmbed: ContentNodeWithPos): Command =>
	(state, dispatch) => {
		const { pos, node } = selectedNativeEmbed;
		if (dispatch) {
			dispatch(state.tr.delete(pos, pos + node.nodeSize));
		}
		return true;
	};
