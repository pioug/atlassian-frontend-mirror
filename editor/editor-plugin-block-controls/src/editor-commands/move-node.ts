import { type IntlShape } from 'react-intl-next';

import {
	ACTION,
	ACTION_SUBJECT,
	ACTION_SUBJECT_ID,
	EVENT_TYPE,
	INPUT_METHOD,
} from '@atlaskit/editor-common/analytics';
import { expandedState } from '@atlaskit/editor-common/expand';
import { blockControlsMessages } from '@atlaskit/editor-common/messages';
import { expandSelectionBounds, GapCursorSelection } from '@atlaskit/editor-common/selection';
import { transformSliceNestedExpandToExpand } from '@atlaskit/editor-common/transforms';
import type { Command, EditorCommand, ExtractInjectionAPI } from '@atlaskit/editor-common/types';
import { DIRECTION } from '@atlaskit/editor-common/types';
import { isEmptyParagraph } from '@atlaskit/editor-common/utils';
import {
	Fragment,
	type NodeType,
	type ResolvedPos,
	type Slice,
} from '@atlaskit/editor-prosemirror/model';
import { type EditorState, Selection, NodeSelection } from '@atlaskit/editor-prosemirror/state';
import { type ReplaceStep } from '@atlaskit/editor-prosemirror/transform';
import {
	findChildrenByType,
	findParentNodeOfType,
	findParentNodeOfTypeClosestToPos,
} from '@atlaskit/editor-prosemirror/utils';
import { findTable, isInTable, isTableSelected } from '@atlaskit/editor-tables/utils';
import { fg } from '@atlaskit/platform-feature-flags';
import { expValEqualsNoExposure } from '@atlaskit/tmp-editor-statsig/exp-val-equals-no-exposure';
import { editorExperiment } from '@atlaskit/tmp-editor-statsig/experiments';

import type { ActiveNode, BlockControlsPlugin, MoveNodeMethod } from '../blockControlsPluginType';
import { key } from '../pm-plugins/main';
import {
	attachMoveNodeAnalytics,
	getMultiSelectAnalyticsAttributes,
} from '../pm-plugins/utils/analytics';
import { getNestedNodePosition } from '../pm-plugins/utils/getNestedNodePosition';
import { selectNode, setCursorPositionAtMovedNode } from '../pm-plugins/utils/getSelection';
import { removeFromSource } from '../pm-plugins/utils/remove-from-source';
import { getSelectedSlicePosition } from '../pm-plugins/utils/selection';
import { getInsertLayoutStep, updateSelection } from '../pm-plugins/utils/update-selection';
import {
	canMoveNodeToIndex,
	isInsideTable,
	transformSliceExpandToNestedExpand,
	transformFragmentExpandToNestedExpand,
} from '../pm-plugins/utils/validation';

import { getPosWhenMoveNodeDown, getPosWhenMoveNodeUp } from './utils/move-node-utils';

/**
 * This function transforms the slice to move
 * @param nodeCopy The slice contains the node to be moved
 * @param destType The type of the destiation node
 * @returns transformed slice or null if unable to
 */
function transformSourceSlice(nodeCopy: Slice, destType: NodeType): Slice | null {
	const srcNode = nodeCopy.content.firstChild;
	const schema = srcNode?.type.schema;
	if (!schema) {
		return nodeCopy;
	}

	const { doc, layoutColumn } = schema.nodes;
	const destTypeInTable = isInsideTable(destType);
	const destTypeInDocOrLayoutCol = [doc, layoutColumn].includes(destType);

	// No need to loop over slice content if destination requires no transformations
	if (!destTypeInTable && !destTypeInDocOrLayoutCol) {
		return nodeCopy;
	}

	let containsExpand = false;
	let containsNestedExpand = false;

	for (let i = 0; i < nodeCopy.content.childCount; i++) {
		const node = nodeCopy.content.child(i);
		if (node.type === schema.nodes.expand) {
			containsExpand = true;
		} else if (node.type === schema.nodes.nestedExpand) {
			containsNestedExpand = true;
		}
		if (containsExpand && containsNestedExpand) {
			break;
		}
	}

	if (containsExpand && destTypeInTable) {
		return transformSliceExpandToNestedExpand(nodeCopy);
	} else if (containsNestedExpand && destTypeInDocOrLayoutCol) {
		return transformSliceNestedExpandToExpand(nodeCopy, schema);
	}

	return nodeCopy;
}

