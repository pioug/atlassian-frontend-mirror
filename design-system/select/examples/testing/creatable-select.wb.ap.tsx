import { wb, type WorkbenchExample } from '@atlassian/workbench';

import CreatableSelectExample from '../09-creatable-select';

export const CreatableSelect: WorkbenchExample<typeof CreatableSelectExample> =
	wb(CreatableSelectExample);
