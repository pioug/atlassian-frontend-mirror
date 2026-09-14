import type { ResolvedPos } from '@atlaskit/editor-prosemirror/model';

import { CellSelection } from '../cell-selection';
import { TableMap } from '../table-map';
import { findTableClosestToPos } from './find-table-closest-to-pos';

export const getTableSelectionClosesToPos = ($pos: ResolvedPos): CellSelection | undefined => {
	const table = findTableClosestToPos($pos);
	if (table) {
		const { map } = TableMap.get(table.node);
		if (map && map.length) {
			const head = table.start + map[0];
			const anchor = table.start + map[map.length - 1];
			const $head = $pos.doc.resolve(head);
			const $anchor = $pos.doc.resolve(anchor);

			return new CellSelection($anchor, $head);
		}
	}
};
