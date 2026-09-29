import { wb, type WorkbenchExample } from '@atlassian/workbench';

import MultiSelectExample from '../01-multi-select';

export const MultiSelect: WorkbenchExample<typeof MultiSelectExample> = wb(MultiSelectExample);
