import type { Transaction } from '@atlaskit/editor-prosemirror/state';

import { createTrackChangesPlugin } from './pm-plugins/main';
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
		setBaseline: ({ tr }: { tr: Transaction }) => {
			return tr.setMeta('setBaseline', true);
		},
	},
});
