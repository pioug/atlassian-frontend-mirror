import { border } from '@atlaskit/adf-schema/border';

import type { BorderPlugin } from './borderPluginType';

export const borderPlugin: BorderPlugin = () => ({
	name: 'border',

	marks() {
		return [
			{
				name: 'border',
				mark: border,
			},
		];
	},
});
