import { SafePlugin } from '@atlaskit/editor-common/safe-plugin';
import type { ReadonlyTransaction } from '@atlaskit/editor-prosemirror/state';

import { ACTION_CLOSE_POPUP, ACTION_OPEN_POPUP } from '../actions';
import type { MediaInsertPluginState } from '../types';

import { pluginKey } from './plugin-key';

export const createPlugin = (): SafePlugin<MediaInsertPluginState> => {
	return new SafePlugin({
		state: {
			init(): MediaInsertPluginState {
				return {
					isOpen: false,
				};
			},

			apply(tr: ReadonlyTransaction, mediaInsertPluginState: MediaInsertPluginState) {
				const meta = tr.getMeta(pluginKey);
				if (meta) {
					switch (meta.type) {
						case ACTION_OPEN_POPUP:
							return { isOpen: true };
						case ACTION_CLOSE_POPUP:
							return { isOpen: false };
						default:
							return mediaInsertPluginState;
					}
				} else {
					return mediaInsertPluginState;
				}
			},
		},
		key: pluginKey,
	});
};
