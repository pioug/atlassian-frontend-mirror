import { bind, type UnbindFn } from 'bind-event-listener';

import { SafePlugin } from '@atlaskit/editor-common/safe-plugin';
import { PluginKey } from '@atlaskit/editor-prosemirror/state';
import type { EditorState, ReadonlyTransaction } from '@atlaskit/editor-prosemirror/state';
import type { EditorView } from '@atlaskit/editor-prosemirror/view';
import { editorExperiment } from '@atlaskit/tmp-editor-statsig/experiments';

import { handleKeyDown } from './handle-key-down';
import { handleMouseEnter, handleMouseLeave, handleMouseMove } from './handle-mouse-move';

export type InteractionTrackingPluginState = {
	/**
	 * Tracks if a users intention is to edit the document (e.g. typing, deleting, etc.)
	 */
	isEditing: boolean;
	/**
	 * Tracks if the mouse is outside of the editor
	 */
	isMouseOut?: boolean;
};

export const interactionTrackingPluginKey = new PluginKey<InteractionTrackingPluginState>(
	'interactionTrackingPlugin',
);

type StartEditingMeta = {
	type: 'startEditing';
};

type StopEditingMeta = {
	type: 'stopEditing';
};

type MouseLeaveMeta = {
	type: 'mouseLeave';
};

type MouseEnterMeta = {
	type: 'mouseEnter';
};

type InteractionTrackingMeta = StartEditingMeta | StopEditingMeta | MouseLeaveMeta | MouseEnterMeta;

export const createInteractionTrackingPlugin = () => {
	return new SafePlugin<InteractionTrackingPluginState>({
		key: interactionTrackingPluginKey,
		state: {
			init() {
				const state: InteractionTrackingPluginState = {
					isEditing: false,
				};

				if (editorExperiment('platform_editor_controls', 'variant1')) {
					state.isMouseOut = false;
				}

				return state;
			},

			apply(
				tr: ReadonlyTransaction,
				pluginState: InteractionTrackingPluginState,
			): InteractionTrackingPluginState {
				const meta = tr.getMeta(interactionTrackingPluginKey) as
					| InteractionTrackingMeta
					| undefined;

				const newState: Partial<InteractionTrackingPluginState> = {};
				switch (meta?.type) {
					case 'startEditing':
						newState.isEditing = true;
						break;
					case 'stopEditing':
						newState.isEditing = false;
						break;
					case 'mouseLeave':
						newState.isMouseOut = true;
						break;
					case 'mouseEnter':
						newState.isMouseOut = false;
						break;
				}

				return { ...pluginState, ...newState };
			},
		},

		props: {
			handleKeyDown,
			handleDOMEvents: {
				mousemove: handleMouseMove,
			},
		},

		view: editorExperiment('platform_editor_controls', 'variant1')
			? (view: EditorView) => {
					const editorContentArea = view.dom.closest('.ak-editor-content-area');

					let unbindMouseEnter: UnbindFn;
					let unbindMouseLeave: UnbindFn;

					if (editorContentArea) {
						unbindMouseEnter = bind(editorContentArea, {
							type: 'mouseenter',
							listener: () => {
								handleMouseEnter(view);
							},
						});

						unbindMouseLeave = bind(editorContentArea, {
							type: 'mouseleave',
							listener: () => {
								handleMouseLeave(view);
							},
						});
					}

					return {
						destroy: () => {
							unbindMouseEnter?.();
							unbindMouseLeave?.();
						},
					};
				}
			: undefined,
	});
};

export const getInteractionTrackingState = (state: EditorState) => {
	return interactionTrackingPluginKey.getState(state);
};
