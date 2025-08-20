import { createElement } from 'react';

import { type IntlShape } from 'react-intl-next';
import uuid from 'uuid';

import type { PortalProviderAPI } from '@atlaskit/editor-common/portal';
import { expandSelectionBounds } from '@atlaskit/editor-common/selection';
import type { ExtractInjectionAPI } from '@atlaskit/editor-common/types';
import { isEmptyParagraph } from '@atlaskit/editor-common/utils';
import type { Node as PMNode } from '@atlaskit/editor-prosemirror/model';
import type { EditorState } from '@atlaskit/editor-prosemirror/state';
import { Decoration, type DecorationSet } from '@atlaskit/editor-prosemirror/view';
import { editorExperiment } from '@atlaskit/tmp-editor-statsig/experiments';

import type { ActiveNode, BlockControlsPlugin } from '../blockControlsPluginType';
import { nodeMargins } from '../ui/consts';
import {
	type DropTargetProps,
	DropTarget,
	EDITOR_BLOCK_CONTROLS_DROP_INDICATOR_GAP,
	EDITOR_BLOCK_CONTROLS_DROP_INDICATOR_OFFSET,
} from '../ui/drop-target';
import { DropTargetLayout, type DropTargetLayoutProps } from '../ui/drop-target-layout';

import { NESTED_DEPTH, TYPE_DROP_TARGET_DEC } from './decorations-common';
import { type AnchorRectCache } from './utils/anchor-utils';
import { maxLayoutColumnSupported } from './utils/consts';
import { canMoveNodeToIndex, canMoveSliceToIndex, isInSameLayout } from './utils/validation';

const IGNORE_NODES = [
	'tableCell',
	'tableHeader',
	'tableRow',
	'layoutColumn',
	'listItem',
	'caption',
];

const PARENT_WITH_END_DROP_TARGET = [
	'tableCell',
	'tableHeader',
	'panel',
	'layoutColumn',
	'expand',
	'nestedExpand',
	'bodiedExtension',
];
const DISABLE_CHILD_DROP_TARGET = ['orderedList', 'bulletList'];

const shouldDescend = (node: PMNode) => {
	return !['mediaSingle', 'paragraph', 'heading'].includes(node.type.name);
};

const getNodeMargins = (node?: PMNode) => {
	if (!node) {
		return nodeMargins['default'];
	}
	const nodeTypeName = node.type.name;
	if (nodeTypeName === 'heading') {
		return nodeMargins[`heading${node.attrs.level}`] || nodeMargins['default'];
	}

	return nodeMargins[nodeTypeName] || nodeMargins['default'];
};

const shouldCollapseMargin = (prevNode?: PMNode, nextNode?: PMNode) => {
	if (
		(prevNode?.type.name === 'mediaSingle' || nextNode?.type.name === 'mediaSingle') &&
		prevNode?.type.name !== nextNode?.type.name
	) {
		return false;
	}

	return true;
};

const getGapAndOffset = (prevNode?: PMNode, nextNode?: PMNode, parentNode?: PMNode | null) => {
	if (!prevNode && nextNode) {
		// first node
		return { gap: 0, offset: 0 };
	} else if (prevNode && !nextNode) {
		return { gap: 0, offset: 0 };
	}

	const top = getNodeMargins(nextNode).top || 4;
	const bottom = getNodeMargins(prevNode).bottom || 4;

	const gap = shouldCollapseMargin(prevNode, nextNode) ? Math.max(top, bottom) : top + bottom;

	let offset = top - gap / 2;

	if (prevNode?.type.name === 'mediaSingle' && nextNode?.type.name === 'mediaSingle') {
		offset = -offset;
	} else if (prevNode?.type.name && ['tableCell', 'tableHeader'].includes(prevNode?.type.name)) {
		offset = 0;
	}

	return { gap, offset };
};

/**
 * Find drop target decorations in the pos range between from and to
 * @param decorations
 * @param from
 * @param to
 * @returns
 */
export const findDropTargetDecs = (decorations: DecorationSet, from?: number, to?: number) => {
	return decorations.find(from, to, (spec) => spec.type === TYPE_DROP_TARGET_DEC);
};

