import { PluginKey } from '@atlaskit/editor-prosemirror/state';

import { SafePlugin } from '../../../safe-plugin';
import type { EditorAppearance } from '../../../types';

type AppearancePluginState = {
	appearance: EditorAppearance | undefined;
};

export const appearancePluginKey: PluginKey<AppearancePluginState> =
	new PluginKey<AppearancePluginState>('appearancePlugin');

const DEFAULT_APPEARANCE: EditorAppearance = 'comment';

// eslint-disable-next-line @atlaskit/volt-strict-mode/no-multiple-exports
export function createAppearancePlugin(
	initialAppearance: EditorAppearance | undefined,
): SafePlugin<AppearancePluginState> {
	return new SafePlugin<AppearancePluginState>({
		key: appearancePluginKey,
		state: {
			init: () => ({
				appearance: initialAppearance ?? DEFAULT_APPEARANCE,
			}),
			apply: (tr, pluginState) => {
				const meta = tr.getMeta(appearancePluginKey);
				if (meta?.appearance !== undefined) {
					return { ...pluginState, appearance: meta.appearance };
				}
				return pluginState;
			},
		},
	});
}
