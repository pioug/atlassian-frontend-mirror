import { TransactionTracker } from '../utils/performance/track-transactions';
import { EditorConfig } from './editor-config';
import { PerformanceTracking } from './performance-tracking';
import { PMPluginFactoryParams } from './pm-plugin';

export type PMPluginCreateConfig = PMPluginFactoryParams & {
  editorConfig: EditorConfig;
  performanceTracking?: PerformanceTracking;
  transactionTracker?: TransactionTracker;
};
