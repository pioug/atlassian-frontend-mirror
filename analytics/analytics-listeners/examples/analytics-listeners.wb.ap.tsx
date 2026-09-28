import { wb, type WorkbenchExample } from '@atlassian/workbench';

import { default as Example00FabricListenerExampleSource } from './00-fabric-listener-example';
import { default as Example01ExcludingListenerSource } from './01-excluding-listener';
import { default as Example02LoggingLevelsSource } from './02-logging-levels';

export const Example00FabricListenerExample: WorkbenchExample<
	typeof Example00FabricListenerExampleSource
> = wb(Example00FabricListenerExampleSource);
export const Example01ExcludingListener: WorkbenchExample<typeof Example01ExcludingListenerSource> =
	wb(Example01ExcludingListenerSource);
export const Example02LoggingLevels: WorkbenchExample<typeof Example02LoggingLevelsSource> = wb(
	Example02LoggingLevelsSource,
);
