import { wb, type WorkbenchExample } from '@atlassian/workbench';

import Example from '../14-nested-headers-inside-expand';

export const NestedHeadersInsideExpand: WorkbenchExample<typeof Example> = wb(Example);
