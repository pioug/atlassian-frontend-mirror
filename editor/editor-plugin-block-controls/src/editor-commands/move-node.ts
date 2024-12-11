import { type IntlShape } from 'react-intl-next';

import {
	ACTION,
	ACTION_SUBJECT,
	ACTION_SUBJECT_ID,
	EVENT_TYPE,
	INPUT_METHOD,
} from '@atlaskit/editor-common/analytics';
import { blockControlsMessages } from '@atlaskit/editor-common/messages';
import { GapCursorSelection } from '@atlaskit/editor-common/selection';
import { transformSliceNestedExpandToExpand } from '@atlaskit/editor-common/transforms';
import type { Command, EditorCommand, ExtractInjectionAPI } from '@atlaskit/editor-common/types';
import { isEmptyParagraph } from '@atlaskit/editor-common/utils';
import {
	Fragment,
	type NodeType,
	type ResolvedPos,
	type Slice,
} from '@atlaskit/editor-prosemirror/model';
import { type EditorState, Selection } from '@atlaskit/editor-prosemirror/state';
import { findParentNodeOfType } from '@atlaskit/editor-prosemirror/utils';
import { findTable, isInTable, isTableSelected } from '@atlaskit/editor-tables/utils';
import { fg } from '@atlaskit/platform-feature-flags';
import { editorExperiment } from '@atlaskit/tmp-editor-statsig/experiments';

