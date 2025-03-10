import { ACTION_SUBJECT_ID } from '@atlaskit/editor-common/analytics';
import type { Node, NodeType, Schema } from '@atlaskit/editor-prosemirror/model';
import type { Transaction } from '@atlaskit/editor-prosemirror/state';
import { liftTarget } from '@atlaskit/editor-prosemirror/transform';
import { CellSelection } from '@atlaskit/editor-tables/cell-selection';

// Functions duplicated from platform/packages/editor/editor-plugin-text-formatting/src/editor-commands/clear-formatting.ts
// TODO: ED-26959 - Refactor to avoid duplication if platform_editor_blockquote_in_text_formatting_menu experiment is productionalised
export const FORMATTING_NODE_TYPES = ['heading', 'blockquote'];
export const FORMATTING_MARK_TYPES = [
	'em',
	'code',
	'strike',
	'strong',
	'underline',
	'textColor',
	'subsup',
	'backgroundColor',
];

export const formatTypes: Record<string, string> = {
	em: ACTION_SUBJECT_ID.FORMAT_ITALIC,
	code: ACTION_SUBJECT_ID.FORMAT_CODE,
	strike: ACTION_SUBJECT_ID.FORMAT_STRIKE,
	strong: ACTION_SUBJECT_ID.FORMAT_STRONG,
	underline: ACTION_SUBJECT_ID.FORMAT_UNDERLINE,
	textColor: ACTION_SUBJECT_ID.FORMAT_COLOR,
	subsup: 'subsup',
	backgroundColor: ACTION_SUBJECT_ID.FORMAT_BACKGROUND_COLOR,
};

export const cellSelectionNodesBetween = (
	selection: CellSelection,
	doc: Node,
	f: (node: Node, pos: number, parent: Node | null, index: number) => void | boolean,
	startPos?: number,
) => {
	selection.forEachCell((cell, cellPos) => {
		doc.nodesBetween(cellPos, cellPos + cell.nodeSize, f, startPos);
	});
};

export function clearNodeFormattingOnSelection(
	schema: Schema,
	tr: Transaction,
	formattedNodeType: NodeType,
	nodeName: string,
	formattingCleared: string[],
) {
	return function (node: Node, pos: number) {
		if (node.type === formattedNodeType) {
			if (formattedNodeType.isTextblock) {
				tr.setNodeMarkup(pos, schema.nodes.paragraph);
				formattingCleared.push(nodeName);
				return false;
			} else {
				// In case of panel or blockquote
				const fromPos = tr.doc.resolve(pos + 1);
				const toPos = tr.doc.resolve(pos + node.nodeSize - 1);
				const nodeRange = fromPos.blockRange(toPos);
				if (nodeRange) {
					const targetLiftDepth = liftTarget(nodeRange);
					if (targetLiftDepth || targetLiftDepth === 0) {
						formattingCleared.push(nodeName);
						// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
						tr.lift(nodeRange, targetLiftDepth!);
					}
				}
			}
		}
		return true;
	};
}
