import rafSchedule from 'raf-schd';

import { SafePlugin } from '@atlaskit/editor-common/safe-plugin';
import type { ExtractInjectionAPI } from '@atlaskit/editor-common/types';
import type { EditorState, ReadonlyTransaction } from '@atlaskit/editor-prosemirror/state';
import { PluginKey } from '@atlaskit/editor-prosemirror/state';
import { DecorationSet, type EditorView } from '@atlaskit/editor-prosemirror/view';

import type { BlockControlsPlugin, PluginState } from '../types';

import {
	dragHandleDecoration,
	dropTargetDecorations,
	mouseMoveWrapperDecorations,
	nodeDecorations,
} from './decorations';

export const key = new PluginKey<PluginState>('blockControls');

export const createPlugin = (api: ExtractInjectionAPI<BlockControlsPlugin> | undefined) => {
	return new SafePlugin({
		key,
		state: {
			init() {
				return {
					decorations: DecorationSet.empty,
					decorationState: [],
					activeNode: null,
					isDragging: false,
					isMenuOpen: false,
					start: null,
					end: null,
					editorHeight: 0,
				};
			},
			apply(
				tr: ReadonlyTransaction,
				currentState: PluginState,
				oldState: EditorState,
				newState: EditorState,
			) {
				// return currentState;
				let { activeNode, decorations, isMenuOpen, decorationState, editorHeight } = currentState;
				const meta = tr.getMeta(key);

				// Draw node and mouseWrapper decorations at top level node if decorations is empty, editor height changes or node is moved
				const redrawDecorations =
					decorations === DecorationSet.empty ||
					(meta?.editorHeight !== undefined && meta?.editorHeight !== editorHeight) ||
					(tr.docChanged && tr.doc.childCount === newState.doc.childCount) ||
					(meta?.nodeMoved && tr.docChanged);
				if (redrawDecorations && api) {
					decorations = DecorationSet.create(newState.doc, []);
					const nodeDecs = nodeDecorations(newState);
					const mouseWrapperDecs = mouseMoveWrapperDecorations(newState, api);
					decorations = decorations.add(newState.doc, [...nodeDecs, ...mouseWrapperDecs]);
					if (activeNode) {
						const draghandleDec = dragHandleDecoration(
							activeNode.pos,
							activeNode.anchorName,
							activeNode.nodeType,
							api,
						);
						decorations = decorations.add(newState.doc, [draghandleDec]);
					}
				}

				// Remove previous drag handle widget and draw new drag handle widget when activeNode changes
				if (
					meta?.activeNode &&
					meta?.activeNode.pos !== activeNode?.pos &&
					meta?.activeNode.anchorName !== activeNode?.anchorName &&
					api
				) {
					const oldHandle = decorations.find().filter(({ spec }) => spec.id === 'drag-handle');
					decorations = decorations.remove(oldHandle);
					const decs = dragHandleDecoration(
						meta.activeNode.pos,
						meta.activeNode.anchorName,
						meta.activeNode.nodeType,
						api,
					);
					decorations = decorations.add(newState.doc, [decs]);
				}

				// Add drop targets when node is being dragged
				if (meta?.isDragging && !tr.docChanged && api) {
					const { decs, decorationState: updatedDecorationState } = dropTargetDecorations(
						oldState,
						newState,
						api,
					);
					decorationState = updatedDecorationState;
					decorations = decorations.add(newState.doc, decs);
				}

				// Remove drop target decoration when dragging stops
				if (meta?.isDragging === false && !tr.docChanged) {
					const dropTargetDecs = decorations
						.find()
						.filter(({ spec }) => spec.type === 'drop-target-decoration');
					decorations = decorations.remove(dropTargetDecs);
				}

				// Map drop target decoration positions when the document changes
				if (tr.docChanged && currentState.isDragging) {
					decorationState = decorationState.map(({ index, pos }) => {
						return {
							index,
							pos: tr.mapping.map(pos),
						};
					});
				}

				// Map decorations if document changes and node decorations do not need to be redrawn
				if (tr.docChanged && !redrawDecorations) {
					decorations = decorations.map(tr.mapping, tr.doc);
				}

				// Map active node position when the document changes
				const mappedActiveNodePos =
					tr.docChanged && activeNode
						? { pos: tr.mapping.map(activeNode.pos), anchorName: activeNode.anchorName }
						: activeNode;

				return {
					decorations,
					decorationState: decorationState ?? currentState.decorationState,
					activeNode: meta?.activeNode ?? mappedActiveNodePos,
					isDragging: meta?.isDragging ?? currentState.isDragging,
					isMenuOpen: meta?.toggleMenu ? !isMenuOpen : isMenuOpen,
					editorHeight: meta?.editorHeight ?? currentState.editorHeight,
				};
			},
		},
		props: {
			decorations: (state: EditorState) => {
				return key.getState(state)?.decorations;
			},
		},
		view: (editorView: EditorView) => {
			const dom = editorView.dom;

			// Use ResizeObserver to observe height changes
			const resizeObserver = new ResizeObserver(
				rafSchedule(() => {
					const editorHeight = dom.offsetHeight;

					// Update the plugin state when the height changes
					const pluginState = key.getState(editorView.state);
					if (!pluginState?.isDragging) {
						editorView.dispatch(editorView.state.tr.setMeta(key, { editorHeight }));
					}
				}),
			);

			// Start observing the editor DOM element
			resizeObserver.observe(dom);

			return {
				destroy() {
					resizeObserver.unobserve(dom);
				},
			};
		},
	});
};