const nodesSupportDragLayoutColumnInto = [
	'tableCell',
	'tableHeader',
	'panel',
	'expand',
	'nestedExpand',
];

const isDragLayoutColumnIntoSupportedNodes = ($from: ResolvedPos, $to: ResolvedPos) => {
	const isTopLevel = $to.depth === 0;
	const isDragIntoNodes = nodesSupportDragLayoutColumnInto.includes($to.parent.type.name);
	const supportedCondition = isDragIntoNodes || isTopLevel;

	return (
		$from.nodeAfter?.type.name === 'layoutColumn' &&
		$from.parent.type.name === 'layoutSection' &&
		supportedCondition
	);
};

/**
 *
 * @returns the start position of a node if the node can be moved, otherwise -1
 */
const getCurrentNodePos = (state: EditorState): number => {
	const { selection } = state;
	let currentNodePos = -1;

	// There are 3 cases when a node can be moved
	const focusedHandle = getFocusedHandle(state);
	if (focusedHandle) {
		// 1. drag handle of the node is focused
		currentNodePos = focusedHandle.pos;
	} else if (isInTable(state)) {
		if (isTableSelected(selection)) {
			// We only move table node if it's fully selected
			// to avoid shortcut collision with table drag and drop
			currentNodePos = findTable(selection)?.pos ?? currentNodePos;
		}
	} else if (!(state.selection instanceof GapCursorSelection)) {
		// 2. caret cursor is inside the node
		// 3. the start of the selection is inside the node
		currentNodePos = selection.$from.before(1);
		if (selection.$from.depth > 0) {
			currentNodePos = getNestedNodePosition({
				selection,
				schema: state.schema,
				resolve: state.doc.resolve.bind(state.doc),
			});
		}
	}
	return currentNodePos;
};

const getFocusedHandle = (state: EditorState): ActiveNode | undefined => {
	const { activeNode } = key.getState(state) || {};
	return activeNode && activeNode.handleOptions?.isFocused ? activeNode : undefined;
};

