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
import { GapCursorSelection } from '@atlaskit/editor-common/selection';
import { transformSliceNestedExpandToExpand } from '@atlaskit/editor-common/transforms';
import type { Command, EditorCommand, ExtractInjectionAPI } from '@atlaskit/editor-common/types';
import { isEmptyParagraph } from '@atlaskit/editor-common/utils';
import { ReplaceStep } from '@atlaskit/editor-prosemirror/dist/types/transform';
import {
	Fragment,
	type NodeType,
	type ResolvedPos,
	type Slice,
} from '@atlaskit/editor-prosemirror/model';
import { type EditorState, Selection, NodeSelection } from '@atlaskit/editor-prosemirror/state';
import {
	findParentNodeOfType,
	findParentNodeOfTypeClosestToPos,
} from '@atlaskit/editor-prosemirror/utils';
import { findTable, isInTable, isTableSelected } from '@atlaskit/editor-tables/utils';
import { fg } from '@atlaskit/platform-feature-flags';
import { editorExperiment } from '@atlaskit/tmp-editor-statsig/experiments';

import type { BlockControlsPlugin, MoveNodeMethod } from '../blockControlsPluginType';
import { key } from '../pm-plugins/main';
import {
	attachMoveNodeAnalytics,
	getMultiSelectAnalyticsAttributes,
} from '../pm-plugins/utils/analytics';
import { DIRECTION } from '../pm-plugins/utils/consts';
import { getNestedNodePosition } from '../pm-plugins/utils/getNestedNodePosition';
import { selectNode, setCursorPositionAtMovedNode } from '../pm-plugins/utils/getSelection';
import { removeFromSource } from '../pm-plugins/utils/remove-from-source';
import { getSelectedSlicePosition } from '../pm-plugins/utils/selection';
import { getInsertLayoutStep, updateSelection } from '../pm-plugins/utils/update-selection';
import {
	canMoveNodeToIndex,
	isInsideTable,
	transformSliceExpandToNestedExpand,
} from '../pm-plugins/utils/validation';

/**
 * This function transforms the slice to move
 * @param nodeCopy The slice contains the node to be moved
 * @param destType The type of the destiation node
 * @returns transformed slice or null if unable to
 */
function transformSourceSlice(nodeCopy: Slice, destType: NodeType): Slice | null {
	const srcNode = nodeCopy.content.firstChild;
	const schema = srcNode?.type.schema;
	if (srcNode && schema) {
		const { doc, layoutColumn } = schema.nodes;
		if (srcNode.type === schema.nodes.nestedExpand && [doc, layoutColumn].includes(destType)) {
			return transformSliceNestedExpandToExpand(nodeCopy, schema);
		} else if (srcNode.type === schema.nodes.expand && isInsideTable(destType)) {
			return transformSliceExpandToNestedExpand(nodeCopy);
		}
	}

	return nodeCopy;
}

const isDragLayoutColumnToTopLevel = ($from: ResolvedPos, $to: ResolvedPos) => {
	return (
		$from.nodeAfter?.type.name === 'layoutColumn' &&
		$from.parent.type.name === 'layoutSection' &&
		$to.depth === 0
	);
};

/**
 *
 * @returns the start position of a node if the node can be moved, otherwise -1
 */
const getCurrentNodePos = (state: EditorState): number => {
	const { selection } = state;
	const { activeNode } = key.getState(state) || {};
	let currentNodePos = -1;

	// There are 3 cases when a node can be moved
	if (activeNode && activeNode.handleOptions?.isFocused) {
		// 1. drag handle of the node is focused
		currentNodePos = activeNode.pos;
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
		if (selection.$from.depth > 0 && editorExperiment('nested-dnd', true)) {
			currentNodePos = getNestedNodePosition(state);
		}
	}
	return currentNodePos;
};

