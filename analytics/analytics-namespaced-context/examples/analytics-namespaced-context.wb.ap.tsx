import { wb, type WorkbenchExample } from '@atlassian/workbench';

import { default as Example00FabricElementsAnalyticsContextSource } from './00-fabric-elements-analytics-context';
import { default as Example01NavigationAnalyticsContextSource } from './01-navigation-analytics-context';

export const Example00FabricElementsAnalyticsContext: WorkbenchExample = wb(
	Example00FabricElementsAnalyticsContextSource,
);
export const Example01NavigationAnalyticsContext: WorkbenchExample = wb(
	Example01NavigationAnalyticsContextSource,
);
