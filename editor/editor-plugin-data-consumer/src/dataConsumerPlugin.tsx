import { dataConsumer } from '@atlaskit/adf-schema';

import type { DataConsumerPlugin } from './dataConsumerPluginType';

export const dataConsumerPlugin: DataConsumerPlugin = () => ({
	name: 'dataConsumer',

	marks() {
		return [
			{
				name: 'dataConsumer',
				mark: dataConsumer,
			},
		];
	},
});