export const createDropTargetDecoration = (
	pos: number,
	props: Omit<DropTargetProps, 'getPos'>,
	nodeViewPortalProviderAPI: PortalProviderAPI,
	side?: number,
	anchorRectCache?: AnchorRectCache,
	isSameLayout?: boolean,
) => {
	const key = uuid();
	return Decoration.widget(
		pos,
		(_, getPosUnsafe) => {
			const getPos = () => {
				try {
					return getPosUnsafe();
				} catch (e) {
					return undefined;
				}
			};
			const element = document.createElement('div');
			element.setAttribute('data-blocks-drop-target-container', 'true');
			element.setAttribute('data-blocks-drop-target-key', key);
			element.style.clear = 'unset';
			const { gap, offset } = getGapAndOffset(props.prevNode, props.nextNode, props.parentNode);
			element.style.setProperty(EDITOR_BLOCK_CONTROLS_DROP_INDICATOR_OFFSET, `${offset}px`);
			element.style.setProperty(EDITOR_BLOCK_CONTROLS_DROP_INDICATOR_GAP, `${gap}px`);
			element.style.setProperty('display', 'block');

			nodeViewPortalProviderAPI.render(
				() => createElement(DropTarget, { ...props, getPos, anchorRectCache, isSameLayout }),
				element,
				key,
				undefined,
				// @portal-render-immediately
				true,
			);

			return element;
		},
		{
			type: TYPE_DROP_TARGET_DEC,
			side,
			destroy: () => {
				nodeViewPortalProviderAPI.remove(key);
			},
		},
	);
};

export const createLayoutDropTargetDecoration = (
	pos: number,
	props: Omit<DropTargetLayoutProps, 'getPos'>,
	nodeViewPortalProviderAPI: PortalProviderAPI,
	anchorRectCache?: AnchorRectCache,
) => {
	const key = uuid();
	return Decoration.widget(
		pos,
		(_, getPosUnsafe) => {
			const getPos = () => {
				try {
					return getPosUnsafe();
				} catch (e) {
					return undefined;
				}
			};
			const element = document.createElement('div');
			element.setAttribute('data-blocks-drop-target-container', 'true');
			element.setAttribute('data-blocks-drop-target-key', key);
			element.style.clear = 'unset';

			nodeViewPortalProviderAPI.render(
				() => createElement(DropTargetLayout, { ...props, getPos, anchorRectCache }),
				element,
				key,
				undefined,
				// @portal-render-immediately
				true,
			);
			return element;
		},
		{
			type: TYPE_DROP_TARGET_DEC,
			destroy: () => {
				nodeViewPortalProviderAPI.remove(key);
			},
		},
	);
};

