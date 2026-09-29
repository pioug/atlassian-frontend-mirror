import { wb, type WorkbenchExample } from '@atlassian/workbench';

import { default as Example } from '../1-labs-async-collapsed-editor';

export const LabsAsyncCollapsedEditor: WorkbenchExample<typeof Example> = wb(Example);
