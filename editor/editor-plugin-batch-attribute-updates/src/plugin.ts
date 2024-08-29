import { batchSteps } from './batch-steps-action';
import type { BatchAttributeUpdatesPlugin } from './types';

export const batchAttributeUpdatesPlugin: BatchAttributeUpdatesPlugin = () => {
	return {
		name: 'batchAttributeUpdates',
		actions: {
			batchSteps,
		},
	};
};
