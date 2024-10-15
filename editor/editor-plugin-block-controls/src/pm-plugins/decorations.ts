import { createElement } from 'react';

import { bind, type UnbindFn } from 'bind-event-listener';
import ReactDOM from 'react-dom';
import { type IntlShape } from 'react-intl-next';
import uuid from 'uuid';

import type { ExtractInjectionAPI } from '@atlaskit/editor-common/types';
import { isEmptyParagraph } from '@atlaskit/editor-common/utils';
import type { Node as PMNode } from '@atlaskit/editor-prosemirror/model';
import type { EditorState } from '@atlaskit/editor-prosemirror/state';
import { Decoration, type DecorationSet } from '@atlaskit/editor-prosemirror/view';
import { fg } from '@atlaskit/platform-feature-flags';
import { editorExperiment } from '@atlaskit/tmp-editor-statsig/experiments';

import type { ActiveNode, BlockControlsPlugin, HandleOptions } from '../types';
import { nodeMargins } from '../ui/consts';
import { DragHandle } from '../ui/drag-handle';
import { DropTarget, type DropTargetProps } from '../ui/drop-target';
import {
	DropTargetV2,
	EDITOR_BLOCK_CONTROLS_DROP_INDICATOR_GAP,
	EDITOR_BLOCK_CONTROLS_DROP_INDICATOR_OFFSET,
} from '../ui/drop-target-v2';
import { type AnchorHeightsCache } from '../utils/anchor-utils';
import { isBlocksDragTargetDebug } from '../utils/drag-target-debug';
import { canMoveNodeToIndex } from '../utils/validation';

const IGNORE_NODES = [
	'tableCell',
	'tableHeader',
	'tableRow',
	'layoutColumn',
	'listItem',
	'caption',
];
const IGNORE_NODE_DESCENDANTS = ['listItem', 'taskList', 'decisionList', 'mediaSingle'];
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

export const TYPE_DROP_TARGET_DEC = 'drop-target-decoration';
export const TYPE_HANDLE_DEC = 'drag-handle';
export const TYPE_NODE_DEC = 'node-decoration';

const getNestedDepth = () => (editorExperiment('nested-dnd', true) ? 100 : 0);

