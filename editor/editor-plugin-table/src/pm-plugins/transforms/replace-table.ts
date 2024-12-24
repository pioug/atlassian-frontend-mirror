import { ACTION_SUBJECT, EVENT_TYPE, TABLE_ACTION } from '@atlaskit/editor-common/analytics';
import type { EditorAnalyticsAPI, INPUT_METHOD } from '@atlaskit/editor-common/analytics';
import { Fragment, Slice } from '@atlaskit/editor-prosemirror/model';
import type { EditorState, Transaction } from '@atlaskit/editor-prosemirror/state';
import { TextSelection } from '@atlaskit/editor-prosemirror/state';
import { findTable, isTableSelected } from '@atlaskit/editor-tables/utils';

import { getSelectedTableInfo } from '../utils/analytics';

export const replaceSelectedTable = (
	state: EditorState,
	content: string | Slice,
	inputMethod: INPUT_METHOD.KEYBOARD | INPUT_METHOD.CLIPBOARD,
	editorAnalyticsAPI?: EditorAnalyticsAPI,
	// Ignored via go/ees005
	// eslint-disable-next-line @typescript-eslint/max-params
): Transaction => {
	if (isTableSelected(state.selection)) {
		const table = findTable(state.selection);
		if (table) {
			const slice: Slice =
				typeof content === 'string'
					? new Slice(Fragment.from(state.schema.text(content)), 0, 0)
					: content;
			let tr = state.tr.replace(table.pos, table.pos + table.node.nodeSize, slice);
			tr.setSelection(TextSelection.create(tr.doc, table.pos + slice.size + 1));

			const { totalRowCount, totalColumnCount } = getSelectedTableInfo(state.selection);
			editorAnalyticsAPI?.attachAnalyticsEvent({
				action: TABLE_ACTION.REPLACED,
				actionSubject: ACTION_SUBJECT.TABLE,
				attributes: { totalColumnCount, totalRowCount, inputMethod },
				eventType: EVENT_TYPE.TRACK,
			})(tr);

			return tr;
		}
	}
	return state.tr;
};
