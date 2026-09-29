import { wb, type WorkbenchExample } from '@atlassian/workbench';

import NestingExample from '../nesting';

export const Nesting: WorkbenchExample<typeof NestingExample> = wb(NestingExample);
