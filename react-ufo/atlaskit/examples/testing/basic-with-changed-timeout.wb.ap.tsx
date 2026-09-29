import { wb, type WorkbenchExample } from '@atlassian/workbench';

import { default as BasicWithChangedTimeoutExample } from '../16-basic-with-changed-timeout';

export const BasicWithChangedTimeout: WorkbenchExample<typeof BasicWithChangedTimeoutExample> = wb(
	BasicWithChangedTimeoutExample,
);
