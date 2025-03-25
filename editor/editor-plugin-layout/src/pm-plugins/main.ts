import { SafePlugin } from '@atlaskit/editor-common/safe-plugin';
import { createSelectionClickHandler } from '@atlaskit/editor-common/selection';
import type { Command } from '@atlaskit/editor-common/types';
import { filterCommand as filter } from '@atlaskit/editor-common/utils';
import { keydownHandler } from '@atlaskit/editor-prosemirror/keymap';
import { Fragment, type Node } from '@atlaskit/editor-prosemirror/model';
import type { EditorState } from '@atlaskit/editor-prosemirror/state';
import { NodeSelection, Selection, TextSelection } from '@atlaskit/editor-prosemirror/state';
import {
	findParentNodeClosestToPos,
	findParentNodeOfType,
} from '@atlaskit/editor-prosemirror/utils';
import { Decoration, DecorationSet } from '@atlaskit/editor-prosemirror/view';
import { editorExperiment } from '@atlaskit/tmp-editor-statsig/experiments';

import type { LayoutPluginOptions } from '../types';

import { fixColumnSizes, fixColumnStructure, getSelectedLayout } from './actions';
import { EVEN_DISTRIBUTED_COL_WIDTHS } from './consts';
import { pluginKey } from './plugin-key';
import type { Change, LayoutState } from './types';
import { getMaybeLayoutSection } from './utils';

export const DEFAULT_LAYOUT = 'two_equal';

const isWholeSelectionInsideLayoutColumn = (state: EditorState): boolean => {
	// Since findParentNodeOfType doesn't check if selection.to shares the parent, we do this check ourselves
	const fromParent = findParentNodeOfType(state.schema.nodes.layoutColumn)(state.selection);
	if (fromParent) {
		const isToPosInsideSameLayoutColumn =
			state.selection.from < fromParent.pos + fromParent.node.nodeSize;
		return isToPosInsideSameLayoutColumn;
	}
	return false;
};

const moveCursorToNextColumn: Command = (state, dispatch) => {
	const { selection } = state;
	const {
		schema: {
			nodes: { layoutColumn, layoutSection },
		},
	} = state;
	// Ignored via go/ees005
	// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
	const section = findParentNodeOfType(layoutSection)(selection)!;
	// Ignored via go/ees005
	// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
	const column = findParentNodeOfType(layoutColumn)(selection)!;

	if (column.node !== section.node.lastChild) {
		const $nextColumn = state.doc.resolve(column.pos + column.node.nodeSize);
		const shiftedSelection = TextSelection.findFrom($nextColumn, 1);

		if (dispatch) {
			dispatch(state.tr.setSelection(shiftedSelection as TextSelection));
		}
	}
	return true;
};

const getNodeDecoration = (pos: number, node: Node) => [
	Decoration.node(pos, pos + node.nodeSize, { class: 'selected' }),
];

const getInitialPluginState = (options: LayoutPluginOptions, state: EditorState): LayoutState => {
	const maybeLayoutSection = getMaybeLayoutSection(state);
	const allowBreakout = options.allowBreakout || false;
	const addSidebarLayouts = options.UNSAFE_addSidebarLayouts || false;
	const allowSingleColumnLayout = options.UNSAFE_allowSingleColumnLayout || false;
	const pos = maybeLayoutSection ? maybeLayoutSection.pos : null;
	const selectedLayout = getSelectedLayout(
		maybeLayoutSection && maybeLayoutSection.node,
		DEFAULT_LAYOUT,
	);
	return {
		pos,
		allowBreakout,
		addSidebarLayouts,
		selectedLayout,
		allowSingleColumnLayout,
	};
};

// To prevent a single-column layout,
// if a user attempts to delete a layout column and
// we will force remove the content instead.
// There are some edge cases where user can delete a layout column
// see packages/editor/editor-plugin-layout-tests/src/__tests__/unit/delete.ts
const handleDeleteLayoutColumn: Command = (state, dispatch) => {
	const sel = state.selection;
	if (
		sel instanceof NodeSelection &&
		sel.node.type.name === 'layoutColumn' &&
		sel.$from.parent.type.name === 'layoutSection' &&
		sel.$from.parent.childCount === 2 &&
		dispatch &&
		editorExperiment('advanced_layouts', true)
	) {
		const tr = state.tr;
		const layoutContentFragment =
			sel.$from.parentOffset === 0
				? Fragment.from(sel.$from.parent.lastChild?.content)
				: Fragment.from(sel.$from.parent.firstChild?.content);
		const parent = findParentNodeClosestToPos(sel.$from, (node) => {
			return node.type.name === 'layoutSection';
		});

		if (parent) {
			const layoutSectionPos = tr.mapping.map(parent.pos);
			const layoutSectionNodeSize = parent.node.nodeSize;

			dispatch(
				state.tr.replaceWith(
					layoutSectionPos,
					layoutSectionPos + layoutSectionNodeSize,
					layoutContentFragment,
				),
			);
			return true;
		}
		return false;
	}

	return false;
};