export const moveNodeViaShortcut = (
	api: ExtractInjectionAPI<BlockControlsPlugin> | undefined,
	direction: DIRECTION,
	formatMessage?: IntlShape['formatMessage'],
): Command => {
	return (state) => {
		let isParentNodeOfTypeLayout;
		const shouldEnableNestedDndA11y = editorExperiment('nested-dnd', true);
		const { selection } = state;
		if (shouldEnableNestedDndA11y) {
			isParentNodeOfTypeLayout = !!findParentNodeOfType([state.schema.nodes.layoutSection])(
				state.selection,
			);
		}

		const currentNodePos = getCurrentNodePos(state);
		if (currentNodePos > -1) {
			const $pos = state.doc.resolve(currentNodePos);
			const isTopLevelNode = $pos.depth === 0;

			let moveToPos = -1;

			const nodeIndex = $pos.index();

			const isLayoutColumnSelected =
				selection instanceof NodeSelection && selection.node.type.name === 'layoutColumn';

			if (direction === DIRECTION.LEFT && shouldEnableNestedDndA11y) {
				if (
					isTopLevelNode &&
					editorExperiment('advanced_layouts', true) &&
					fg('platform_editor_advanced_layouts_accessibility')
				) {
					const nodeBefore = $pos.nodeBefore;

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
				} else if (isLayoutColumnSelected && fg('platform_editor_advanced_layouts_accessibility')) {
					moveToPos = selection.from - ($pos.nodeBefore?.nodeSize || 1);

					api?.core?.actions.execute(
						api?.blockControls?.commands?.moveToLayout(currentNodePos, moveToPos, {
							selectMovedNode: true,
						}),
					);
					return true;
				} else {
					if ($pos.depth < 2 || !isParentNodeOfTypeLayout) {
						return false;
					}

					// get the previous layoutSection node
					const index = $pos.index($pos.depth - 1);
					const grandParent = $pos.node($pos.depth - 1);
					const previousNode = grandParent ? grandParent.maybeChild(index - 1) : null;
					moveToPos = $pos.start() - (previousNode?.nodeSize || 1);
				}
			} else if (direction === DIRECTION.RIGHT && shouldEnableNestedDndA11y) {
				if (
					isTopLevelNode &&
					editorExperiment('advanced_layouts', true) &&
					fg('platform_editor_advanced_layouts_accessibility')
				) {
					const endOfDoc = $pos.end();
					moveToPos = $pos.posAtIndex($pos.index() + 1);

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
				} else if (isLayoutColumnSelected && fg('platform_editor_advanced_layouts_accessibility')) {
					const index = $pos.index($pos.depth);
					const parent = $pos.node($pos.depth);
					// get the next layoutColumn node
					const nextNode = parent ? parent.maybeChild(index + 1) : null;

					// if the current node is the last node, don't do anything
					if (index >= parent.childCount - 1) {
						// prevent event propagation to avoid moving the cursor and still select the node
						return true;
					}

					const moveToEnd = index === parent.childCount - 2;
					moveToPos = moveToEnd ? $pos.before() : selection.to + (nextNode?.nodeSize || 1);
					api?.core?.actions.execute(
						api?.blockControls?.commands?.moveToLayout(currentNodePos, moveToPos, {
							moveToEnd,
							selectMovedNode: true,
						}),
					);

					return true;
				} else {
					if ($pos.depth < 2 || !isParentNodeOfTypeLayout) {
						return false;
					}

					moveToPos = $pos.after($pos.depth) + 1;
				}
			} else if (direction === DIRECTION.UP) {
				if (isLayoutColumnSelected && fg('platform_editor_advanced_layouts_accessibility')) {
					moveToPos = $pos.start() - 1;
				} else {
					const nodeBefore =
						$pos.depth > 1 && nodeIndex === 0 && shouldEnableNestedDndA11y
							? $pos.node($pos.depth)
							: $pos.nodeBefore;

					if (nodeBefore) {
						moveToPos = currentNodePos - nodeBefore.nodeSize;
					}
				}
			} else {
				const endOfDoc = $pos.end();
				const nodeAfterPos = $pos.posAtIndex($pos.index() + 1);

				if (nodeAfterPos > endOfDoc) {
					return false;
				}

				if (isLayoutColumnSelected && fg('platform_editor_advanced_layouts_accessibility')) {
					moveToPos = state.selection.$from.end() + 1;
				} else {
					const nodeAfter = state.doc.nodeAt(nodeAfterPos);
					if (nodeAfter) {
						// if not the last node, move to the end of the next node
						moveToPos = nodeAfterPos + nodeAfter.nodeSize;
					}
				}
			}

			const nodeType = state.doc.nodeAt(currentNodePos)?.type.name;

			// only move the node if the destination is at the same depth, not support moving a nested node to a parent node
			const shouldMoveNode =
				(shouldEnableNestedDndA11y
					? (moveToPos > -1 && $pos.depth === state.doc.resolve(moveToPos).depth) ||
						nodeType === 'layoutColumn'
					: moveToPos > -1) ||
				(nodeType === 'layoutColumn' && fg('platform_editor_advanced_layouts_accessibility'));

			if (shouldMoveNode) {
				api?.core?.actions.execute(({ tr }) => {
					moveNode(api)(currentNodePos, moveToPos, INPUT_METHOD.SHORTCUT, formatMessage)({ tr });
					tr.scrollIntoView();
					return tr;
				});
				return true;
			} else if (nodeType) {
				// If the node is first/last one, only select the node
				api?.core?.actions.execute(({ tr }) => {
					selectNode(tr, currentNodePos, nodeType);
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
		if (!api) {
			return tr;
		}

		const handleNode = tr.doc.nodeAt(start);

		if (!handleNode) {
			return tr;
		}

		let sliceFrom = start;
		let sliceTo;
		let mappedTo;
		let sourceNodeTypes, hasSelectedMultipleNodes;

		const isMultiSelect = editorExperiment(
			'platform_editor_element_drag_and_drop_multiselect',
			true,
			{
				exposure: true,
			},
		);

		if (isMultiSelect) {
			const slicePosition = getSelectedSlicePosition(start, tr, api);
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

		if (editorExperiment('nested-dnd', true)) {
			const nodeCopy = tr.doc.slice(sliceFrom, sliceTo, false); // cut the content
			const destType = $to.node().type;
			const destParent = $to.node($to.depth);

			const sourceNode = $handlePos.nodeAfter;

			//TODO: Does this need to be updated with new selection logic above? ^
			// Move a layout column to top level
			if (sourceNode && isDragLayoutColumnToTopLevel($handlePos, $to)) {
				// need update after we support single column layout.
				const fragment = Fragment.from(sourceNode.content);
				removeFromSource(tr, $handlePos, $handlePos.pos + sourceNode.nodeSize);
				const mappedTo = tr.mapping.map(to);
				tr.insert(mappedTo, fragment)
					.setSelection(Selection.near(tr.doc.resolve(mappedTo)))
					.scrollIntoView();

				return tr;
			}

			if (
				!canMoveNodeToIndex(
					destParent,
					$to.index(),
					$handlePos.node().child($handlePos.index()),
					$to,
				)
			) {
				return tr;
			}

			const convertedNodeSlice = transformSourceSlice(nodeCopy, destType);
			const convertedNode = convertedNodeSlice?.content;
			if (!convertedNode) {
				return tr;
			}
			tr.delete(sliceFrom, sliceTo); // delete the content from the original position
			mappedTo = tr.mapping.map(to);

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
		} else {
			const nodeCopy = tr.doc.content.cut(sliceFrom, sliceTo); // cut the content
			tr.delete(sliceFrom, sliceTo); // delete the content from the original position
			mappedTo = tr.mapping.map(to);
			tr.insert(mappedTo, nodeCopy); // insert the content at the new position
		}

		tr =
			inputMethod === INPUT_METHOD.DRAG_AND_DROP
				? setCursorPositionAtMovedNode(tr, mappedTo)
				: selectNode(tr, mappedTo, handleNode.type.name);

		tr.setMeta(key, { nodeMoved: true });
		api?.core.actions.focus();
		const $mappedTo = tr.doc.resolve(mappedTo);

		const expandAncestor = findParentNodeOfTypeClosestToPos($to, [expand, nestedExpand]);

		if (
			expandAncestor &&
			editorExperiment('nested-dnd', true) &&
			fg('platform_editor_element_dnd_nested_fix_patch_6')
		) {
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
					...(fg('platform_editor_element_drag_and_drop_ed_23873') && { inputMethod }),
					...(isMultiSelect && { sourceNodeTypes, hasSelectedMultipleNodes }),
				},
			})(tr);
		}

		if (fg('platform_editor_element_drag_and_drop_ed_23873')) {
			const movedMessage =
				to > sliceFrom ? blockControlsMessages.movedDown : blockControlsMessages.movedup;

			api?.accessibilityUtils?.actions.ariaNotify(
				formatMessage ? formatMessage(movedMessage) : movedMessage.defaultMessage,
				{ priority: 'important' },
			);
		}

		return tr;
	};
