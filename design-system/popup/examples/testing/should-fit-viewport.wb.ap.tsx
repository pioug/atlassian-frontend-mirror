import { wb, type WorkbenchExample } from '@atlassian/workbench';

import ShouldFitViewportExample from '../should-fit-viewport';

export const ShouldFitViewport: WorkbenchExample<typeof ShouldFitViewportExample> =
	wb(ShouldFitViewportExample);
