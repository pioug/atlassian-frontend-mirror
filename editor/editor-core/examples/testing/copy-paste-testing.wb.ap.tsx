import { wb, type WorkbenchExample } from '@atlassian/workbench';

import { default as Example } from '../99-copy-paste-testing';

export const CopyPasteTesting: WorkbenchExample<typeof Example> = wb(Example);
