import { fragment } from '@atlaskit/adf-schema';

import type { FragmentPlugin } from './fragmentPluginType';
import { createPlugin as createFragmentMarkConsistencyPlugin } from './pm-plugins/fragment-consistency';

export const fragmentPlugin: FragmentPlugin = () => ({
	name: 'fragmentPlugin',

	marks() {
		return [
			{
				name: 'fragment',
				mark: fragment,
			},
		];
	},

	pmPlugins() {
		return [
			{
				name: 'fragmentMarkConsistency',
				plugin: ({ dispatch }) => createFragmentMarkConsistencyPlugin(dispatch),
			},
		];
	},
});
