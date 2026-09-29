import { wb, type WorkbenchExample } from '@atlassian/workbench';

import VcObserverMovingNodeExample from '../02-vc-observer-moving-node';

export const VcObserverMovingNode: WorkbenchExample<typeof VcObserverMovingNodeExample> = wb(
	VcObserverMovingNodeExample,
);
