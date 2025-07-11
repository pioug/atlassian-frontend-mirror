import { SafePlugin } from '@atlaskit/editor-common/safe-plugin';
import { PluginKey, type ReadonlyTransaction } from '@atlaskit/editor-prosemirror/state';
import { ReplaceAroundStep, ReplaceStep } from '@atlaskit/editor-prosemirror/transform';
import type { Step } from '@atlaskit/editor-prosemirror/transform';

import { type SelectionExtensionPluginState, SelectionExtensionActionTypes } from '../types';

export const selectionExtensionPluginKey = new PluginKey<SelectionExtensionPluginState>(
	'selectionExtensionPlugin',
);

export const createPlugin = () => {
	return new SafePlugin({
		key: selectionExtensionPluginKey,
		state: {
			init: () => {
				return {
					activeExtension: undefined,
				};
			},
			apply: (tr: ReadonlyTransaction, pluginState: SelectionExtensionPluginState) => {
				const meta = tr.getMeta(selectionExtensionPluginKey);

				switch (meta?.type) {
					case SelectionExtensionActionTypes.SET_ACTIVE_EXTENSION:
						return {
							...pluginState,
							activeExtension: meta.extension,
						};

					case SelectionExtensionActionTypes.CLEAR_ACTIVE_EXTENSION:
						return {
							...pluginState,
							activeExtension: undefined,
						};

					case SelectionExtensionActionTypes.SET_SELECTED_NODE:
						return {
							...pluginState,
							selectedNode: meta.selectedNode,
							nodePos: meta.nodePos,
							startTrackChanges: true,
							docChangedAfterClick: false, // Reset the flag when starting to track changes
						};

					case SelectionExtensionActionTypes.START_TRACK_CHANGES:
						return {
							...pluginState,
							startTrackChanges: meta.startTrackChanges,
						};
				}

				const docChangedAfterClick =
					pluginState.startTrackChanges &&
					tr.steps.some(
						(step: Step) => step instanceof ReplaceStep || step instanceof ReplaceAroundStep,
					);

				if (docChangedAfterClick) {
					return {
						...pluginState,
						docChangedAfterClick: true,
						startTrackChanges: false, // Reset the flag to stop tracking after the document has changed
					};
				}
				return pluginState;
			},
		},
	});
};
