import { wb, type WorkbenchExample } from '@atlassian/workbench';

import { default as Example } from '../6-copy-paste';

export const CopyPaste: WorkbenchExample<typeof Example> = wb(Example);
