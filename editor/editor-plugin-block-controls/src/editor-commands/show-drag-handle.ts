import type { Command, ExtractInjectionAPI } from '@atlaskit/editor-common/types';
import type { EditorState } from '@atlaskit/editor-prosemirror/state';
import { findParentNodeOfType } from '@atlaskit/editor-prosemirror/utils';
import type { Decoration } from '@atlaskit/editor-prosemirror/view';

import type { BlockControlsPlugin } from '../blockControlsPluginType';
import { findNodeDecs } from '../pm-plugins/decorations-anchor';
import { getDecorations, key } from '../pm-plugins/main';
import { getNestedNodePosition } from '../pm-plugins/utils/getNestedNodePosition';

const findParentPosForHandle = (state: EditorState) => {
	const {
		selection: { $from },
	} = state;
	const { activeNode } = key.getState(state) || {};

	// if a node handle is already focused, return the parent pos of that node (with focused handle)
	if (activeNode && activeNode.handleOptions?.isFocused) {
		const $activeNodePos = state.doc.resolve(activeNode.pos);

		// if the handle is at the top level already, do nothing
		if ($activeNodePos.depth === 0) {
			return undefined;
		}

		return $activeNodePos.before();
	}

	// if we are in second level of nested node, we should focus the node at level 1
	if ($from.depth <= 1) {
		return $from.before(1);
	}

	// if we are inside a table, we should focus the table's handle
	const parentTableNode = findParentNodeOfType([state.schema.nodes.table])(state.selection);
	if (parentTableNode) {
		return parentTableNode.pos;
	}

	// else find closest parent node
	return getNestedNodePosition({
		selection: state.selection,
		schema: state.schema,
		resolve: state.doc.resolve.bind(state.doc),
	});
};

const findNextAnchorDecoration = (state: EditorState): Decoration | undefined => {
	const decorations = getDecorations(state);
	if (!decorations) {
		return undefined;
	}

	const nextHandleNodePos = findParentPosForHandle(state);
	if (nextHandleNodePos === undefined) {
		return undefined;
	}

	const nextHandleNode = state.doc.nodeAt(nextHandleNodePos);
	let nodeDecorations =
		nextHandleNode &&
		findNodeDecs(
			state,
			decorations,
			nextHandleNodePos,
			nextHandleNodePos + nextHandleNode.nodeSize,
		);

	if (!nodeDecorations || nodeDecorations.length === 0) {
		return undefined;
	}

	// ensure the decoration covers the position of the look up node
	nodeDecorations = nodeDecorations.filter((decoration) => {
		return decoration.from <= nextHandleNodePos;
	});

	if (nodeDecorations.length === 0) {
		return undefined;
	}

	// sort the decorations by the position of the node
	// so we can find the closest decoration to the node
	nodeDecorations.sort((a, b) => {
		if (a.from === b.from) {
			return a.to - b.to;
		}
		return b.from - a.from;
	});

	// return the closest decoration to the node
	return nodeDecorations[0];
};

export const showDragHandleAtSelection =
	(api?: ExtractInjectionAPI<BlockControlsPlugin>): Command =>
	(state) => {
		const decoration = findNextAnchorDecoration(state);
		if (api && decoration) {
			api.core.actions.execute(
				api.blockControls.commands.showDragHandleAt(
					decoration.from,
					decoration.spec.anchorName,
					decoration.spec.nodeTypeWithLevel,
					{
						isFocused: true,
					},
				),
			);

			return true;
		}

		return false;
	};