import type { BlockControlsPlugin, MoveNodeMethod } from '../blockControlsPluginType';
import { key } from '../pm-plugins/main';
import { DIRECTION } from '../pm-plugins/utils/consts';
import { fireMoveNodeAnalytics } from '../pm-plugins/utils/fire-analytics';
import { getNestedNodePosition } from '../pm-plugins/utils/getNestedNodePosition';
import { selectNode, setCursorPositionAtMovedNode } from '../pm-plugins/utils/getSelection';
import { removeFromSource } from '../pm-plugins/utils/remove-from-source';
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
const getCurrentNodePos = (state: EditorState, isParentNodeOfTypeLayout?: boolean): number => {
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
		if (
			selection.$from.depth > 0 &&
			editorExperiment('nested-dnd', true) &&
			fg('platform_editor_element_dnd_nested_a11y')
		) {
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
		const shouldEnableNestedDndA11y =
			editorExperiment('nested-dnd', true) && fg('platform_editor_element_dnd_nested_a11y');

		if (shouldEnableNestedDndA11y) {
			isParentNodeOfTypeLayout = !!findParentNodeOfType([state.schema.nodes.layoutSection])(
				state.selection,
			);
		}

		const currentNodePos = getCurrentNodePos(state, isParentNodeOfTypeLayout);

		if (currentNodePos > -1) {
			const $pos = state.doc.resolve(currentNodePos);
			let moveToPos = -1;

			const nodeIndex = $pos.index();

			if (direction === DIRECTION.LEFT && shouldEnableNestedDndA11y) {
				if ($pos.depth < 2 || !isParentNodeOfTypeLayout) {
					return false;
				}

				// get the previous layoutSection node
				const index = $pos.index($pos.depth - 1);
				const grandParent = $pos.node($pos.depth - 1);
				const previousNode = grandParent ? grandParent.maybeChild(index - 1) : null;

				moveToPos = $pos.start() - (previousNode?.nodeSize || 1);
			} else if (direction === DIRECTION.RIGHT && shouldEnableNestedDndA11y) {
				if ($pos.depth < 2 || !isParentNodeOfTypeLayout) {
					return false;
				}

				moveToPos = $pos.after($pos.depth) + 1;
			} else if (direction === DIRECTION.UP) {
				const nodeBefore =
					$pos.depth > 1 && nodeIndex === 0 && shouldEnableNestedDndA11y
						? $pos.node($pos.depth)
						: $pos.nodeBefore;

				if (nodeBefore) {
					moveToPos = currentNodePos - nodeBefore.nodeSize;
				}
			} else {
				const endOfDoc = $pos.end();
				const nodeAfterPos = $pos.posAtIndex($pos.index() + 1);
				const nodeAfter = state.doc.nodeAt(nodeAfterPos);

				if (nodeAfterPos < endOfDoc && nodeAfter) {
					// if not the last node, move to the end of the next node
					moveToPos = nodeAfterPos + nodeAfter.nodeSize;
				}
			}

			const nodeType = state.doc.nodeAt(currentNodePos)?.type.name;

			// only move the node if the destination is at the same depth, not support moving a nested node to a parent node
			const shouldMoveNode = shouldEnableNestedDndA11y
				? moveToPos > -1 && $pos.depth === state.doc.resolve(moveToPos).depth
				: moveToPos > -1;

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
		const node = tr.doc.nodeAt(start);
		const resolvedNode = tr.doc.resolve(start);

		if (!node) {
			return tr;
		}
		const size = node?.nodeSize ?? 1;
		const end = start + size;

		const $from = tr.doc.resolve(start);
		let mappedTo;
		if (editorExperiment('nested-dnd', true)) {
			const nodeCopy = tr.doc.slice(start, end, false); // cut the content
			const $to = tr.doc.resolve(to);
			const destType = $to.node().type;
			const destParent = $to.node($to.depth);

			const sourceNode = $from.nodeAfter;

			// Move a layout column to top level
			if (sourceNode && isDragLayoutColumnToTopLevel($from, $to)) {
				// need update after we support single column layout.
				const fragment = Fragment.from(sourceNode.content);
				removeFromSource(tr, $from);
				const mappedTo = tr.mapping.map(to);
				tr.insert(mappedTo, fragment)
					.setSelection(Selection.near(tr.doc.resolve(mappedTo)))
					.scrollIntoView();

				return tr;
			}

			if (!canMoveNodeToIndex(destParent, $to.index(), $from.node().child($from.index()), $to)) {
				return tr;
			}

			const convertedNodeSlice = transformSourceSlice(nodeCopy, destType);
			const convertedNode = convertedNodeSlice?.content;
			if (!convertedNode) {
				return tr;
			}
			tr.delete(start, end); // delete the content from the original position
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
			const nodeCopy = tr.doc.content.cut(start, end); // cut the content
			tr.delete(start, end); // delete the content from the original position
			mappedTo = tr.mapping.map(to);
			tr.insert(mappedTo, nodeCopy); // insert the content at the new position
		}

		tr =
			inputMethod === INPUT_METHOD.DRAG_AND_DROP &&
			fg('platform_editor_element_dnd_nested_fix_patch_2')
				? setCursorPositionAtMovedNode(tr, mappedTo)
				: selectNode(tr, mappedTo, node.type.name);

		tr.setMeta(key, { nodeMoved: true });
		api?.core.actions.focus();
		const $mappedTo = tr.doc.resolve(mappedTo);

		if (editorExperiment('advanced_layouts', true)) {
			fireMoveNodeAnalytics(
				tr,
				inputMethod,
				resolvedNode.depth,
				node.type.name,
				$mappedTo?.depth,
				$mappedTo?.parent.type.name,
				$from.sameParent($mappedTo),
				api,
			);
		} else {
			api?.analytics?.actions.attachAnalyticsEvent({
				eventType: EVENT_TYPE.TRACK,
				action: ACTION.MOVED,
				actionSubject: ACTION_SUBJECT.ELEMENT,
				actionSubjectId: ACTION_SUBJECT_ID.ELEMENT_DRAG_HANDLE,
				attributes: {
					nodeDepth: resolvedNode.depth,
					nodeType: node.type.name,
					destinationNodeDepth: $mappedTo?.depth,
					destinationNodeType: $mappedTo?.parent.type.name,
					...(fg('platform_editor_element_drag_and_drop_ed_23873') && { inputMethod }),
				},
			})(tr);
		}

		if (fg('platform_editor_element_drag_and_drop_ed_23873')) {
			const movedMessage =
				to > start ? blockControlsMessages.movedDown : blockControlsMessages.movedup;

			api?.accessibilityUtils?.actions.ariaNotify(
				formatMessage ? formatMessage(movedMessage) : movedMessage.defaultMessage,
				{ priority: 'important' },
			);
		}

		return tr;
	};
