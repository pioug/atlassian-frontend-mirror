import { type IntlShape } from 'react-intl-next';

import type { PortalProviderAPI } from '@atlaskit/editor-common/portal';
import { expandSelectionBounds } from '@atlaskit/editor-common/selection';
import type { ExtractInjectionAPI } from '@atlaskit/editor-common/types';
import { isEmptyParagraph } from '@atlaskit/editor-common/utils';
import type { Node as PMNode, ResolvedPos } from '@atlaskit/editor-prosemirror/model';
import type { EditorState } from '@atlaskit/editor-prosemirror/state';
import { type NodeWithPos } from '@atlaskit/editor-prosemirror/utils';
import { type Decoration } from '@atlaskit/editor-prosemirror/view';
import { expValEquals } from '@atlaskit/tmp-editor-statsig/exp-val-equals';
import { editorExperiment } from '@atlaskit/tmp-editor-statsig/experiments';

import type {
	ActiveDropTargetNode,
	ActiveNode,
	BlockControlsPlugin,
} from '../blockControlsPluginType';

import { getNodeAnchor } from './decorations-common';
import {
	createDropTargetDecoration,
	createLayoutDropTargetDecoration,
} from './decorations-drop-target';
import { findSurroundingNodes } from './decorations-find-surrounding-nodes';
import { defaultActiveAnchorTracker } from './utils/active-anchor-tracker';
import type { AnchorRectCache } from './utils/anchor-utils';
import { maxLayoutColumnSupported } from './utils/consts';
import { canMoveNodeToIndex, canMoveSliceToIndex, isInSameLayout } from './utils/validation';

/**
 * List of parent node types that can have child nodes
 */
const PARENT_WITH_END_DROP_TARGET = [
	'tableCell',
	'tableHeader',
	'panel',
	'layoutColumn',
	'expand',
	'nestedExpand',
	'bodiedExtension',
];

const PARENT_WITH_END_DROP_TARGET_SYNC_BLOCK = [...PARENT_WITH_END_DROP_TARGET, 'bodiedSyncBlock'];

/**
 * List of node types that does not allow drop targets at before or after the node.
 */
const NODE_WITH_NO_PARENT_POS = ['tableCell', 'tableHeader', 'layoutColumn'];

const UNSUPPORTED_LAYOUT_CONTENT = ['syncBlock', 'bodiedSyncBlock'];

const isContainerNode = (node: PMNode) => {
	if (editorExperiment('platform_synced_block', true)) {
		return PARENT_WITH_END_DROP_TARGET_SYNC_BLOCK.includes(node.type.name);
	}

	return PARENT_WITH_END_DROP_TARGET.includes(node.type.name);
};

export const canMoveNodeOrSliceToPos = (
	state: EditorState,
	node: PMNode,
	parent: PMNode,
	index: number,
	$toPos: ResolvedPos,
	activeNode?: ActiveNode,
) => {
	// For deciding to show drop targets or not when multiple nodes are selected
	const selection = state.selection;
	const { $anchor: expandedAnchor, $head: expandedHead } = expandSelectionBounds(
		selection.$anchor,
		selection.$head,
	);
	const selectionFrom = Math.min(expandedAnchor.pos, expandedHead.pos);
	const selectionTo = Math.max(expandedAnchor.pos, expandedHead.pos);

	const activeNodePos = activeNode?.pos;
	const $activeNodePos = typeof activeNodePos === 'number' && state.doc.resolve(activeNodePos);
	const activePMNode = $activeNodePos && $activeNodePos.nodeAfter;
	const handleInsideSelection =
		activeNodePos !== undefined && activeNodePos >= selectionFrom && activeNodePos <= selectionTo;

	if (editorExperiment('platform_editor_element_drag_and_drop_multiselect', true)) {
		const selectionSlice = state.doc.slice(selectionFrom, selectionTo, false);
		const selectionSliceChildCount = selectionSlice.content.childCount;
		let canDropSingleNode: boolean = true;
		let canDropMultipleNodes: boolean = true;

		// when there is only one node in the slice, use the same logic as when multi select is not on
		if (selectionSliceChildCount > 1 && handleInsideSelection) {
			canDropMultipleNodes = canMoveSliceToIndex(
				selectionSlice,
				selectionFrom,
				selectionTo,
				parent,
				index,
				$toPos,
			);
		} else {
			canDropSingleNode = !!(
				activePMNode && canMoveNodeToIndex(parent, index, activePMNode, $toPos, node)
			);
		}

		if (!canDropMultipleNodes || !canDropSingleNode) {
			return false;
		}
	} else {
		const canDrop = activePMNode && canMoveNodeToIndex(parent, index, activePMNode, $toPos, node);
		return canDrop;
	}

	return true;
};

