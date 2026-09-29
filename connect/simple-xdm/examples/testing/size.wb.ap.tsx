import { wb, type WorkbenchExample } from '@atlassian/workbench';

import SizeExample from '../size';

export const Size: WorkbenchExample<typeof SizeExample> = wb(SizeExample);
