import { removeMark } from '@atlaskit/editor-common/mark';
import type { EditorCommand } from '@atlaskit/editor-common/types';

import { ACTIONS, pluginKey } from '../pm-plugins/main';

export const removeColor: EditorCommand = ({ tr }) => {
	const { textColor } = tr.doc.type.schema.marks;

	removeMark(textColor)({ tr });

	tr.setMeta(pluginKey, { action: ACTIONS.RESET_COLOR });

	return tr;
};
