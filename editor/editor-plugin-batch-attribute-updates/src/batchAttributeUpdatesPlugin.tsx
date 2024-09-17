import type { BatchAttributeUpdatesPlugin } from './batchAttributeUpdatesPluginType';
import { batchSteps } from './editor-actions/batch-steps-action';

export const batchAttributeUpdatesPlugin: BatchAttributeUpdatesPlugin = () => {
	return {
		name: 'batchAttributeUpdates',
		actions: {
			batchSteps,
		},
	};
};
