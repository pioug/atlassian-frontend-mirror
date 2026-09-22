import { wb, type WorkbenchExample } from '@atlassian/workbench';

import { default as Example00FabricListenerExampleSource } from './00-fabric-listener-example';
import { default as Example01ExcludingListenerSource } from './01-excluding-listener';
import { default as Example02LoggingLevelsSource } from './02-logging-levels';

export const Example00FabricListenerExample: WorkbenchExample = wb(
	Example00FabricListenerExampleSource,
);
export const Example01ExcludingListener: WorkbenchExample = wb(Example01ExcludingListenerSource);
export const Example02LoggingLevels: WorkbenchExample = wb(Example02LoggingLevelsSource);
