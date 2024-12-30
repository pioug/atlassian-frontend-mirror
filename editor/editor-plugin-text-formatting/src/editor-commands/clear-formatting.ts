import type { EditorAnalyticsAPI, INPUT_METHOD } from '@atlaskit/editor-common/analytics';
import {
	ACTION,
	ACTION_SUBJECT,
	ACTION_SUBJECT_ID,
	EVENT_TYPE,
} from '@atlaskit/editor-common/analytics';
import type { Command } from '@atlaskit/editor-common/types';
import type { Node, NodeType } from '@atlaskit/editor-prosemirror/model';
import type { EditorState, Transaction } from '@atlaskit/editor-prosemirror/state';
import { liftTarget } from '@atlaskit/editor-prosemirror/transform';
import { CellSelection } from '@atlaskit/editor-tables/cell-selection';

import { cellSelectionNodesBetween } from './utils/cell-selection';

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

const formatTypes: Record<string, string> = {
	em: ACTION_SUBJECT_ID.FORMAT_ITALIC,
	code: ACTION_SUBJECT_ID.FORMAT_CODE,
	strike: ACTION_SUBJECT_ID.FORMAT_STRIKE,
	strong: ACTION_SUBJECT_ID.FORMAT_STRONG,
	underline: ACTION_SUBJECT_ID.FORMAT_UNDERLINE,
	textColor: ACTION_SUBJECT_ID.FORMAT_COLOR,
	subsup: 'subsup',
	backgroundColor: ACTION_SUBJECT_ID.FORMAT_BACKGROUND_COLOR,
};

export function clearFormattingWithAnalytics(
	inputMethod: INPUT_METHOD.TOOLBAR | INPUT_METHOD.SHORTCUT | INPUT_METHOD.FLOATING_TB,
	editorAnalyticsAPI: EditorAnalyticsAPI | undefined,
): Command {
	return clearFormatting(inputMethod, editorAnalyticsAPI);
}

// Ignored via go/ees005
// eslint-disable-next-line @typescript-eslint/max-params
function clearNodeFormattingOnSelection(
	state: EditorState,
	tr: Transaction,
	formattedNodeType: NodeType,
	nodeName: string,
	formattingCleared: string[],
) {
	return function (node: Node, pos: number) {
		if (node.type === formattedNodeType) {
			if (formattedNodeType.isTextblock) {
				tr.setNodeMarkup(pos, state.schema.nodes.paragraph);
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
						// Ignored via go/ees005
						// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
						tr.lift(nodeRange, targetLiftDepth!);
					}
				}
			}
		}
		return true;
	};
}

export function clearFormatting(
	inputMethod?: INPUT_METHOD.TOOLBAR | INPUT_METHOD.SHORTCUT | INPUT_METHOD.FLOATING_TB,
	editorAnalyticsAPI?: EditorAnalyticsAPI | undefined,
): Command {
	return function (state, dispatch): boolean {
		const { tr } = state;
		const formattingCleared: string[] = [];

		FORMATTING_MARK_TYPES.forEach((mark) => {
			const { from, to } = tr.selection;
			const markType = state.schema.marks[mark];

			if (!markType) {
				return;
			}

			if (tr.selection instanceof CellSelection) {
				cellSelectionNodesBetween(tr.selection, tr.doc, (node, pos): boolean => {
					const isTableCell =
						node.type === state.schema.nodes.tableCell ||
						node.type === state.schema.nodes.tableHeader;

					if (!isTableCell) {
						return true;
					}

					if (tr.doc.rangeHasMark(pos, pos + node.nodeSize, markType)) {
						formattingCleared.push(formatTypes[mark]);
						tr.removeMark(pos, pos + node.nodeSize, markType);
					}

					return false;
				});
			} else if (tr.doc.rangeHasMark(from, to, markType)) {
				formattingCleared.push(formatTypes[mark]);
				tr.removeMark(from, to, markType);
			}
		});

		FORMATTING_NODE_TYPES.forEach((nodeName) => {
			const formattedNodeType = state.schema.nodes[nodeName];
			const { $from, $to } = tr.selection;
			if (tr.selection instanceof CellSelection) {
				cellSelectionNodesBetween(
					tr.selection,
					tr.doc,
					clearNodeFormattingOnSelection(state, tr, formattedNodeType, nodeName, formattingCleared),
				);
			} else {
				tr.doc.nodesBetween(
					$from.pos,
					$to.pos,
					clearNodeFormattingOnSelection(state, tr, formattedNodeType, nodeName, formattingCleared),
				);
			}
		});

		tr.setStoredMarks([]);

		if (formattingCleared.length && inputMethod) {
			editorAnalyticsAPI?.attachAnalyticsEvent({
				action: ACTION.FORMATTED,
				eventType: EVENT_TYPE.TRACK,
				actionSubject: ACTION_SUBJECT.TEXT,
				actionSubjectId: ACTION_SUBJECT_ID.FORMAT_CLEAR,
				attributes: {
					inputMethod,
					formattingCleared,
				},
			})(tr);
		}

		if (dispatch) {
			dispatch(tr);
		}
		return true;
	};
}
