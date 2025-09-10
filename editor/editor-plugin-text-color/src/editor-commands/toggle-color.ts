import { removeMark, toggleMark } from '@atlaskit/editor-common/mark';
import type { EditorCommand } from '@atlaskit/editor-common/types';

import { ACTIONS, pluginKey } from '../pm-plugins/main';
import { overrideMarks } from '../pm-plugins/utils/constants';
import { getDisabledStateNew } from '../pm-plugins/utils/disabled';

export const toggleColor =
	(color: string): EditorCommand =>
	({ tr }) => {
		const { textColor } = tr.doc.type.schema.marks;

		const disabledState = getDisabledStateNew(tr);
		if (disabledState) {
			tr.setMeta(pluginKey, { action: ACTIONS.DISABLE });
			return tr;
		}

		overrideMarks.forEach((mark) => {
			const { marks } = tr.doc.type.schema;
			if (marks[mark]) {
				removeMark(marks[mark])({ tr });
			}
		});

		toggleMark(textColor, { color })({ tr });

		return tr;
	};
