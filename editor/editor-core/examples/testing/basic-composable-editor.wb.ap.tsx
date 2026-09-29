import { wb, type WorkbenchExample } from '@atlassian/workbench';

import { default as Example } from '../1-basic-composable-editor';

export const BasicComposableEditor: WorkbenchExample<typeof Example> = wb(Example);