export const dropTargetDecorations = (
	newState: EditorState,
	api: ExtractInjectionAPI<BlockControlsPlugin>,
	formatMessage: IntlShape['formatMessage'],
	nodeViewPortalProviderAPI: PortalProviderAPI,
	activeNode?: ActiveNode,
	anchorRectCache?: AnchorRectCache,
	from?: number,
	to?: number,
) => {
	const decs: Decoration[] = [];
	const POS_END_OF_DOC = newState.doc.nodeSize - 2;
	const docFrom = from === undefined || from < 0 ? 0 : from;
	const docTo = to === undefined || to > POS_END_OF_DOC ? POS_END_OF_DOC : to;
	const activeNodePos = activeNode?.pos;
	const $activeNodePos = typeof activeNodePos === 'number' && newState.doc.resolve(activeNodePos);
	const activePMNode = $activeNodePos && $activeNodePos.nodeAfter;
	const isMultiSelect = editorExperiment('platform_editor_element_drag_and_drop_multiselect', true);

	anchorRectCache?.clear();

	const prevNodeStack: PMNode[] = [];

	const popNodeStack = (depth: number) => {
		let result;
		const toDepth = Math.max(depth, 0);
		while (prevNodeStack.length > toDepth) {
			result = prevNodeStack.pop();
		}
		return result;
	};

	const pushNodeStack = (node: PMNode, depth: number) => {
		popNodeStack(depth);
		prevNodeStack.push(node);
	};

	const isAdvancedLayoutsPreRelease2 = editorExperiment('advanced_layouts', true);

	// For deciding to show drop targets or not when multiple nodes are selected
	const selection = newState.selection;
	const { $anchor: expandedAnchor, $head: expandedHead } = expandSelectionBounds(
		selection.$anchor,
		selection.$head,
	);
	const selectionFrom = Math.min(expandedAnchor.pos, expandedHead.pos);
	const selectionTo = Math.max(expandedAnchor.pos, expandedHead.pos);
	const handleInsideSelection =
		activeNodePos !== undefined && activeNodePos >= selectionFrom && activeNodePos <= selectionTo;

	newState.doc.nodesBetween(docFrom, docTo, (node, pos, parent, index) => {
		let depth = 0;
		// drop target deco at the end position
		let endPos;
		const $pos = newState.doc.resolve(pos);
		const isSameLayout = $activeNodePos && isInSameLayout($activeNodePos, $pos);
		depth = $pos.depth;

		if (isAdvancedLayoutsPreRelease2) {
			if (activeNode?.pos === pos && activeNode.nodeType !== 'layoutColumn') {
				return false;
			}

			if (
				node.type.name === 'layoutColumn' &&
				parent?.type.name === 'layoutSection' &&
				index !== 0 && // Not the first node
				(parent?.childCount < maxLayoutColumnSupported() || isSameLayout)
			) {
				// Add drop target for layout columns
				decs.push(
					createLayoutDropTargetDecoration(
						pos,
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

		if (node.isInline || !parent || DISABLE_CHILD_DROP_TARGET.includes(parent.type.name)) {
			pushNodeStack(node, depth);
			return false;
		}
		if (IGNORE_NODES.includes(node.type.name)) {
			pushNodeStack(node, depth);
			return shouldDescend(node); //skip over, don't consider it a valid depth
		}

		// When multi select is on, validate all the nodes in the selection instead of just the handle node
		if (isMultiSelect) {
			const selectionSlice = newState.doc.slice(selectionFrom, selectionTo, false);
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
					$pos,
				);
			} else {
				canDropSingleNode = !!(
					activePMNode && canMoveNodeToIndex(parent, index, activePMNode, $pos, node)
				);
			}

			if (!canDropMultipleNodes || !canDropSingleNode) {
				pushNodeStack(node, depth);
				return false; //not valid pos, so nested not valid either
			}
		} else {
			const canDrop = activePMNode && canMoveNodeToIndex(parent, index, activePMNode, $pos, node);

			//NOTE: This will block drop targets showing for nodes that are valid after transformation (i.e. expand -> nestedExpand)
			if (!canDrop) {
				pushNodeStack(node, depth);
				return false; //not valid pos, so nested not valid either
			}
		}

		if (
			parent.lastChild === node &&
			!isEmptyParagraph(node) &&
			PARENT_WITH_END_DROP_TARGET.includes(parent.type.name)
		) {
			endPos = pos + node.nodeSize;
		}

		const previousNode = popNodeStack(depth); // created scoped variable

		// only table and layout need to render full height drop target
		const isInSupportedContainer = ['tableCell', 'tableHeader', 'layoutColumn'].includes(
			parent?.type.name || '',
		);

		const shouldShowFullHeight =
			isInSupportedContainer && parent?.lastChild === node && isEmptyParagraph(node);

		decs.push(
			createDropTargetDecoration(
				pos,
				{
					api,
					prevNode: previousNode,
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

		if (endPos !== undefined) {
			decs.push(
				createDropTargetDecoration(
					endPos,
					{
						api,
						prevNode: node,
						parentNode: parent || undefined,
						formatMessage,
						dropTargetStyle: 'remainingHeight',
					},
					nodeViewPortalProviderAPI,
					-1,
					anchorRectCache,
				),
			);
		}

		pushNodeStack(node, depth);
		return depth < NESTED_DEPTH && shouldDescend(node);
	});

	if (docTo === POS_END_OF_DOC) {
		decs.push(
			createDropTargetDecoration(
				POS_END_OF_DOC,
				{
					api,
					formatMessage,
					prevNode: newState.doc.lastChild || undefined,
					parentNode: newState.doc,
				},
				nodeViewPortalProviderAPI,
				undefined,
				anchorRectCache,
			),
		);
	}

	return decs;
};
