import type { EditorDisabledPluginState } from '../editorDisabledPluginType';

export enum ACTION {
	TOGGLE_DISABLED = 'TOGGLE_DISABLED',
}

type ToggleDisabledMeta = {
	action: ACTION.TOGGLE_DISABLED;
	disabled: boolean;
};

export function reducer(
	pluginState: EditorDisabledPluginState,
	meta: ToggleDisabledMeta | EditorDisabledPluginState,
): EditorDisabledPluginState {
	if (meta && 'action' in meta) {
		switch (meta.action) {
			case ACTION.TOGGLE_DISABLED:
				if (meta.disabled === pluginState.disabledByPlugin) {
					return pluginState;
				}
				return {
					...pluginState,
					disabledByPlugin: Boolean(meta.disabled),
				};
			default:
				return pluginState;
		}
	}

	return pluginState;
}
