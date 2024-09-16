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
import { editorExperiment } from '@atlaskit/tmp-editor-statsig/experiments';

import type { ActiveNode, BlockControlsPlugin, HandleOptions } from '../types';
import { DragHandle } from '../ui/drag-handle';
import { DropTarget, type DropTargetProps } from '../ui/drop-target';
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
const getNestedDepth = () => (editorExperiment('nested-dnd', true) ? 100 : 0);

const createDropTargetDecoration = (
	pos: number,
	dropTargetDec: (
		getPos: () => number | undefined,
	) => React.FunctionComponentElement<DropTargetProps>,
) => {
	return Decoration.widget(
		pos,
		(_, getPos) => {
			const element = document.createElement('div');
			element.setAttribute('data-blocks-drop-target-container', 'true');
			element.style.clear = 'unset';
			ReactDOM.render(dropTargetDec(getPos), element);
			return element;
		},
		{
			type: 'drop-target-decoration',
			side: -1,
		},
	);
};

export const dropTargetDecorations = (
	newState: EditorState,
	api: ExtractInjectionAPI<BlockControlsPlugin>,
	formatMessage: IntlShape['formatMessage'],
	activeNode?: ActiveNode,
) => {
	const decs: Decoration[] = [];
	unmountDecorations('data-blocks-drop-target-container');
	let prevNode: PMNode | undefined;
	const activeNodePos = activeNode?.pos;
	const activePMNode =
		typeof activeNodePos === 'number' && newState.doc.resolve(activeNodePos).nodeAfter;

	newState.doc.descendants((node, pos, parent, index) => {
		let depth = 0;
		// drop target deco at the end position
		let endPos;
		if (editorExperiment('nested-dnd', true)) {
			depth = newState.doc.resolve(pos).depth;
			if (node.isInline || !parent) {
				prevNode = node;
				return false;
			}
			if (IGNORE_NODES.includes(node.type.name)) {
				prevNode = node;
				return true; //skip over, don't consider it a valid depth
			}

			const canDrop = activePMNode && canMoveNodeToIndex(parent, index, activePMNode);

			//NOTE: This will block drop targets showing for nodes that are valid after transformation (i.e. expand -> nestedExpand)
			if (!canDrop && !isBlocksDragTargetDebug()) {
				prevNode = node;
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

		const previousNode = prevNode; // created scoped variable
		decs.push(
			createDropTargetDecoration(pos, (getPos) =>
				createElement(DropTarget, {
					api,
					getPos,
					prevNode: previousNode,
					nextNode: node,
					parentNode: parent,
					formatMessage,
				} as DropTargetProps),
			),
		);

		if (endPos !== undefined) {
			decs.push(
				createDropTargetDecoration(endPos, (getPos) =>
					createElement(DropTarget, {
						api,
						getPos,
						parentNode: parent,
						formatMessage,
					} as DropTargetProps),
				),
			);
		}

		prevNode = node;
		return depth < getNestedDepth();
	});

	//TODO: Should this use createDropTargetDecoration?
	decs.push(
		Decoration.widget(
			newState.doc.nodeSize - 2,
			(_, getPos) => {
				const element = document.createElement('div');
				element.setAttribute('data-blocks-drop-target-container', 'true');
				ReactDOM.render(
					createElement(DropTarget, {
						api,
						getPos,
						formatMessage,
					}),
					element,
				);
				return element;
			},
			{
				type: 'drop-target-decoration',
			},
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
			if (IGNORE_NODES.includes(node.type.name)) {
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

			if (editorExperiment('nested-dnd', true)) {
				unbind = bind(element, {
					type: 'mouseover',
					listener: (e) => {
						e.stopPropagation();
					},
				});
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
