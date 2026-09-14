import type { ResolvedPos } from '@atlaskit/editor-prosemirror/model';
import type { Transaction } from '@atlaskit/editor-prosemirror/state';
import { editorExperiment } from '@atlaskit/tmp-editor-statsig/editor-experiment';

import { CellSelection } from '../cell-selection';
import { TableMap } from '../table-map';
import { cloneTr } from './clone-tr';
import { findTableClosestToPos } from './find-table-closest-to-pos';
import { getTableSelectionClosesToPos } from './get-table-selection-closes-to-pos';

export const selectTableClosestToPos = (tr: Transaction, $pos: ResolvedPos): Transaction => {
	if (editorExperiment('platform_editor_block_menu', true, { exposure: true })) {
		const tableSelection = getTableSelectionClosesToPos($pos);
		if (tableSelection) {
			return cloneTr(tr.setSelection(tableSelection));
		}

		return tr;
	}

	const table = findTableClosestToPos($pos);
	if (table) {
		const { map } = TableMap.get(table.node);
		if (map && map.length) {
			const head = table.start + map[0];
			const anchor = table.start + map[map.length - 1];
			const $head = tr.doc.resolve(head);
			const $anchor = tr.doc.resolve(anchor);

			return cloneTr(tr.setSelection(new CellSelection($anchor, $head)));
		}
	}

	return tr;
};
