// Disable no-re-export rule for entry point files
/* eslint-disable @atlaskit/editor/no-re-export */

import type { Node as PmNode } from '@atlaskit/editor-prosemirror/model';
import type { EditorState, Selection } from '@atlaskit/editor-prosemirror/state';
import { AllSelection, NodeSelection, TextSelection } from '@atlaskit/editor-prosemirror/state';
import type { EditorView } from '@atlaskit/editor-prosemirror/view';
import { CellSelection } from '@atlaskit/editor-tables';
import { selectedRect } from '@atlaskit/editor-tables/utils';

import type { AnalyticsEventPayload } from '../analytics';
import { ACTION, ACTION_SUBJECT, ACTION_SUBJECT_ID, EVENT_TYPE } from '../analytics';
import type { Command } from '../types';

export { RelativeSelectionPos } from './types';
export type {
	SelectionPluginState,
	EditorSelectionAPI,
	SelectionPluginOptions,
	SelectionSharedState,
	SetSelectionRelativeToNode,
} from './types';

export { GapCursorSelection, Side, JSON_ID, GapBookmark } from './gap-cursor/selection';

export { setSelectionTopLevelBlocks, setGapCursorAtPos } from './gap-cursor/actions';

export { isIgnored } from './gap-cursor/utils/is-ignored';
export { isValidTargetNode } from './gap-cursor/utils/is-valid-target-node';
export { setGapCursorSelection } from './gap-cursor/utils/setGapCursorSelection';
export { hideCaretModifier, gapCursorStyles } from './gap-cursor/styles';

export {
	atTheBeginningOfBlock,
	atTheBeginningOfDoc,
	atTheEndOfBlock,
	atTheEndOfDoc,
	deleteSelectedRange,
	endPositionOfParent,
	expandSelectionBounds,
	expandSelectionToBlockRange,
	expandToBlockRange,
	isMultiBlockRange,
	isMultiBlockSelection,
	isSelectionAtEndOfNode,
	isSelectionAtStartOfNode,
	startPositionOfParent,
} from './utils';

export function getNodeSelectionAnalyticsPayload(
	selection: Selection,
): AnalyticsEventPayload | undefined {
	if (selection instanceof NodeSelection) {
		return {
			action: ACTION.SELECTED,
			actionSubject: ACTION_SUBJECT.DOCUMENT,
			actionSubjectId: ACTION_SUBJECT_ID.NODE,
			eventType: EVENT_TYPE.TRACK,
			attributes: { node: selection.node.type.name },
		};
	}
}

export function getAllSelectionAnalyticsPayload(
	selection: Selection,
): AnalyticsEventPayload | undefined {
	if (selection instanceof AllSelection) {
		return {
			action: ACTION.SELECTED,
			actionSubject: ACTION_SUBJECT.DOCUMENT,
			actionSubjectId: ACTION_SUBJECT_ID.ALL,
			eventType: EVENT_TYPE.TRACK,
		};
	}
}

export function getCellSelectionAnalyticsPayload(
	state: EditorState,
): AnalyticsEventPayload | undefined {
	if (state.selection instanceof CellSelection) {
		const rect = selectedRect(state);
		const selectedCells = rect.map.cellsInRect(rect).length;
		const totalCells = rect.map.map.length;
		return {
			action: ACTION.SELECTED,
			actionSubject: ACTION_SUBJECT.DOCUMENT,
			actionSubjectId: ACTION_SUBJECT_ID.CELL,
			eventType: EVENT_TYPE.TRACK,
			attributes: {
				selectedCells,
				totalCells,
			},
		};
	}
}

export function getRangeSelectionAnalyticsPayload(
	selection: Selection,
	doc: PmNode,
): AnalyticsEventPayload | undefined {
	if (selection instanceof TextSelection && selection.from !== selection.to) {
		const { from, to, anchor, head } = selection;

		const nodes: string[] = [];
		doc.nodesBetween(from, to, (node, pos) => {
			// We want to send top-level nodes only, ie.the nodes that would have the selection styling
			// We allow text nodes that are not fully covered as they are a special case
			if (node.isText || (pos >= from && pos + node.nodeSize <= to)) {
				nodes.push(node.type.name);
				return false;
			}
		});

		return {
			action: ACTION.SELECTED,
			actionSubject: ACTION_SUBJECT.DOCUMENT,
			actionSubjectId: ACTION_SUBJECT_ID.RANGE,
			eventType: EVENT_TYPE.TRACK,
			attributes: {
				from: anchor,
				to: head,
				nodes,
			},
		};
	}
}

/**
 * Insert content, delete a range and create a new selection
 * This function automatically handles the mapping of positions for insertion and deletion.
 * The new selection is handled as a function since it may not always be necessary to resolve a position to the transactions mapping
 *
 * @param getSelectionResolvedPos get the resolved position to create a new selection
 * @param insertions content to insert at the specified position
 * @param deletions the ranges to delete
 */

export const selectNode =
	(pos: number): Command =>
	(state, dispatch) => {
		if (dispatch) {
			dispatch(state.tr.setSelection(new NodeSelection(state.doc.resolve(pos))));
		}
		return true;
	};
export function createSelectionClickHandler(
	nodes: string[],
	isValidTarget: (target: HTMLElement) => boolean,
	options: {
		getNodeSelectionPos?: (state: EditorState, nodePos: number) => number;
		useLongPressSelection: boolean;
	},
) {
	return function handleClickOn(
		view: EditorView,
		_pos: number,
		node: PmNode,
		nodePos: number,
		event: MouseEvent,
		direct: boolean,
	) {
		if (options.useLongPressSelection) {
			return false;
		}
		if (direct && nodes.indexOf(node.type.name) !== -1) {
			const target = event.target;

			if (target instanceof HTMLElement && isValidTarget(target)) {
				const selectionPos = options.getNodeSelectionPos
					? options.getNodeSelectionPos(view.state, nodePos)
					: nodePos;
				selectNode(selectionPos)(view.state, view.dispatch);
				return true;
			}
		}
		return false;
	};
}
