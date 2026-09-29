import { wb, type WorkbenchExample } from '@atlassian/workbench';

import BasicTagExample from '../0-basic-tag';

export const BasicTag: WorkbenchExample<typeof BasicTagExample> = wb(BasicTagExample);
