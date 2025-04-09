import { SafePlugin } from '@atlaskit/editor-common/safe-plugin';
import { PluginKey } from '@atlaskit/editor-prosemirror/state';
import type { EditorState, ReadonlyTransaction } from '@atlaskit/editor-prosemirror/state';

import { handleKeyDown } from './handle-key-down';
import { handleMouseMove } from './handle-mouse-move';

export type InteractionTrackingPluginState = {
	/**
	 * Tracks if a users intention is to edit the document (e.g. typing, deleting, etc.)
	 */
	isEditing: boolean;
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

type InteractionTrackingMeta = StartEditingMeta | StopEditingMeta;

export const createInteractionTrackingPlugin = () => {
	return new SafePlugin<InteractionTrackingPluginState>({
		key: interactionTrackingPluginKey,
		state: {
			init() {
				return {
					isEditing: false,
				};
			},

			apply(tr: ReadonlyTransaction, pluginState: InteractionTrackingPluginState) {
				const meta = tr.getMeta(interactionTrackingPluginKey) as
					| InteractionTrackingMeta
					| undefined;

				switch (meta?.type) {
					case 'startEditing':
						return {
							isEditing: true,
						};
					case 'stopEditing':
						return {
							isEditing: false,
						};
				}

				return pluginState;
			},
		},

		props: {
			handleKeyDown,
			handleDOMEvents: {
				mousemove: handleMouseMove,
			},
		},
	});
};

export const getInteractionTrackingState = (state: EditorState) => {
	return interactionTrackingPluginKey.getState(state);
};
