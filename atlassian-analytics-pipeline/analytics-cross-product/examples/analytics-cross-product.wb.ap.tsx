import { wb, type WorkbenchExample } from '@atlassian/workbench';
import { default as BasicExample } from './basic';
import { default as BridgeInitialisedBeforeAnalyticsExample } from './bridge-initialised-before-analytics';

export const Basic: WorkbenchExample = wb(BasicExample);
export const BridgeInitialisedBeforeAnalytics: WorkbenchExample = wb(
	BridgeInitialisedBeforeAnalyticsExample,
);
