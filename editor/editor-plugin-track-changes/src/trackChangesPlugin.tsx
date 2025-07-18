import type { EditorState, Transaction } from '@atlaskit/editor-prosemirror/state';

import { createTrackChangesPlugin, trackChangesPluginKey } from './pm-plugins/main';
import { TOGGLE_TRACK_CHANGES_ACTION as ACTION } from './pm-plugins/types';
import type { TrackChangesPlugin } from './trackChangesPluginType';

export const trackChangesPlugin: TrackChangesPlugin = () => ({
	name: 'trackChanges',
	pmPlugins() {
		return [
			{
				name: 'trackChangesPlugin',
				plugin: createTrackChangesPlugin,
			},
		];
	},
	commands: {
		toggleChanges: ({ tr }: { tr: Transaction }) => {
			return tr.setMeta(trackChangesPluginKey, {
				action: ACTION.TOGGLE_TRACK_CHANGES,
			});
		},
	},
	getSharedState: (editorState: EditorState | undefined) => {
		if (!editorState) {
			return {
				isDisplayingChanges: false,
			};
		}
		return {
			isDisplayingChanges: Boolean(
				trackChangesPluginKey.getState(editorState)?.shouldChangesBeDispalyed,
			),
		};
	},
});
