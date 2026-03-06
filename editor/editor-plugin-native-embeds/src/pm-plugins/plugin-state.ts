import { SafePlugin } from '@atlaskit/editor-common/safe-plugin';
import { PluginKey } from '@atlaskit/editor-prosemirror/state';

export interface NativeEmbedsPluginState {
	showUrlToolbar: boolean;
}

type NativeEmbedsPluginAction = { type: 'SHOW_URL_TOOLBAR' } | { type: 'HIDE_URL_TOOLBAR' };

export const pluginKey = new PluginKey<NativeEmbedsPluginState>('nativeEmbedsPlugin');

export const createPlugin = () =>
	new SafePlugin<NativeEmbedsPluginState>({
		key: pluginKey,
		state: {
			init: (): NativeEmbedsPluginState => ({ showUrlToolbar: false }),
			apply: (tr, state): NativeEmbedsPluginState => {
				const meta = tr.getMeta(pluginKey) as NativeEmbedsPluginAction | undefined;
				if (meta?.type === 'SHOW_URL_TOOLBAR') {
					return { showUrlToolbar: true };
				}
				if (meta?.type === 'HIDE_URL_TOOLBAR') {
					return { showUrlToolbar: false };
				}
				return state;
			},
		},
	});