export default (options: LayoutPluginOptions) =>
	new SafePlugin<LayoutState>({
		key: pluginKey,
		state: {
			init: (_, state): LayoutState => getInitialPluginState(options, state),

			apply: (tr, pluginState, _oldState, newState) => {
				if (tr.docChanged || tr.selectionSet) {
					const maybeLayoutSection = getMaybeLayoutSection(newState);

					const newPluginState = {
						...pluginState,
						pos: maybeLayoutSection ? maybeLayoutSection.pos : null,
						selectedLayout: getSelectedLayout(
							maybeLayoutSection && maybeLayoutSection.node,
							// Ignored via go/ees005
							// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
							pluginState.selectedLayout!,
						),
					};
					return newPluginState;
				}
				return pluginState;
			},
		},
		props: {
			decorations(state) {
				const layoutState = pluginKey.getState(state) as LayoutState;
				if (layoutState.pos !== null) {
					return DecorationSet.create(
						state.doc,
						getNodeDecoration(layoutState.pos, state.doc.nodeAt(layoutState.pos) as Node),
					);
				}
				return undefined;
			},
			handleKeyDown: keydownHandler({
				Tab: filter(isWholeSelectionInsideLayoutColumn, moveCursorToNextColumn),
				'Mod-Backspace': handleDeleteLayoutColumn,
				'Mod-Delete': handleDeleteLayoutColumn,
				Backspace: handleDeleteLayoutColumn,
				Delete: handleDeleteLayoutColumn,
			}),
			handleClickOn: createSelectionClickHandler(
				['layoutColumn'],
				(target) =>
					target.hasAttribute('data-layout-section') || target.hasAttribute('data-layout-column'),
				{
					useLongPressSelection: options.useLongPressSelection || false,
					getNodeSelectionPos: (state, nodePos) => state.doc.resolve(nodePos).before(),
				},
			),
		},
		appendTransaction: (transactions, _oldState, newState) => {
			const changes: Change[] = [];

			transactions.forEach((prevTr) => {
				// remap change segments across the transaction set
				changes.forEach((change) => {
					return {
						from: prevTr.mapping.map(change.from),
						to: prevTr.mapping.map(change.to),
						slice: change.slice,
					};
				});

				// don't consider transactions that don't mutate
				if (!prevTr.docChanged) {
					return;
				}

				const change = fixColumnSizes(prevTr, newState);
				if (change) {
					changes.push(change);
				}
			});

			if (editorExperiment('advanced_layouts', true) && changes.length === 1) {
				const change = changes[0];
				// when need to update a layoutColumn with width 100
				// meaning a single column layout has been create,
				// We replace the layout with its content
				// This is to prevent a single column layout from being created
				// when a user deletes a layoutColumn
				if (
					change.slice.content.childCount === 1 &&
					change.slice.content.firstChild?.type.name === 'layoutColumn' &&
					change.slice.content.firstChild?.attrs.width === EVEN_DISTRIBUTED_COL_WIDTHS[1]
				) {
					const tr = newState.tr;
					const { content } = change.slice.content.firstChild;
					tr.replaceWith(change.from - 1, change.to, content);
					return tr;
				}
			}

			if (changes.length) {
				let tr = newState.tr;
				const selection = newState.selection.toJSON();
				changes.forEach((change) => {
					tr.replaceRange(change.from, change.to, change.slice);
				});

				// selecting and deleting across columns in 3 col layouts can remove
				// a layoutColumn so we fix the structure here
				tr = fixColumnStructure(newState) || tr;

				if (tr.docChanged) {
					tr.setSelection(Selection.fromJSON(tr.doc, selection));
					return tr;
				}
			}

			return;
		},
	});
