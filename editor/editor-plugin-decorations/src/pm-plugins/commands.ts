import type { EditorCommand } from '@atlaskit/editor-common/types';
import { type Node } from '@atlaskit/editor-prosemirror/model';
import { NodeSelection, TextSelection } from '@atlaskit/editor-prosemirror/state';
import { findParentNodeOfType } from '@atlaskit/editor-prosemirror/utils';
import { Decoration, DecorationSet } from '@atlaskit/editor-prosemirror/view';
import { CellSelection, findTable, TableMap } from '@atlaskit/editor-tables';
import { getSelectionRect } from '@atlaskit/editor-tables/utils';
import { expValEqualsNoExposure } from '@atlaskit/tmp-editor-statsig/exp-val-equals-no-exposure';
import { token } from '@atlaskit/tokens';

import type { HoverDecorationCommand } from '../decorationsPluginType';

import { ACTIONS, decorationStateKey } from './main';

export const hoverDecorationCommand: HoverDecorationCommand =
	({ nodeType, add, className = 'danger' }) =>
	({ tr }) => {
		let from: number | undefined;
		let parentNode: Node | undefined;

		let decoration: Decoration | DecorationSet;

		if (tr.selection instanceof NodeSelection) {
			const selectedNode = tr.selection.node;
			const nodeTypes = Array.isArray(nodeType) ? nodeType : [nodeType];
			const isNodeTypeMatching = nodeTypes.indexOf(selectedNode.type) > -1;
			// This adds danger styling if the selected node is the one that requires
			// the decoration to be added, e.g. if a layout is selected and the user
			// hovers over the layout's delete button.
			if (isNodeTypeMatching) {
				from = tr.selection.from;
				parentNode = selectedNode;
			}
		}

		// This adds danger styling if the selection is not a node selection, OR if
		// the selected node is a child of the one that requires the decoration to
		// be added, e.g. if a decision item is selected inside a layout and the
		// user hovers over the layout's delete button.
		const foundParentNode = findParentNodeOfType(nodeType)(tr.selection);
		if (from === undefined && foundParentNode) {
			from = foundParentNode.pos;
			parentNode = foundParentNode.node;
		}

		// Note: can't use !from as from could be 0, which is falsy but valid
		if (from === undefined || parentNode === undefined) {
			return tr;
		}

		decoration = Decoration.node(
			from,
			from + parentNode.nodeSize,
			{
				class: className,
			},
			{ key: 'decorationNode' },
		);

		if (tr.selection instanceof TextSelection) {
			decoration = Decoration.inline(
				from,
				tr.selection.to,
				{
					class: className,
					style: `background-color: ${token('color.background.danger')};`,
				},
				{ key: 'decorationNode' },
			);
		}

		if (tr.selection instanceof CellSelection) {
			const table = findTable(tr.selection);
			if (!table) {
				return tr;
			}
			const map = TableMap.get(table.node);
			const rect = getSelectionRect(tr.selection);
			if (!map || !rect) {
				return tr;
			}
			const updatedCells = map.cellsInRect(rect).map((x) => x + table.start);
			const tableCellDecorations = updatedCells
				.map((pos) => {
					const cell = tr.doc.nodeAt(pos);
					if (!cell) {
						return;
					}
					return Decoration.node(
						pos,
						pos + cell.nodeSize,
						{
							class: className,
						},
						{ key: 'decorationNode' },
					);
				})
				.filter((decoration) => !!decoration);

			decoration = DecorationSet.create(tr.doc, tableCellDecorations);
		}

		tr.setMeta(decorationStateKey, {
			action: add ? ACTIONS.DECORATION_ADD : ACTIONS.DECORATION_REMOVE,
			data: decoration,
			hasDangerDecorations:
				expValEqualsNoExposure('platform_editor_block_menu', 'isEnabled', true) &&
				expValEqualsNoExposure('platform_editor_block_menu_keyboard_navigation', 'isEnabled', true)
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
