import { SafePlugin } from '@atlaskit/editor-common/safe-plugin';
import { PluginKey } from '@atlaskit/editor-prosemirror/state';

export const trackChangesPluginKey = new PluginKey('showDiffPlugin');

// eslint-disable-next-line @typescript-eslint/no-empty-object-type
type TrackChangesPluginState = {};

export const createTrackChangesPlugin = () => {
	return new SafePlugin<TrackChangesPluginState>({
		key: trackChangesPluginKey,
		state: {
			init() {
				return {};
			},
			apply: (tr, currentPluginState) => {
				const meta = tr.getMeta(trackChangesPluginKey);
				if (meta) {
					return meta;
				}
				return currentPluginState;
			},
		},
	});
};
