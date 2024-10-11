import { createElement } from 'react';

import { bind, type UnbindFn } from 'bind-event-listener';
import ReactDOM from 'react-dom';
import { type IntlShape, RawIntlProvider } from 'react-intl-next';
import uuid from 'uuid';

import type { ExtractInjectionAPI } from '@atlaskit/editor-common/types';
import { isEmptyParagraph } from '@atlaskit/editor-common/utils';
import type { Node as PMNode } from '@atlaskit/editor-prosemirror/model';
import type { EditorState } from '@atlaskit/editor-prosemirror/state';
import { Decoration } from '@atlaskit/editor-prosemirror/view';
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
			type: 'drop-target-decoration',
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
) => {
	const decs: Decoration[] = [];
	unmountDecorations('data-blocks-drop-target-container');
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

	newState.doc.descendants((node, pos, parent, index) => {
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
		decs.push(
			createDropTargetDecoration(
				pos,
				{
					api,
					prevNode: previousNode,
					nextNode: node,
					parentNode: parent || undefined,
					formatMessage,
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

	decs.push(
		createDropTargetDecoration(
			newState.doc.nodeSize - 2,
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
			type: 'node-decoration',
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

export const nodeDecorations = (newState: EditorState) => {
	const decs: Decoration[] = [];
	newState.doc.descendants((node, pos, _parent, index) => {
		let depth = 0;
		let anchorName;
		const shouldDescend = !IGNORE_NODE_DESCENDANTS.includes(node.type.name);

		if (
			editorExperiment('dnd-input-performance-optimisation', true, { exposure: true }) ||
			editorExperiment('nested-dnd', true)
		) {
			const handleId = ObjHash.getForNode(node);
			anchorName = `--node-anchor-${node.type.name}-${handleId}`;
		}

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
					type: 'node-decoration',
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
	getIntl: () => IntlShape,
	pos: number,
	anchorName: string,
	nodeType: string,
	handleOptions?: HandleOptions,
) => {
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
				 * However, the tooltip for nested drag handle is not long working.
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

			unmountDecorations('data-blocks-drag-handle-container');

			// There are times when global clear: "both" styles are applied to this decoration causing jumpiness
			// due to margins applied to other nodes eg. Headings
			element.style.clear = 'unset';

			ReactDOM.render(
				createElement(
					RawIntlProvider,
					{ value: getIntl() },
					createElement(DragHandle, {
						view,
						api,
						getPos,
						anchorName,
						nodeType,
						handleOptions,
						isTopLevelNode,
					}),
				),
				element,
			);
			return element;
		},
		{
			side: -1,
			id: 'drag-handle',
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