export const moveNodeViaShortcut = (
	api: ExtractInjectionAPI<BlockControlsPlugin> | undefined,
	direction: DIRECTION,
	formatMessage?: IntlShape['formatMessage'],
): Command => {
	return (state) => {
		const { selection } = state;
		const isParentNodeOfTypeLayout = !!findParentNodeOfType([state.schema.nodes.layoutSection])(
			state.selection,
		);

		const isMultiSelectEnabled = editorExperiment(
			'platform_editor_element_drag_and_drop_multiselect',
			true,
		);

		const expandedSelection = expandSelectionBounds(selection.$anchor, selection.$head);
		const expandedAnchor = expandedSelection.$anchor.pos;
		const expandedHead = expandedSelection.$head.pos;

		let hoistedPos;
		const from = Math.min(expandedAnchor, expandedHead);
		// Nodes like lists nest within themselves, we need to find the top most position
		if (isParentNodeOfTypeLayout) {
			const LAYOUT_COL_DEPTH = 3;
			hoistedPos = state.doc.resolve(from).before(LAYOUT_COL_DEPTH);
		}

		const currentNodePos =
			isMultiSelectEnabled && !getFocusedHandle(state) && !selection.empty
				? (hoistedPos ?? from)
				: getCurrentNodePos(state);
		if (currentNodePos > -1) {
			const $currentNodePos = state.doc.resolve(currentNodePos);
			const nodeAfterPos =
				isMultiSelectEnabled && !getFocusedHandle(state)
					? Math.max(expandedAnchor, expandedHead)
					: $currentNodePos.posAtIndex($currentNodePos.index() + 1);

			const isTopLevelNode = $currentNodePos.depth === 0;

			let moveToPos = -1;

			const isLayoutColumnSelected =
				selection instanceof NodeSelection && selection.node.type.name === 'layoutColumn';

			if (direction === DIRECTION.LEFT) {
				if (isTopLevelNode && editorExperiment('advanced_layouts', true)) {
					const nodeBefore = $currentNodePos.nodeBefore;

					if (nodeBefore) {
						moveToPos = currentNodePos - nodeBefore.nodeSize;
					}

					if (moveToPos < 0) {
						return false;
					}

					api?.core?.actions.execute(({ tr }) => {
						api?.blockControls?.commands?.moveToLayout(currentNodePos, moveToPos, {
							moveToEnd: true,
							moveNodeAtCursorPos: true,
						})({ tr });

						const insertColumnStep = getInsertLayoutStep(tr);
						const mappedTo = (insertColumnStep as ReplaceStep)?.from;
						updateSelection(tr, mappedTo, true);
						return tr;
					});
					api?.core?.actions.focus();

					return true;
				} else if (isLayoutColumnSelected) {
					moveToPos = selection.from - ($currentNodePos.nodeBefore?.nodeSize || 1);

					api?.core?.actions.execute(
						api?.blockControls?.commands?.moveToLayout(currentNodePos, moveToPos, {
							selectMovedNode: true,
						}),
					);
					return true;
				} else {
					if ($currentNodePos.depth < 2 || !isParentNodeOfTypeLayout) {
						return false;
					}

					// get the previous layoutSection node
					const index = $currentNodePos.index($currentNodePos.depth - 1);
					const grandParent = $currentNodePos.node($currentNodePos.depth - 1);
					const previousNode = grandParent ? grandParent.maybeChild(index - 1) : null;
					moveToPos = $currentNodePos.start() - (previousNode?.nodeSize || 1);
				}
			} else if (direction === DIRECTION.RIGHT) {
				if (isTopLevelNode && editorExperiment('advanced_layouts', true)) {
					const endOfDoc = $currentNodePos.end();
					moveToPos = $currentNodePos.posAtIndex($currentNodePos.index() + 1);
					if (moveToPos >= endOfDoc) {
						return false;
					}
					api?.core?.actions.execute(({ tr }) => {
						api?.blockControls?.commands?.moveToLayout(currentNodePos, moveToPos, {
							moveNodeAtCursorPos: true,
						})({ tr });
						const insertColumnStep = getInsertLayoutStep(tr);
						const mappedTo = (insertColumnStep as ReplaceStep)?.from;

						updateSelection(tr, mappedTo);
						return tr;
					});
					api?.core?.actions.focus();

					return true;
				} else if (isLayoutColumnSelected) {
					const index = $currentNodePos.index($currentNodePos.depth);
					const parent = $currentNodePos.node($currentNodePos.depth);
					// get the next layoutColumn node
					const nextNode = parent ? parent.maybeChild(index + 1) : null;

					// if the current node is the last node, don't do anything
					if (index >= parent.childCount - 1) {
						// prevent event propagation to avoid moving the cursor and still select the node
						return true;
					}

					const moveToEnd = index === parent.childCount - 2;
					moveToPos = moveToEnd
						? $currentNodePos.before()
						: selection.to + (nextNode?.nodeSize || 1);
					api?.core?.actions.execute(
						api?.blockControls?.commands?.moveToLayout(currentNodePos, moveToPos, {
							moveToEnd,
							selectMovedNode: true,
						}),
					);

					return true;
				} else {
					if ($currentNodePos.depth < 2 || !isParentNodeOfTypeLayout) {
						return false;
					}

					moveToPos = $currentNodePos.after($currentNodePos.depth) + 1;
				}
			} else if (direction === DIRECTION.UP) {
				if (isLayoutColumnSelected) {
					moveToPos = $currentNodePos.start() - 1;
				} else {
					moveToPos = getPosWhenMoveNodeUp($currentNodePos, currentNodePos);
				}
			} else {
				const endOfDoc = $currentNodePos.end();

				if (nodeAfterPos > endOfDoc) {
					return false;
				}

				if (isLayoutColumnSelected) {
					moveToPos = state.selection.$from.end() + 1;
				} else {
					moveToPos = getPosWhenMoveNodeDown({ $currentNodePos, nodeAfterPos, tr: state.tr });
				}
			}

			const nodeType = state.doc.nodeAt(currentNodePos)?.type.name;

			let shouldMoveNode = false;
			if (moveToPos > -1 && fg('platform_editor_elements_dnd_multi_select_patch_2')) {
				const isDestDepthSameAsSource =
					$currentNodePos.depth === state.doc.resolve(moveToPos).depth;
				const isSourceLayoutColumn = nodeType === 'layoutColumn';
				shouldMoveNode = isDestDepthSameAsSource || isSourceLayoutColumn;
			} else {
				// only move the node if the destination is at the same depth, not support moving a nested node to a parent node
				shouldMoveNode =
					(moveToPos > -1 && $currentNodePos.depth === state.doc.resolve(moveToPos).depth) ||
					nodeType === 'layoutColumn';
			}

			const { $anchor: $newAnchor, $head: $newHead } = expandSelectionBounds(
				$currentNodePos,
				selection.$to,
			);
			if (shouldMoveNode) {
				api?.core?.actions.execute(({ tr }) => {
					api?.blockControls.commands.setMultiSelectPositions($newAnchor.pos, $newHead.pos)({ tr });
					moveNode(api)(currentNodePos, moveToPos, INPUT_METHOD.SHORTCUT, formatMessage)({ tr });
					tr.scrollIntoView();
					return tr;
				});
				return true;
			} else if (nodeType && !isMultiSelectEnabled) {
				// If the node is first/last one, only select the node
				api?.core?.actions.execute(({ tr }) => {
					selectNode(tr, currentNodePos, nodeType);
					tr.scrollIntoView();
					return tr;
				});
				return true;
			} else if (isMultiSelectEnabled) {
				api?.core?.actions.execute(({ tr }) => {
					api?.blockControls.commands.setMultiSelectPositions($newAnchor.pos, $newHead.pos)({ tr });
					tr.scrollIntoView();
					return tr;
				});
				return true;
			}
		}
		return false;
	};
};

