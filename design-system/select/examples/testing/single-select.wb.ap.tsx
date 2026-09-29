import { wb, type WorkbenchExample } from '@atlassian/workbench';

import SingleSelectExample from '../00-single-select.vr.ap';

export const SingleSelect: WorkbenchExample<typeof SingleSelectExample> = wb(SingleSelectExample);
