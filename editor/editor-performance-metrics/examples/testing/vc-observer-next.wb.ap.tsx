import { wb, type WorkbenchExample } from '@atlassian/workbench';

import VcObserverNextExample from '../01-vc-observer-next';

export const VcObserverNext: WorkbenchExample<typeof VcObserverNextExample> =
	wb(VcObserverNextExample);