export const moveNode =
	(api?: ExtractInjectionAPI<BlockControlsPlugin>) =>
	(
		start: number,
		to: number,
		inputMethod: MoveNodeMethod = INPUT_METHOD.DRAG_AND_DROP,
		formatMessage?: IntlShape['formatMessage'],
	): EditorCommand =>
	({ tr }) => {
		if (
			!api ||
			((start < 0 || to < 0) && fg('platform_editor_elements_dnd_multi_select_patch_2'))
		) {
			return tr;
		}

		const handleNode = tr.doc.nodeAt(start);

		if (!handleNode) {
			return tr;
		}

		let sliceFrom = start;
		let sliceTo;
		let sourceNodeTypes, hasSelectedMultipleNodes;

		const isMultiSelect = editorExperiment(
			'platform_editor_element_drag_and_drop_multiselect',
			true,
		);

		if (fg('platform_editor_ease_of_use_metrics')) {
			api?.metrics?.commands.setContentMoved()({ tr });
		}

		const slicePosition = getSelectedSlicePosition(start, tr, api);

		if (isMultiSelect) {
			sliceFrom = slicePosition.from;
			sliceTo = slicePosition.to;

			const attributes = getMultiSelectAnalyticsAttributes(tr, sliceFrom, sliceTo);
			hasSelectedMultipleNodes = attributes.hasSelectedMultipleNodes;
			sourceNodeTypes = attributes.nodeTypes;
		} else {
			const size = handleNode?.nodeSize ?? 1;
			sliceTo = sliceFrom + size;
		}

		const { expand, nestedExpand } = tr.doc.type.schema.nodes;
		const $to = tr.doc.resolve(to);
		const $handlePos = tr.doc.resolve(start);

		const nodeCopy = tr.doc.slice(sliceFrom, sliceTo, false); // cut the content
		const destType = $to.node().type;
		const destParent = $to.node($to.depth);

		const sourceNode = $handlePos.nodeAfter;

		//TODO: ED-26959 - Does this need to be updated with new selection logic above? ^
		// Move a layout column to top level, or table cell, or panel, or expand, only moves the content into them
		if (sourceNode && isDragLayoutColumnIntoSupportedNodes($handlePos, $to)) {
			// need update after we support single column layout.
			const layoutColumnContent = sourceNode.content;
			let fragment;
			// if drop into table, and layout column contains expand, transform it to nestedExpand
			if (['tableCell', 'tableHeader'].includes($to.parent.type.name)) {
				const contentContainsExpand = findChildrenByType(sourceNode, expand).length > 0;
				fragment = contentContainsExpand
					? transformFragmentExpandToNestedExpand(Fragment.from(layoutColumnContent))
					: Fragment.from(layoutColumnContent);

				if (!fragment) {
					return tr;
				}
			} else {
				fragment = Fragment.from(layoutColumnContent);
			}

			removeFromSource(tr, $handlePos, $handlePos.pos + sourceNode.nodeSize);
			const mappedTo = tr.mapping.map(to);
			tr.insert(mappedTo, fragment)
				.setSelection(Selection.near(tr.doc.resolve(mappedTo)))
				.scrollIntoView();

			return tr;
		}

		if (
			!canMoveNodeToIndex(destParent, $to.index(), $handlePos.node().child($handlePos.index()), $to)
		) {
			return tr;
		}

		const convertedNodeSlice = transformSourceSlice(nodeCopy, destType);
		const convertedNode = convertedNodeSlice?.content;
		if (!convertedNode) {
			return tr;
		}
		if (
			sourceNode?.type.name === 'taskList' &&
			sliceFrom > 0 &&
			expValEqualsNoExposure('platform_editor_block_menu', 'isEnabled', true)
		) {
			sliceFrom = sliceFrom - 1;
		}

		// delete the content from the original position
		tr.delete(sliceFrom, sliceTo);
		const mappedTo = tr.mapping.map(to);

		const isDestNestedLoneEmptyParagraph =
			destParent.type.name !== 'doc' &&
			destParent.childCount === 1 &&
			isEmptyParagraph($to.nodeAfter);

		if (convertedNodeSlice && isDestNestedLoneEmptyParagraph) {
			// if only a single empty paragraph within container, replace it
			tr.replace(mappedTo, mappedTo + 1, convertedNodeSlice);
		} else {
			// otherwise just insert the content at the new position
			tr.insert(mappedTo, convertedNode);
		}

		const sliceSize = sliceTo - sliceFrom;
		tr =
			inputMethod === INPUT_METHOD.DRAG_AND_DROP
				? setCursorPositionAtMovedNode(tr, mappedTo)
				: isMultiSelect
					? (api?.blockControls.commands.setMultiSelectPositions(
							mappedTo,
							mappedTo + sliceSize,
						)({ tr }) ?? tr)
					: selectNode(tr, mappedTo, handleNode.type.name);
		const currMeta = tr.getMeta(key);
		tr.setMeta(key, { ...currMeta, nodeMoved: true });
		api?.core.actions.focus();
		const $mappedTo = tr.doc.resolve(mappedTo);

		const expandAncestor = findParentNodeOfTypeClosestToPos($to, [expand, nestedExpand]);

		if (expandAncestor) {
			const wasExpandExpanded = expandedState.get(expandAncestor.node);
			const updatedExpandAncestor = findParentNodeOfTypeClosestToPos($mappedTo, [
				expand,
				nestedExpand,
			]);
			if (wasExpandExpanded !== undefined && updatedExpandAncestor) {
				expandedState.set(updatedExpandAncestor.node, wasExpandExpanded);
			}
		}

		if (editorExperiment('advanced_layouts', true)) {
			attachMoveNodeAnalytics(
				tr,
				inputMethod,
				$handlePos.depth,
				handleNode.type.name,
				$mappedTo?.depth,
				$mappedTo?.parent.type.name,
				$handlePos.sameParent($mappedTo),
				api,
				sourceNodeTypes,
				hasSelectedMultipleNodes,
			);
		} else {
			api?.analytics?.actions.attachAnalyticsEvent({
				eventType: EVENT_TYPE.TRACK,
				action: ACTION.MOVED,
				actionSubject: ACTION_SUBJECT.ELEMENT,
				actionSubjectId: ACTION_SUBJECT_ID.ELEMENT_DRAG_HANDLE,
				attributes: {
					nodeDepth: $handlePos.depth,
					nodeType: handleNode.type.name,
					destinationNodeDepth: $mappedTo?.depth,
					destinationNodeType: $mappedTo?.parent.type.name,
					inputMethod,
					...(isMultiSelect && { sourceNodeTypes, hasSelectedMultipleNodes }),
				},
			})(tr);
		}

		const movedMessage =
			to > sliceFrom ? blockControlsMessages.movedDown : blockControlsMessages.movedup;

		api?.accessibilityUtils?.actions.ariaNotify(
			formatMessage ? formatMessage(movedMessage) : movedMessage.defaultMessage,
			{ priority: 'important' },
		);

		return tr;
	};
