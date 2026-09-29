import { wb, type WorkbenchExample } from '@atlassian/workbench';

import Example from '../16-truncated-custom-height';

export const TruncatedCustomHeight: WorkbenchExample<typeof Example> = wb(Example);
