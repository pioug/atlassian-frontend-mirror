import { SafePlugin } from '@atlaskit/editor-common/safe-plugin';
import type { ExtractInjectionAPI } from '@atlaskit/editor-common/types';
import type { EditorState, ReadonlyTransaction } from '@atlaskit/editor-prosemirror/state';
import { PluginKey } from '@atlaskit/editor-prosemirror/state';
import type { EditorView } from '@atlaskit/editor-prosemirror/view';
import { DecorationSet } from '@atlaskit/editor-prosemirror/view';

import type { BlockControlsPlugin, PluginState } from '../types';

import { dragHandleDecoration, dropTargetDecorations } from './decorations';

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
				};
			},
			apply(
				tr: ReadonlyTransaction,
				currentState: PluginState,
				oldState: EditorState,
				newState: EditorState,
			) {
				// return currentState;
				let { activeNode, decorations, isMenuOpen, decorationState } = currentState;
				const meta = tr.getMeta(key);

				// Drag handle decoration
				if (meta && meta.pos !== activeNode?.pos && api) {
					decorations = dragHandleDecoration(newState, meta, api);
				}
				// Drop target decorations
				if (meta?.isDragging && api) {
					decorations = DecorationSet.create(newState.doc, []);
					const { decs, decorationState: updatedDecorationState } = dropTargetDecorations(
						oldState,
						newState,
						api,
					);
					decorationState = updatedDecorationState;
					decorations = decorations.add(newState.doc, decs);
				}

				// Remove drop target decorations when dragging is stopped
				if (meta?.isDragging === false) {
					decorations = DecorationSet.create(newState.doc, []);
				}

				// Map decorations when the document changes
				if (tr.docChanged && decorations !== DecorationSet.empty) {
					decorations = decorations.map(tr.mapping, tr.doc);
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

				// Map active node position when the document changes
				const mappedActiveNodePos =
					tr.docChanged && activeNode ? tr.mapping.map(activeNode.pos) : activeNode?.pos;

				return {
					decorations,
					decorationState: decorationState ?? currentState.decorationState,
					activeNode: {
						pos: meta?.pos ?? mappedActiveNodePos,
					},
					isDragging: meta?.isDragging ?? currentState.isDragging,
					isMenuOpen: meta?.toggleMenu ? !isMenuOpen : isMenuOpen,
				};
			},
		},

		props: {
			decorations: (state: EditorState) => {
				return key.getState(state)?.decorations;
			},
			handleDOMEvents: {
				mousemove(view: EditorView, event: MouseEvent) {
					const pos = view.posAtCoords({
						left: event.clientX,
						top: event.clientY,
					});

					if (pos?.inside !== undefined && pos.inside >= 0) {
						const node = view.state.doc.nodeAt(pos.inside);
						if (!node) {
							return;
						}
						const resolvedPos = view.state.doc.resolve(pos.pos);
						const topLevelPos = resolvedPos.before(1); // 1 here restricts the depth to the root level
						const topLevelNode = view.state.doc.nodeAt(topLevelPos);
						if (!topLevelNode) {
							return;
						}
						const dom = view.nodeDOM(topLevelPos);
						if (!dom) {
							return;
						}
						api?.core?.actions.execute(({ tr }) =>
							tr.setMeta(key, {
								pos: topLevelPos,
								dom,
								type: topLevelNode.type.name,
							}),
						);
					}
				},
			},
		},
	});
};
