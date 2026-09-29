import { wb, type WorkbenchExample } from '@atlassian/workbench';

import NestedExample from '../nested';

export const Nested: WorkbenchExample<typeof NestedExample> = wb(NestedExample);
