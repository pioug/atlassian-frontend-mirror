import { Fragment, type ResolvedPos } from '@atlaskit/editor-prosemirror/model';
import { type Transaction } from '@atlaskit/editor-prosemirror/state';
import { findParentNodeClosestToPos } from '@atlaskit/editor-prosemirror/utils';
import { fg } from '@atlaskit/platform-feature-flags';

import { MIN_LAYOUT_COLUMN } from './consts';
import { updateColumnWidths } from './update-column-widths';

export const removeFromSource = (tr: Transaction, $from: ResolvedPos) => {
	const sourceNode = $from.nodeAfter;
	const sourceParent = $from.parent;

	if (!sourceNode) {
		return tr;
	}

	const sourceNodeEndPos = $from.pos + sourceNode.nodeSize;

	if (sourceNode.type.name === 'layoutColumn') {
		if (sourceParent.childCount === MIN_LAYOUT_COLUMN) {
			tr.delete($from.pos + 1, sourceNodeEndPos - 1);

			// Currently, we assume that the MIN_LAYOUT_COLUMN is set to 2.
			// This value may require an update when we introduce support for a single-column layout.
			if (
				sourceParent.childCount === 2 &&
				fg('platform_editor_advanced_layouts_DnD_remove_layout')
			) {
				const layoutContentFragment =
					$from.parentOffset === 0
						? Fragment.from($from.parent.lastChild?.content)
						: Fragment.from($from.parent.firstChild?.content);

				const parent = findParentNodeClosestToPos($from, (node) => {
					return node.type.name === 'layoutSection';
				});

				if (parent && layoutContentFragment) {
					const layoutSectionPos = tr.mapping.map(parent.pos);
					// get the updated layout node size
					const layoutSectionNodeSize = tr.doc.resolve(layoutSectionPos).nodeAfter?.nodeSize || 0;
					tr.replaceWith(
						layoutSectionPos,
						layoutSectionPos + layoutSectionNodeSize,
						layoutContentFragment,
					);
				}
			}

			return tr;
		} else {
			updateColumnWidths(tr, $from.parent, $from.before($from.depth), sourceParent.childCount - 1);
		}
	}

	tr.delete($from.pos, sourceNodeEndPos);
	return tr;
};
