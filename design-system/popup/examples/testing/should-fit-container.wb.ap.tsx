import { wb, type WorkbenchExample } from '@atlassian/workbench';

import ShouldFitContainerExample from '../18-should-fit-container.vr.ap';

export const ShouldFitContainer: WorkbenchExample<typeof ShouldFitContainerExample> =
	wb(ShouldFitContainerExample);