export const getNodeAnchor = (node: PMNode) => {
	const handleId = ObjHash.getForNode(node);
	return `--node-anchor-${node.type.name}-${handleId}`;
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

const getGapAndOffset = (prevNode?: PMNode, nextNode?: PMNode, parentNode?: PMNode | null) => {
	if (!prevNode && nextNode) {
		// first node
		return { gap: 0, offset: 0 };
	} else if (prevNode && !nextNode) {
		return { gap: 0, offset: 0 };
	}

	const top = getNodeMargins(nextNode).top || 4;
	const bottom = getNodeMargins(prevNode).bottom || 4;

	const gap = Math.max(top, bottom);

	let offset = top - gap / 2;

	if (prevNode?.type.name === 'mediaSingle' && nextNode?.type.name === 'mediaSingle') {
		offset = -offset;
	} else if (prevNode?.type.name && ['tableCell', 'tableHeader'].includes(prevNode?.type.name)) {
		offset = 0;
	}

	return { gap, offset };
};

const shouldDescend = (node: PMNode) => {
	if (fg('platform_editor_drag_and_drop_target_v2')) {
		return !['mediaSingle', 'paragraph', 'heading'].includes(node.type.name);
	}
	return true;
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

export const findHandleDec = (decorations: DecorationSet, from?: number, to?: number) => {
	return decorations.find(from, to, (spec) => spec.type === TYPE_HANDLE_DEC);
};

/**
 * Find node decorations in the pos range between from and to (non-inclusive)
 * @param decorations
 * @param from
 * @param to
 * @returns
 */
export const findNodeDecs = (decorations: DecorationSet, from?: number, to?: number) => {
	let newfrom = from;
	let newTo = to;

	// make it non-inclusive
	if (newfrom !== undefined) {
		newfrom++;
	}

	// make it non-inclusive
	if (newTo !== undefined) {
		newTo--;
	}

	// return empty array if range reversed
	if (newfrom !== undefined && newTo !== undefined && newfrom > newTo) {
		return new Array<Decoration>();
	}

	return decorations.find(newfrom, newTo, (spec) => spec.type === TYPE_NODE_DEC);
};

export const createDropTargetDecoration = (
	pos: number,
	props: Omit<DropTargetProps, 'getPos'>,
	side?: number,
	anchorHeightsCache?: AnchorHeightsCache,
) => {
	return Decoration.widget(
		pos,
		(_, getPos) => {
			const element = document.createElement('div');
			element.setAttribute('data-blocks-drop-target-container', 'true');
			element.style.clear = 'unset';
			if (fg('platform_editor_drag_and_drop_target_v2')) {
				const { gap, offset } = getGapAndOffset(props.prevNode, props.nextNode, props.parentNode);
				element.style.setProperty(EDITOR_BLOCK_CONTROLS_DROP_INDICATOR_OFFSET, `${offset}px`);
				element.style.setProperty(EDITOR_BLOCK_CONTROLS_DROP_INDICATOR_GAP, `${gap}px`);
			}

			if (fg('platform_editor_drag_and_drop_target_v2')) {
				ReactDOM.render(
					createElement(DropTargetV2, { ...props, getPos, anchorHeightsCache }),
					element,
				);
			} else {
				ReactDOM.render(createElement(DropTarget, { ...props, getPos }), element);
			}

			return element;
		},
		{
			type: TYPE_DROP_TARGET_DEC,
			side,
		},
	);
};

export const dropTargetDecorations = (
	newState: EditorState,
	api: ExtractInjectionAPI<BlockControlsPlugin>,
	formatMessage: IntlShape['formatMessage'],
	activeNode?: ActiveNode,
	anchorHeightsCache?: AnchorHeightsCache,
	from?: number,
	to?: number,
) => {
	unmountDecorations('data-blocks-drop-target-container');

	const decs: Decoration[] = [];
	const POS_END_OF_DOC = newState.doc.nodeSize - 2;
	const docFrom = from === undefined || from < 0 ? 0 : from;
	const docTo = to === undefined || to > POS_END_OF_DOC ? POS_END_OF_DOC : to;
	let prevNode: PMNode | undefined;
	const activeNodePos = activeNode?.pos;
	const activePMNode =
		typeof activeNodePos === 'number' && newState.doc.resolve(activeNodePos).nodeAfter;

	anchorHeightsCache?.clear();

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

	newState.doc.nodesBetween(docFrom, docTo, (node, pos, parent, index) => {
		let depth = 0;
		// drop target deco at the end position
		let endPos;
		if (editorExperiment('nested-dnd', true)) {
			depth = newState.doc.resolve(pos).depth;

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

			const canDrop = activePMNode && canMoveNodeToIndex(parent, index, activePMNode);

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

		// container with only an empty paragrah
		const shouldShowFullHeight =
			isInSupportedContainer &&
			parent?.lastChild === node &&
			parent?.childCount === 1 &&
			isEmptyParagraph(node) &&
			fg('platform_editor_drag_and_drop_target_v2');

		decs.push(
			createDropTargetDecoration(
				pos,
				{
					api,
					prevNode: previousNode,
					nextNode: node,
					parentNode: parent || undefined,
					formatMessage,
					dropTargetStyle: shouldShowFullHeight ? 'fullHeight' : 'default',
				},
				-1,
				anchorHeightsCache,
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
						dropTargetStyle: isInSupportedContainer ? 'fullHeight' : 'default',
					},
					-1,
					anchorHeightsCache,
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
				undefined,
				anchorHeightsCache,
			),
		);
	}

	return decs;
};

export const emptyParagraphNodeDecorations = () => {
	const anchorName = `--node-anchor-paragraph-0`;
	const style = `anchor-name: ${anchorName}; margin-top: 0px;`;
	return Decoration.node(
		0,
		2,
		{
			style,
			['data-drag-handler-anchor-name']: anchorName,
		},
		{
			type: TYPE_NODE_DEC,
		},
	);
};

class ObjHash {
	static caching = new WeakMap();

	static getForNode(node: PMNode) {
		if (this.caching.has(node)) {
			return this.caching.get(node);
		}
		const uniqueId = uuid();
		this.caching.set(node, uniqueId);
		return uniqueId;
	}
}

const shouldIgnoreNode = (node: PMNode) => {
	if ('mediaSingle' === node.type.name && fg('platform_editor_element_dnd_nested_fix_patch_1')) {
		if (['wrap-right', 'wrap-left'].includes(node.attrs.layout)) {
			return true;
		}
	}
	return IGNORE_NODES.includes(node.type.name);
};

export const nodeDecorations = (newState: EditorState, from?: number, to?: number) => {
	const decs: Decoration[] = [];
	const docFrom = from === undefined || from < 0 ? 0 : from;
	const docTo = to === undefined || to > newState.doc.nodeSize - 2 ? newState.doc.nodeSize - 2 : to;

	newState.doc.nodesBetween(docFrom, docTo, (node, pos, _parent, index) => {
		let depth = 0;
		let anchorName;
		const shouldDescend = !IGNORE_NODE_DESCENDANTS.includes(node.type.name);
		const handleId = ObjHash.getForNode(node);
		anchorName = `--node-anchor-${node.type.name}-${handleId}`;

		if (editorExperiment('nested-dnd', true)) {
			// Doesn't descend into a node
			if (node.isInline) {
				return false;
			}

			if (shouldIgnoreNode(node)) {
				return shouldDescend; //skip over, don't consider it a valid depth
			}

			depth = newState.doc.resolve(pos).depth;
			anchorName = anchorName ?? `--node-anchor-${node.type.name}-${pos}`;
		} else {
			anchorName = anchorName ?? `--node-anchor-${node.type.name}-${index}`;
		}

		decs.push(
			Decoration.node(
				pos,
				pos + node.nodeSize,
				{
					style: `anchor-name: ${anchorName}; ${pos === 0 ? 'margin-top: 0px;' : ''}; position: relative; z-index: 1;`,
					['data-drag-handler-anchor-name']: anchorName,
					['data-drag-handler-node-type']: node.type.name,
					['data-drag-handler-anchor-depth']: `${depth}`,
				},
				{
					type: TYPE_NODE_DEC,
					anchorName,
					nodeType: node.type.name,
				},
			),
		);

		return shouldDescend && depth < getNestedDepth();
	});
	return decs;
};

export const dragHandleDecoration = (
	api: ExtractInjectionAPI<BlockControlsPlugin>,
	formatMessage: IntlShape['formatMessage'],
	pos: number,
	anchorName: string,
	nodeType: string,
	handleOptions?: HandleOptions,
) => {
	unmountDecorations('data-blocks-drag-handle-container');

	let unbind: UnbindFn;
	return Decoration.widget(
		pos,
		(view, getPos) => {
			const element = document.createElement('span');
			// Need to set it to inline to avoid text being split when merging two paragraphs
			element.style.display = 'inline';
			element.setAttribute('data-testid', 'block-ctrl-decorator-widget');
			element.setAttribute('data-blocks-drag-handle-container', 'true');
			let isTopLevelNode = true;

			if (editorExperiment('nested-dnd', true)) {
				const $pos = view.state.doc.resolve(pos);
				isTopLevelNode = $pos?.parent.type.name === 'doc';
				/*
				 * We disable mouseover event to fix flickering issue on hover
				 * However, the tooltip for nested drag handle is no long working.
				 */
				if (!isTopLevelNode) {
					// This will also hide the tooltip.
					unbind = bind(element, {
						type: 'mouseover',
						listener: (e) => {
							e.stopPropagation();
						},
					});
				}
			}

			// There are times when global clear: "both" styles are applied to this decoration causing jumpiness
			// due to margins applied to other nodes eg. Headings
			element.style.clear = 'unset';

			ReactDOM.render(
				createElement(DragHandle, {
					view,
					api,
					formatMessage,
					getPos,
					anchorName,
					nodeType,
					handleOptions,
					isTopLevelNode,
				}),
				element,
			);
			return element;
		},
		{
			side: -1,
			type: TYPE_HANDLE_DEC,
			testid: `${TYPE_HANDLE_DEC}-${uuid()}`,
			destroy: () => {
				if (editorExperiment('nested-dnd', true)) {
					unbind && unbind();
				}
			},
		},
	);
};

const unmountDecorations = (selector: string) => {
	// Removing decorations manually instead of using native destroy function in prosemirror API
	// as it was more responsive and causes less re-rendering
	const decorationsToRemove = document.querySelectorAll(`[${selector}="true"]`);
	decorationsToRemove.forEach((el) => {
		ReactDOM.unmountComponentAtNode(el);
	});
};
