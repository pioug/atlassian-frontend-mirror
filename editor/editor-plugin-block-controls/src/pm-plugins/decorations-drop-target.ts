import { createElement } from 'react';

import ReactDOM from 'react-dom';
import { type IntlShape } from 'react-intl-next';
import uuid from 'uuid';

import type { PortalProviderAPI } from '@atlaskit/editor-common/portal';
import type { ExtractInjectionAPI } from '@atlaskit/editor-common/types';
import { isEmptyParagraph } from '@atlaskit/editor-common/utils';
import type { Node as PMNode } from '@atlaskit/editor-prosemirror/model';
import type { EditorState } from '@atlaskit/editor-prosemirror/state';
import { Decoration, type DecorationSet } from '@atlaskit/editor-prosemirror/view';
import { fg } from '@atlaskit/platform-feature-flags';
import { editorExperiment } from '@atlaskit/tmp-editor-statsig/experiments';

import type { ActiveNode, BlockControlsPlugin } from '../blockControlsPluginType';
import { nodeMargins } from '../ui/consts';
import { DropTarget, type DropTargetProps } from '../ui/drop-target';
import { DropTargetLayout, type DropTargetLayoutProps } from '../ui/drop-target-layout';
import {
	DropTargetV2,
	EDITOR_BLOCK_CONTROLS_DROP_INDICATOR_GAP,
	EDITOR_BLOCK_CONTROLS_DROP_INDICATOR_OFFSET,
} from '../ui/drop-target-v2';

import { getNestedDepth, TYPE_DROP_TARGET_DEC, unmountDecorations } from './decorations-common';
import { type AnchorRectCache } from './utils/anchor-utils';
import { maxLayoutColumnSupported } from './utils/consts';
import { isBlocksDragTargetDebug } from './utils/drag-target-debug';
import { canMoveNodeToIndex, isInSameLayout } from './utils/validation';

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
	if (fg('platform_editor_drag_and_drop_target_v2')) {
		return !['mediaSingle', 'paragraph', 'heading'].includes(node.type.name);
	}
	return true;
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
		(_, getPos) => {
			const element = document.createElement('div');
			element.setAttribute('data-blocks-drop-target-container', 'true');
			element.setAttribute('data-blocks-drop-target-key', key);
			element.style.clear = 'unset';
			if (fg('platform_editor_drag_and_drop_target_v2')) {
				const { gap, offset } = getGapAndOffset(props.prevNode, props.nextNode, props.parentNode);
				element.style.setProperty(EDITOR_BLOCK_CONTROLS_DROP_INDICATOR_OFFSET, `${offset}px`);
				element.style.setProperty(EDITOR_BLOCK_CONTROLS_DROP_INDICATOR_GAP, `${gap}px`);
				element.style.setProperty('display', 'block');

				if (fg('platform_editor_react18_plugin_portalprovider')) {
					nodeViewPortalProviderAPI.render(
						() => createElement(DropTargetV2, { ...props, getPos, anchorRectCache, isSameLayout }),
						element,
						key,
					);
				} else {
					ReactDOM.render(
						createElement(DropTargetV2, { ...props, getPos, anchorRectCache, isSameLayout }),
						element,
					);
				}
			} else {
				if (fg('platform_editor_react18_plugin_portalprovider')) {
					nodeViewPortalProviderAPI.render(
						() => createElement(DropTarget, { ...props, getPos }),
						element,
						key,
					);
				} else {
					ReactDOM.render(createElement(DropTarget, { ...props, getPos }), element);
				}
			}

			return element;
		},
		{
			type: TYPE_DROP_TARGET_DEC,
			side,
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
		(_, getPos) => {
			const element = document.createElement('div');
			element.setAttribute('data-blocks-drop-target-container', 'true');
			element.setAttribute('data-blocks-drop-target-key', key);
			element.style.clear = 'unset';

			if (fg('platform_editor_react18_plugin_portalprovider')) {
				nodeViewPortalProviderAPI.render(
					() => createElement(DropTargetLayout, { ...props, getPos, anchorRectCache }),
					element,
					key,
				);
			} else {
				ReactDOM.render(
					createElement(DropTargetLayout, { ...props, getPos, anchorRectCache }),
					element,
				);
			}
			return element;
		},
		{
			type: TYPE_DROP_TARGET_DEC,
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
	unmountDecorations(
		nodeViewPortalProviderAPI,
		'data-blocks-drop-target-container',
		'data-blocks-drop-target-key',
	);

	const decs: Decoration[] = [];
	const POS_END_OF_DOC = newState.doc.nodeSize - 2;
	const docFrom = from === undefined || from < 0 ? 0 : from;
	const docTo = to === undefined || to > POS_END_OF_DOC ? POS_END_OF_DOC : to;
	let prevNode: PMNode | undefined;
	const activeNodePos = activeNode?.pos;
	const $activeNodePos = typeof activeNodePos === 'number' && newState.doc.resolve(activeNodePos);
	const activePMNode = $activeNodePos && $activeNodePos.nodeAfter;

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

	newState.doc.nodesBetween(docFrom, docTo, (node, pos, parent, index) => {
		let depth = 0;
		// drop target deco at the end position
		let endPos;
		const $pos = newState.doc.resolve(pos);
		const isSameLayout = $activeNodePos && isInSameLayout($activeNodePos, $pos);
		if (editorExperiment('nested-dnd', true)) {
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
				if (fg('platform_editor_drag_and_drop_target_v2')) {
					pushNodeStack(node, depth);
				} else {
					prevNode = node;
				}

				return false;
			}
			if (IGNORE_NODES.includes(node.type.name)) {
				if (fg('platform_editor_drag_and_drop_target_v2')) {
					pushNodeStack(node, depth);
				} else {
					prevNode = node;
				}
				return shouldDescend(node); //skip over, don't consider it a valid depth
			}
			const canDrop = activePMNode && canMoveNodeToIndex(parent, index, activePMNode, $pos, node);

			//NOTE: This will block drop targets showing for nodes that are valid after transformation (i.e. expand -> nestedExpand)
			if (!canDrop && !isBlocksDragTargetDebug()) {
				if (fg('platform_editor_drag_and_drop_target_v2')) {
					pushNodeStack(node, depth);
				} else {
					prevNode = node;
				}
				return false; //not valid pos, so nested not valid either
			}

			if (
				parent.lastChild === node &&
				!isEmptyParagraph(node) &&
				PARENT_WITH_END_DROP_TARGET.includes(parent.type.name)
			) {
				endPos = pos + node.nodeSize;
			}
		}

		const previousNode = fg('platform_editor_drag_and_drop_target_v2')
			? popNodeStack(depth)
			: prevNode; // created scoped variable

		// only table and layout need to render full height drop target
		const isInSupportedContainer =
			fg('platform_editor_drag_and_drop_target_v2') &&
			['tableCell', 'tableHeader', 'layoutColumn'].includes(parent?.type.name || '');

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
						prevNode: fg('platform_editor_drag_and_drop_target_v2') ? node : undefined,
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

		if (fg('platform_editor_drag_and_drop_target_v2')) {
			pushNodeStack(node, depth);
		} else {
			prevNode = node;
		}
		return depth < getNestedDepth() && shouldDescend(node);
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
