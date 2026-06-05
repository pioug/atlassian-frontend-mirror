import { NodeSelection } from '@atlaskit/editor-prosemirror/state';
import type { Selection } from '@atlaskit/editor-prosemirror/state';
import { CellSelection } from '@atlaskit/editor-tables/cell-selection';
import { fg } from '@atlaskit/platform-feature-flags';

import { getSliceFromSelection } from './context-helpers';

/**
 * Get the local IDs from the selection.
 * @param selection The selection to get the local IDs from.
 * @returns The local IDs as an array of strings.
 */
export const getLocalIdsFromSelection = (selection?: Selection): string[] | null => {
	if (!selection) {
		return null;
	}

	if (selection instanceof NodeSelection) {
		if (fg('platform_editor_ai_selection_local_ids')) {
			const ids: string[] = [];
			const rootLocalId = selection.node.attrs?.localId;
			if (rootLocalId) {
				ids.push(rootLocalId);
			}
			selection.node.descendants((node) => {
				if (node.isInline) {
					return false;
				}
				const localId = node.attrs?.localId;
				if (localId) {
					ids.push(localId);
				}
			});
			return ids;
		}
		return [selection.node.attrs.localId];
	} else if (selection instanceof CellSelection) {
		if (fg('platform_editor_ai_selection_local_ids')) {
			const ids: string[] = [];
			const ancestorIds = new Set<string>();
			// Collect localIds from each selected cell and its descendants
			selection.forEachCell((cellNode, cellPos) => {
				const cellLocalId = cellNode.attrs?.localId;
				if (cellLocalId) {
					ids.push(cellLocalId);
				}
				cellNode.descendants((node) => {
					if (node.isInline) {
						return false;
					}
					const localId = node.attrs?.localId;
					if (localId) {
						ids.push(localId);
					}
				});
				// Collect ancestor localIds (row, table) separately
				const $cell = selection.$anchorCell.doc.resolve(cellPos + 1);
				for (let depth = $cell.depth - 1; depth >= 1; depth--) {
					const ancestor = $cell.node(depth);
					const localId = ancestor.attrs?.localId;
					if (localId) {
						ancestorIds.add(localId);
					}
				}
			});
			const uniqueIds = new Set(ids);
			const uniqueAncestors = [...ancestorIds].filter((id) => !uniqueIds.has(id));
			return [...uniqueIds, ...uniqueAncestors];
		}
		// Fall through to default slice-based behavior when gate is off
	} else if (selection.empty) {
		return [selection.$from.parent.attrs.localId];
	}

	const slice = getSliceFromSelection(selection);
	const content = slice.content;
	const ids: string[] = [];
	content.forEach((node) => {
		const localId = node.attrs?.localId;
		if (localId) {
			ids.push(localId);
		}
	});
	return ids;
};
