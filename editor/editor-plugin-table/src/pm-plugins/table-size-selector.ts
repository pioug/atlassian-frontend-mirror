import type { Dispatch } from '@atlaskit/editor-common/event-dispatcher';
import { SafePlugin } from '@atlaskit/editor-common/safe-plugin';
import { PluginKey } from '@atlaskit/editor-prosemirror/state';

type SizeSelectorPluginState = {
	isSelectorOpen: boolean;
	targetRef?: HTMLElement;
};

export const pluginKey = new PluginKey<SizeSelectorPluginState>('tableSizeSelectorPlugin');

export const createPlugin = (dispatch: Dispatch) => {
	return new SafePlugin<SizeSelectorPluginState>({
		key: pluginKey,
		state: {
			init: () => ({
				isSelectorOpen: false,
			}),
			// @ts-ignore - Workaround for help-center local consumption

			apply: (tr, currentPluginState) => {
				const meta = tr.getMeta(pluginKey);

				if (meta) {
					const keys = Object.keys(meta) as Array<keyof SizeSelectorPluginState>;
					// @ts-ignore - Workaround for help-center local consumption

					const changed = keys.some((key) => {
						return currentPluginState[key] !== meta[key];
					});

					if (changed) {
						const newState = { ...currentPluginState, ...meta };

						dispatch(pluginKey, newState);
						return newState;
					}
				}
				return currentPluginState;
			},
		},
	});
};
