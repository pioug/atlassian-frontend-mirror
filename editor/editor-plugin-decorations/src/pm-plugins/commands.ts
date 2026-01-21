import { getSourceNodesFromSelectionRange } from '@atlaskit/editor-common/selection';
import type { EditorCommand } from '@atlaskit/editor-common/types';
import type { Node, ResolvedPos } from '@atlaskit/editor-prosemirror/model';
import { NodeSelection, TextSelection } from '@atlaskit/editor-prosemirror/state';
import { Decoration, DecorationSet } from '@atlaskit/editor-prosemirror/view';
import { CellSelection, TableMap } from '@atlaskit/editor-tables';
import { findTableClosestToPos } from '@atlaskit/editor-tables/utils';
import { expValEqualsNoExposure } from '@atlaskit/tmp-editor-statsig/exp-val-equals-no-exposure';

import type { HoverDecorationCommand } from '../decorationsPluginType';

import { ACTIONS, decorationStateKey } from './main';

export const hoverDecorationCommand: HoverDecorationCommand =
	({ add, className = 'danger selected' }) =>
	({ tr }) => {
		// Use the provided selection (e.g., preservedSelection) or fall back to tr.selection
		const selection = tr.selection;
		const decorations: Decoration[] = [];

		const handleTableSelection = (pos: ResolvedPos = selection.$from) => {
			const table = findTableClosestToPos(pos);
			if (!table) {
				return tr;
			}

			const tableNode = table.node;
			const tablePos = table.pos;

			decorations.push(
				Decoration.node(
					tablePos,
					tablePos + tableNode.nodeSize,
					{ class: className },
					{ key: `decorationNode-table-${tablePos}` },
				),
			);

			const map = TableMap.get(tableNode);
			const cellPositions = new Set(map.map);

			cellPositions.forEach((cellPos) => {
				const docPos = tablePos + cellPos + 1;
				const cell = tableNode.nodeAt(cellPos);
				if (cell) {
					decorations.push(
						Decoration.node(
							docPos,
							docPos + cell.nodeSize,
							{ class: className },
							{ key: `decorationNode-cell-${docPos}` },
						),
					);
				}
			});
		};

		const handleNodeSelection = (node: Node, pos: number) => {
			const from = pos;
			const to = from + node.nodeSize;

			decorations.push(Decoration.node(from, to, { class: className }, { key: 'decorationNode' }));

			if (node.type.name === 'layoutSection' || node.type.name === 'layoutColumn') {
				const startOfInsideOfContainer = tr.doc.resolve(from + 1);
				const endOfInsideOfContainer = tr.doc.resolve(to - 1);
				handleNodesSelection(startOfInsideOfContainer, endOfInsideOfContainer);
			}
		};

		const handleNodesSelection = ($from: ResolvedPos, $to: ResolvedPos) => {
			let currentPos = $from.pos;

			const sourceNodes = getSourceNodesFromSelectionRange(
				tr,
				TextSelection.create(tr.doc, currentPos, $to.pos),
			);

			sourceNodes.forEach((sourceNode) => {
				if (sourceNode.type.name === 'table') {
					const startPosOfTable = tr.doc.resolve(currentPos + 3);
					handleTableSelection(startPosOfTable);
				} else {
					handleNodeSelection(sourceNode, currentPos);
				}
				currentPos += sourceNode.nodeSize;
			});
		};

		// Selecting a table directly: CellSelection
		if (selection instanceof CellSelection) {
			handleTableSelection();
		}

		// multiselect: TextSelection
		if (selection instanceof TextSelection) {
			handleNodesSelection(selection.$from, selection.$to);
		}

		if (selection instanceof NodeSelection) {
			handleNodeSelection(selection.node, selection.from);
		}

		// If no decorations were created, return early
		if (decorations.length === 0) {
			return tr;
		}

		tr.setMeta(decorationStateKey, {
			action: add ? ACTIONS.DECORATION_ADD : ACTIONS.DECORATION_REMOVE,
			data: DecorationSet.create(tr.doc, decorations),
			hasDangerDecorations: expValEqualsNoExposure('platform_editor_block_menu', 'isEnabled', true)
				? className === 'danger'
				: undefined,
		}).setMeta('addToHistory', false);

		return tr;
	};

export const removeDecorationCommand =
	(): EditorCommand =>
	({ tr }) => {
		return tr.setMeta(decorationStateKey, {
			action: ACTIONS.DECORATION_REMOVE,
		});
	};
