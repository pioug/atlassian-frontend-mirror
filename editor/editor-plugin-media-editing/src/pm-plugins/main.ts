import { SafePlugin } from '@atlaskit/editor-common/safe-plugin';
import { PluginKey } from '@atlaskit/editor-prosemirror/state';

import { ACTIONS } from './actions';
import type { MediaEditingPluginState } from './types';

export const mediaEditingPluginKey = new PluginKey<MediaEditingPluginState>('mediaEditingPlugin');

export const createPlugin = () => {
	return new SafePlugin<MediaEditingPluginState>({
		key: mediaEditingPluginKey,
		state: {
			init() {
				return {};
			},
			apply: (tr, currentPluginState) => {
				const meta = tr.getMeta(mediaEditingPluginKey);

				switch (meta?.type) {
					case ACTIONS.SHOW_IMAGE_EDITOR:
						return {
							...currentPluginState,
							imageEditorSelectedMedia: meta.imageEditorSelectedMedia,
							isImageEditorVisible: meta.isImageEditorVisible,
						};
					case ACTIONS.HIDE_IMAGE_EDITOR:
						return {
							...currentPluginState,
							imageEditorSelectedMedia: undefined,
							isImageEditorVisible: meta.isImageEditorVisible,
						};
					default:
						return currentPluginState;
				}
			},
		},
	});
};
