import { Fragment, type ResolvedPos, Node as PMNode } from '@atlaskit/editor-prosemirror/model';
import { type Transaction } from '@atlaskit/editor-prosemirror/state';
import { findParentNodeClosestToPos } from '@atlaskit/editor-prosemirror/utils';
import { editorExperiment } from '@atlaskit/tmp-editor-statsig/experiments';

import { isFragmentOfType } from './check-fragment';
import { MIN_LAYOUT_COLUMN } from './consts';
import { updateColumnWidths } from './update-column-widths';

export const removeFromSource = (tr: Transaction, $from: ResolvedPos, to?: number) => {
	let sourceContent: PMNode | Fragment | null = $from.nodeAfter;
	let isLayoutColumn = sourceContent?.type.name === 'layoutColumn';
	let sourceNodeEndPos = $from.pos + (sourceContent?.nodeSize || 1);

	if (editorExperiment('platform_editor_element_drag_and_drop_multiselect', true)) {
		sourceContent = tr.doc.slice($from.pos, to).content;
		isLayoutColumn = isFragmentOfType(sourceContent, 'layoutColumn');
		sourceNodeEndPos = to === undefined ? $from.pos + sourceContent.size : to;
	}

	if (!sourceContent) {
		return tr;
	}

	if (isLayoutColumn) {
		const sourceParent = $from.parent;
		if (sourceParent.childCount === MIN_LAYOUT_COLUMN) {
			tr.delete($from.pos + 1, sourceNodeEndPos - 1);

			// Currently, we assume that the MIN_LAYOUT_COLUMN is set to 2.
			// This value may require an update when we introduce support for a single-column layout.
			if (sourceParent.childCount === 2) {
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
