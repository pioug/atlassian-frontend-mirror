import { wb, type WorkbenchExample } from '@atlassian/workbench';

import { default as BasicWithTransitionExample } from '../17-basic-with-transition';

export const BasicWithTransition: WorkbenchExample<typeof BasicWithTransitionExample> = wb(
	BasicWithTransitionExample,
);