export const getActiveDropTargetDecorations = (
	activeDropTargetNode: ActiveDropTargetNode,
	state: EditorState,
	api: ExtractInjectionAPI<BlockControlsPlugin>,
	existingDecs: Decoration[],
	formatMessage: IntlShape['formatMessage'],
	nodeViewPortalProviderAPI: PortalProviderAPI,
	activeNode?: ActiveNode,
	anchorRectCache?: AnchorRectCache,
) => {
	const decsToAdd: Decoration[] = [];
	let decsToRemove: Decoration[] = existingDecs.filter((dec) => !!dec);

	const activeNodePos = activeNode?.pos;
	const $activeNodePos = typeof activeNodePos === 'number' && state.doc.resolve(activeNodePos);

	const $toPos = state.doc.resolve(activeDropTargetNode.pos);

	const existingDecsPos = decsToRemove.map((dec) => dec.from);

	const { parent, index, node, pos, before, after, depth } = findSurroundingNodes(
		state,
		$toPos,
		activeDropTargetNode.nodeTypeName,
	);

	/**
	 * If the current node is a container node, we show the drop targets
	 * above the first child and below the last child.
	 */
	if (isContainerNode(node)) {
		const isEmptyContainer =
			node.childCount === 0 || (node.childCount === 1 && isEmptyParagraph(node.firstChild));

		// can move to before first child
		const posBeforeFirstChild = pos + 1; // +1 to get the position of the first child
		if (
			node.firstChild &&
			canMoveNodeOrSliceToPos(
				state,
				node.firstChild,
				node,
				0,
				state.doc.resolve(posBeforeFirstChild),
				activeNode,
			)
		) {
			if (existingDecsPos.includes(posBeforeFirstChild)) {
				// if the decoration already exists, we don't add it again.
				decsToRemove = decsToRemove.filter((dec) => dec.from !== posBeforeFirstChild);
			} else {
				decsToAdd.push(
					createDropTargetDecoration(
						posBeforeFirstChild,
						{
							api,
							prevNode: undefined,
							nextNode: node.firstChild,
							parentNode: node,
							formatMessage,
							dropTargetStyle: isEmptyContainer ? 'remainingHeight' : 'default',
						},
						nodeViewPortalProviderAPI,
						1,
						anchorRectCache,
					),
				);
			}
		}

		// can move to after last child
		// if the node is empty, we don't show the drop target at the end of the node
		if (!isEmptyContainer) {
			const posAfterLastChild = pos + node.nodeSize - 1; // -1 to get the position after last child

			if (
				node.lastChild &&
				canMoveNodeOrSliceToPos(
					state,
					node.lastChild,
					node,
					node.childCount - 1,
					state.doc.resolve(posAfterLastChild), // -1 to get the position after last child
					activeNode,
				)
			) {
				if (existingDecsPos.includes(posAfterLastChild)) {
					// if the decoration already exists, we don't add it again.
					decsToRemove = decsToRemove.filter((dec) => dec.from !== posAfterLastChild);
				} else {
					decsToAdd.push(
						createDropTargetDecoration(
							posAfterLastChild,
							{
								api,
								prevNode: node.lastChild,
								nextNode: undefined,
								parentNode: node,
								formatMessage,
								dropTargetStyle: 'remainingHeight',
							},
							nodeViewPortalProviderAPI,
							-1,
							anchorRectCache,
						),
					);
				}
			}
		}
	}

	/**
	 * Create drop target before and after the current node
	 */
	if (!NODE_WITH_NO_PARENT_POS.includes(node.type.name)) {
		const isSameLayout = $activeNodePos && isInSameLayout($activeNodePos, $toPos);

		const isInSupportedContainer = ['tableCell', 'tableHeader', 'layoutColumn'].includes(
			parent?.type.name || '',
		);

		const shouldShowFullHeight =
			isInSupportedContainer && parent?.lastChild === node && isEmptyParagraph(node);

		if (canMoveNodeOrSliceToPos(state, node, parent, index, $toPos, activeNode)) {
			if (existingDecsPos.includes(pos)) {
				// if the decoration already exists, we don't add it again.
				decsToRemove = decsToRemove.filter((dec) => dec.from !== pos);
			} else {
				decsToAdd.push(
					createDropTargetDecoration(
						pos,
						{
							api,
							prevNode: before || undefined,
							nextNode: node,
							parentNode: parent || undefined,
							formatMessage,
							dropTargetStyle: shouldShowFullHeight ? 'remainingHeight' : 'default',
						},
						nodeViewPortalProviderAPI,
						-1,
						anchorRectCache,
						isSameLayout,
					),
				);
			}
		}

		// if the node is a container node, we show the drop target after the node
		const posAfterNode = pos + node.nodeSize;
		if (
			canMoveNodeOrSliceToPos(
				state,
				node,
				parent,
				index + 1,
				state.doc.resolve(posAfterNode),
				activeNode,
			)
		) {
			if (existingDecsPos.includes(posAfterNode)) {
				// if the decoration already exists, we don't add it again.
				decsToRemove = decsToRemove.filter((dec) => dec.from !== posAfterNode);
			} else {
				decsToAdd.push(
					createDropTargetDecoration(
						posAfterNode,
						{
							api,
							prevNode: node,
							nextNode: after || undefined,
							parentNode: parent || undefined,
							formatMessage,
							dropTargetStyle: shouldShowFullHeight ? 'remainingHeight' : 'default',
						},
						nodeViewPortalProviderAPI,
						-1,
						anchorRectCache,
						isSameLayout,
					),
				);
			}
		}
	}

	let rootNodeWithPos: NodeWithPos = {
		node,
		pos,
	};

	// if the current node is not a top level node, we create one for advanced layout drop targets
	if (depth > 1) {
		const root = findSurroundingNodes(state, state.doc.resolve($toPos.before(2)));

		if (existingDecsPos.includes(root.pos)) {
			// if the decoration already exists, we don't add it again.
			decsToRemove = decsToRemove.filter((dec) => dec.from !== root.pos);
		} else {
			decsToAdd.push(
				createDropTargetDecoration(
					root.pos,
					{
						api,
						prevNode: root.before || undefined,
						nextNode: root.node,
						parentNode: state.doc || undefined,
						formatMessage,
						dropTargetStyle: 'default',
					},
					nodeViewPortalProviderAPI,
					-1,
					anchorRectCache,
					false,
				),
			);
		}

		rootNodeWithPos = {
			node: root.node,
			pos: root.pos,
		};
	}

	if (editorExperiment('advanced_layouts', true)) {
		const isSameLayout =
			$activeNodePos && isInSameLayout($activeNodePos, state.doc.resolve(rootNodeWithPos.pos));

		const hasUnsupportedContent =
			UNSUPPORTED_LAYOUT_CONTENT.includes(activeNode?.nodeType || '') &&
			editorExperiment('platform_synced_block', true);

		if (rootNodeWithPos.node.type.name === 'layoutSection' && !hasUnsupportedContent) {
			const layoutSectionNode = rootNodeWithPos.node;

			if (layoutSectionNode.childCount < maxLayoutColumnSupported() || isSameLayout) {
				layoutSectionNode.descendants((childNode, childPos, parent, index) => {
					if (
						childNode.type.name === 'layoutColumn' &&
						parent?.type.name === 'layoutSection' &&
						index !== 0 // Not the first node
					) {
						const currentPos = rootNodeWithPos.pos + childPos + 1;

						if (existingDecsPos.includes(currentPos)) {
							// if the decoration already exists, we don't add it again.
							decsToRemove = decsToRemove.filter((dec) => dec.from !== currentPos);
						} else {
							decsToAdd.push(
								createLayoutDropTargetDecoration(
									rootNodeWithPos.pos + childPos + 1,
									{
										api,
										parent,
										formatMessage,
									},
									nodeViewPortalProviderAPI,
									anchorRectCache,
								),
							);
						}
					}

					return false;
				});
			}
		}
	}

	defaultActiveAnchorTracker.emit(
		expValEquals('platform_editor_native_anchor_with_dnd', 'isEnabled', true)
			? api.core.actions.getAnchorIdForNode(rootNodeWithPos.node, rootNodeWithPos.pos) || ''
			: getNodeAnchor(rootNodeWithPos.node),
	);

	return { decsToAdd, decsToRemove };
};
