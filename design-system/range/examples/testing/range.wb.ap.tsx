import { wb, type WorkbenchExample } from '@atlassian/workbench';

import BasicExampleUncontrolledExample from '../00-basic-example-uncontrolled.vr.ap';

export const BasicExampleUncontrolled: WorkbenchExample<typeof BasicExampleUncontrolledExample> =
	wb(BasicExampleUncontrolledExample);
