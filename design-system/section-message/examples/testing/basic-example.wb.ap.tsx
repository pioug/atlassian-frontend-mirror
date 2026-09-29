import { wb, type WorkbenchExample } from '@atlassian/workbench';

import BasicExampleExample from '../00-basic-example.vr.ap';

export const BasicExample: WorkbenchExample<typeof BasicExampleExample> = wb(BasicExampleExample);
