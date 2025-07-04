import {
	Fragment,
	type ResolvedPos,
	type Node as PMNode,
} from '@atlaskit/editor-prosemirror/model';
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

	/**
	 * This logic is used to handle the case when a user tries to delete a layout column
	 * that contains only 2 child node, and single column layouts are not enabled.
	 * In this case, we delete the layout column and replace it with its content.
	 */
	if (isLayoutColumn && !editorExperiment('single_column_layouts', true)) {
		const sourceParent = $from.parent;

		if (sourceParent.childCount === MIN_LAYOUT_COLUMN) {
			// Only delete the layout content, but keep the layout column itself
			// This logic should be remove when we clean up the code for single column layouts.
			// since this step has no effect on the layout column, because the parent node is removed in the later step.
			tr.delete($from.pos + 1, sourceNodeEndPos - 1);

			// This check should be remove when clean up the code for single column layouts.
			// since it has been checked in the previous step.
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
