import { wb, type WorkbenchExample } from '@atlassian/workbench';

import ScrollContainerExample from '../01-scroll-container';

export const ScrollContainer: WorkbenchExample<typeof ScrollContainerExample> =
	wb(ScrollContainerExample);
