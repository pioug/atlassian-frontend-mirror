import type { TransactionTracker } from '../utils/performance/track-transactions';

import type { EditorConfig } from './editor-config';
import type { PerformanceTracking } from './performance-tracking';
import type { PMPluginFactoryParams } from './pm-plugin';

export type PMPluginCreateConfig = PMPluginFactoryParams & {
	editorConfig: EditorConfig;
	performanceTracking?: PerformanceTracking;
	transactionTracker?: TransactionTracker;
};
