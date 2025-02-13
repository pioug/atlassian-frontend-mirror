import type { Command, ExtractInjectionAPI } from '@atlaskit/editor-common/types';
import type { EditorState } from '@atlaskit/editor-prosemirror/state';
import { findParentNodeOfType } from '@atlaskit/editor-prosemirror/utils';
import type { Decoration } from '@atlaskit/editor-prosemirror/view';
import { isInTable } from '@atlaskit/editor-tables/utils';
import { fg } from '@atlaskit/platform-feature-flags';
import { editorExperiment } from '@atlaskit/tmp-editor-statsig/experiments';

import type { BlockControlsPlugin } from '../blockControlsPluginType';
import { findNodeDecs } from '../pm-plugins/decorations-anchor';
import { getDecorations, key } from '../pm-plugins/main';
import { getNestedNodePosition } from '../pm-plugins/utils/getNestedNodePosition';

const showDragHandleAtSelectionOld =
	(api?: ExtractInjectionAPI<BlockControlsPlugin>, shouldFocusParentNode?: boolean): Command =>
	(state, _, view) => {
		const { $from } = state.selection;
		let shouldFocusParentNode;

		if ($from.depth > 1 && editorExperiment('nested-dnd', true)) {
			const { activeNode } = key.getState(state) || {};

			// if the node is already focused, pressing the keymap second times should focus the parent node
			shouldFocusParentNode = activeNode && activeNode.handleOptions?.isFocused;

			const parentPos = isInTable(state)
				? $from.before(1)
				: shouldFocusParentNode
					? $from.before(1)
					: getNestedNodePosition(state) + 1;

			const parentElement = view?.domAtPos(parentPos, 0)?.node as HTMLElement | undefined;
			if (parentElement) {
				// Ignored via go/ees005
				// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
				let anchorName = parentElement.getAttribute('data-drag-handler-anchor-name')!;
				// Ignored via go/ees005
				// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
				let nodeType = parentElement.getAttribute('data-drag-handler-node-type')!;

				if (!anchorName || !nodeType) {
					// for nodes like panel and mediaSingle, the drag handle decoration is not applied to the dom node at the node position but to the parent node
					const closestParentElement = parentElement.closest('[data-drag-handler-anchor-name]');
					if (closestParentElement) {
						// Ignored via go/ees005
						// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
						anchorName = closestParentElement.getAttribute('data-drag-handler-anchor-name')!;
						// Ignored via go/ees005
						// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
						nodeType = closestParentElement.getAttribute('data-drag-handler-node-type')!;
					}
				}
				if (api && anchorName && nodeType) {
					api.core.actions.execute(
						api.blockControls.commands.showDragHandleAt(parentPos - 1, anchorName, nodeType, {
							isFocused: true,
						}),
					);

					return true;
				}
			}
		}

		const rootPos = $from.before(1);
		const dom = view?.domAtPos(rootPos, 0);
		const nodeElement = dom?.node.childNodes[dom?.offset] as HTMLElement | undefined;

		const rootNode =
			nodeElement && !nodeElement.hasAttribute('data-drag-handler-anchor-name')
				? nodeElement.querySelector('[data-drag-handler-anchor-name]')
				: nodeElement;

		if (rootNode) {
			// Ignored via go/ees005
			// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
			const anchorName = rootNode.getAttribute('data-drag-handler-anchor-name')!;
			// Ignored via go/ees005
			// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
			const nodeType = rootNode.getAttribute('data-drag-handler-node-type')!;

			if (api && anchorName && nodeType) {
				api.core.actions.execute(
					api.blockControls.commands.showDragHandleAt(rootPos, anchorName, nodeType, {
						isFocused: true,
					}),
				);
				return true;
			}
		}
		return false;
	};

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
	return getNestedNodePosition(state);
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
		findNodeDecs(decorations, nextHandleNodePos, nextHandleNodePos + nextHandleNode.nodeSize);

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

const showDragHandleAtSelectionNew =
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

export const showDragHandleAtSelection =
	(api?: ExtractInjectionAPI<BlockControlsPlugin>): Command =>
	(state, dispatch, view) =>
		editorExperiment('nested-dnd', true) && fg('platform_editor_advanced_layouts_a11y')
			? showDragHandleAtSelectionNew(api)(state)
			: showDragHandleAtSelectionOld(api)(state, dispatch, view);
