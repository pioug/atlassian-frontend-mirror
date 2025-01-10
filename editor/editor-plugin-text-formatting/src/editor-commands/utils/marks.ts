import {
	entireSelectionContainsMark,
	transformNonTextNodesToText,
} from '@atlaskit/editor-common/mark';
import type { EditorCommand, ExtractInjectionAPI } from '@atlaskit/editor-common/types';
import type { Mark, MarkType, Node as PMNode } from '@atlaskit/editor-prosemirror/model';
import { TextSelection } from '@atlaskit/editor-prosemirror/state';
import type { Transaction } from '@atlaskit/editor-prosemirror/state';
import { CellSelection } from '@atlaskit/editor-tables/cell-selection';
import { fg } from '@atlaskit/platform-feature-flags';

import type { TextFormattingPlugin } from '../../textFormattingPluginType';

/**
 * A custom version of the ProseMirror toggleMark, where we only toggle marks
 * on text nodes in the selection rather than all inline nodes.
 * @param markType
 * @param attrs
 */
export const nextToggleMark =
	(
		markType: MarkType,
		api: ExtractInjectionAPI<TextFormattingPlugin> | undefined,
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		attrs?: { [key: string]: any },
	): EditorCommand =>
	({ tr }) => {
		const mark = markType.create(attrs);

		// For cursor selections we can use the default behaviour.
		if (tr.selection instanceof TextSelection && tr.selection.$cursor) {
			if (mark.isInSet(tr.storedMarks || tr.selection.$cursor.marks())) {
				tr.removeStoredMark(mark);
			} else {
				tr.addStoredMark(mark);
			}

			return tr;
		}

		return nextToggleMarkInRange(mark, api)({ tr });
	};

const nextToggleMarkInRange =
	(mark: Mark, api: ExtractInjectionAPI<TextFormattingPlugin> | undefined): EditorCommand =>
	({ tr }) => {
		if (tr.selection instanceof CellSelection) {
			let removeMark = true;
			const cells: { node: PMNode; pos: number }[] = [];
			tr.selection.forEachCell((cell, cellPos) => {
				cells.push({ node: cell, pos: cellPos });
				const from = cellPos;
				const to = cellPos + cell.nodeSize;

				removeMark && (removeMark = entireSelectionContainsMark(mark, tr.doc, from, to));
			});

			for (let i = cells.length - 1; i >= 0; i--) {
				const cell = cells[i];
				const from = cell.pos;
				const to = from + cell.node.nodeSize;

				nextApplyMarkOnRange(from, to, removeMark, mark, tr, api);
			}
		} else {
			const { $from, $to } = tr.selection;
			// We decide to remove the mark only if the entire selection contains the mark
			// Examples with *bold* text
			// Scenario 1: Selection contains both bold and non-bold text -> bold entire selection
			// Scenario 2: Selection contains only bold text -> un-bold entire selection
			// Scenario 3: Selection contains no bold text -> bold entire selection
			const removeMark = entireSelectionContainsMark(mark, tr.doc, $from.pos, $to.pos);

			nextApplyMarkOnRange($from.pos, $to.pos, removeMark, mark, tr, api);
		}

		if (tr.docChanged) {
			return tr;
		}

		return null;
	};

export const nextApplyMarkOnRange = (
	from: number,
	to: number,
	removeMark: boolean,
	mark: Mark,
	tr: Transaction,
	api: ExtractInjectionAPI<TextFormattingPlugin> | undefined,
	// eslint-disable-next-line @typescript-eslint/max-params
) => {
	const { schema } = tr.doc.type;
	const { code } = schema.marks;
	if (mark.type === code) {
		if (fg('platform_editor_resolve_marks')) {
			api?.base?.actions.resolveMarks(from, to, tr);
		} else {
			transformNonTextNodesToText(from, to, tr);
		}
	}

	/**
	 * We should refactor this so text formatting doesn't reference plugins it doesn't know about.
	 */
	tr.doc.nodesBetween(tr.mapping.map(from), tr.mapping.map(to), (node, pos) => {
		if (fg('editor_inline_comments_on_inline_nodes')) {
			if (!node.isText) {
				const isAllowedInlineNode = ['emoji', 'status', 'date', 'mention', 'inlineCard'].includes(
					node.type.name,
				);
				if (!isAllowedInlineNode) {
					return true;
				}
			}
		} else {
			if (!node.isText) {
				return true;
			}
		}

		// This is an issue when the user selects some text.
		// We need to check if the current node position is less than the range selection from.
		// If it’s true, that means we should apply the mark using the range selection,
		// not the current node position.
		const nodeBetweenFrom = Math.max(pos, tr.mapping.map(from));
		const nodeBetweenTo = Math.min(pos + node.nodeSize, tr.mapping.map(to));

		if (removeMark) {
			tr.removeMark(nodeBetweenFrom, nodeBetweenTo, mark);
		} else {
			tr.addMark(nodeBetweenFrom, nodeBetweenTo, mark);
		}

		return true;
	});

	return tr;
};
