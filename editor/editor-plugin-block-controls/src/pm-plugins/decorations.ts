import { createElement } from 'react';

import ReactDOM from 'react-dom';

import type { ExtractInjectionAPI } from '@atlaskit/editor-common/types';
import type { EditorState } from '@atlaskit/editor-prosemirror/state';
import { Decoration } from '@atlaskit/editor-prosemirror/view';
import { getBooleanFF } from '@atlaskit/platform-feature-flags';

import type { BlockControlsPlugin } from '../types';
import { DragHandle } from '../ui/drag-handle';
import { DropTarget } from '../ui/drop-target';
import { MouseMoveWrapper } from '../ui/mouse-move-wrapper';

export const dropTargetDecorations = (
	oldState: EditorState,
	newState: EditorState,
	api: ExtractInjectionAPI<BlockControlsPlugin>,
) => {
	const decs: Decoration[] = [];
	unmountDecorations('data-blocks-drop-target-container');
	// Decoration state is used to keep track of the position of the drop targets
	// and allows us to easily map the updated position in the plugin apply method.
	const decorationState: { index: number; pos: number }[] = [];
	oldState.doc.nodesBetween(0, newState.doc.nodeSize - 2, (_node, pos, _parent, index) => {
		decorationState.push({ index, pos });
		decs.push(
			Decoration.widget(
				pos,
				() => {
					const element = document.createElement('div');
					element.setAttribute('data-blocks-drop-target-container', 'true');
					if (getBooleanFF('platform.editor.elements.drag-and-drop-remove-wrapper_fyqr2')) {
						element.style.clear = 'unset';
					}
					ReactDOM.render(
						createElement(DropTarget, {
							api,
							index,
						}),
						element,
					);
					return element;
				},
				{
					type: 'drop-target-decoration',
					side: -1,
				},
			),
		);
		return false;
	});

	/**
	 * We are adding a drop target at the end of the document because by default we
	 * draw all drop targets at the top of every node. It's better to draw the drop targets
	 * at the top of each node because that way we only need to know the start position of the
	 * node and not its size.
	 *
	 */
	decorationState.push({
		index: decorationState.length + 1,
		pos: newState.doc.nodeSize - 2,
	});
	decs.push(
		Decoration.widget(
			newState.doc.nodeSize - 2,
			() => {
				const element = document.createElement('div');
				element.setAttribute('data-blocks-drop-target-container', 'true');
				ReactDOM.render(
					createElement(DropTarget, {
						api,
						index: decorationState.length,
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

	return { decs, decorationState };
};

export const nodeDecorations = (newState: EditorState) => {
	const decs: Decoration[] = [];
	newState.doc.descendants((node, pos, _parent, index) => {
		const anchorName = `--node-anchor-${node.type.name}-${index}`;
		let style;
		if (getBooleanFF('platform.editor.elements.drag-and-drop-remove-wrapper_fyqr2')) {
			style = `anchor-name: ${anchorName}; ${pos === 0 ? 'margin-top: 0px;' : ''}; position: relative; z-index: 1;`;
		} else {
			style = `anchor-name: ${anchorName}; ${pos === 0 ? 'margin-top: 0px;' : ''}`;
		}

		decs.push(
			Decoration.node(pos, pos + node.nodeSize, {
				style,
				['data-drag-handler-anchor-name']: anchorName,
				['data-drag-handler-node-type']: node.type.name,
			}),
		);
		return false;
	});
	return decs;
};
/**
 * Setting up decorations around each node to track mousemove events into each node
 * When a mouseenter event is triggered on the node, we will set the activeNode to the node
 * And show the drag handle
 */
export const mouseMoveWrapperDecorations = (
	newState: EditorState,
	api: ExtractInjectionAPI<BlockControlsPlugin>,
) => {
	const decs: Decoration[] = [];
	unmountDecorations('data-blocks-decoration-container');

	newState.doc.descendants((node, pos, _parent, index) => {
		const anchorName = `--node-anchor-${node.type.name}-${index}`;
		decs.push(
			Decoration.widget(
				pos,
				(view, getPos) => {
					const element = document.createElement('div');
					element.setAttribute('data-blocks-decoration-container', 'true');
					ReactDOM.render(
						createElement(MouseMoveWrapper, {
							view,
							api,
							anchorName,
							nodeType: node.type.name,
							getPos,
						}),
						element,
					);
					return element;
				},
				{
					type: 'mouse-move-wrapper',
					side: -1,
					ignoreSelection: true,
					stopEvent: (e) => {
						return true;
					},
				},
			),
		);
		return false;
	});
	return decs;
};

export const dragHandleDecoration = (
	pos: number,
	anchorName: string,
	nodeType: string,
	api: ExtractInjectionAPI<BlockControlsPlugin>,
) => {
	return Decoration.widget(
		pos,
		(view, getPos) => {
			const element = document.createElement('div');
			// Need to set it to inline to avoid text being split when merging two paragraphs
			element.style.display = 'inline';
			element.setAttribute('data-testid', 'block-ctrl-decorator-widget');
			element.setAttribute('data-blocks-drag-handle-container', 'true');
			if (getBooleanFF('platform.editor.elements.drag-and-drop-remove-wrapper_fyqr2')) {
				// There are times when global clear: "both" styles are applied to this decoration causing jumpiness
				// due to margins applied to other nodes eg. Headings
				element.style.clear = 'unset';
			}
			ReactDOM.render(
				createElement(DragHandle, {
					view,
					api,
					getPos,
					anchorName,
					nodeType,
				}),
				element,
			);
			return element;
		},
		{
			side: -1,
			id: 'drag-handle',
			destroy: (node) => {
				ReactDOM.unmountComponentAtNode(node as HTMLDivElement);
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
