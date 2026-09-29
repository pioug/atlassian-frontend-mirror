import { wb, type WorkbenchExample } from '@atlassian/workbench';

import AsyncCreatableSelectExample from '../08-async-creatable-select';

export const AsyncCreatableSelect: WorkbenchExample<typeof AsyncCreatableSelectExample> = wb(
	AsyncCreatableSelectExample,
);
