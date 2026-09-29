import { wb, type WorkbenchExample } from '@atlassian/workbench';

import { default as Example } from '../1-full-page-editor-composable';

export const FullPageEditorComposable: WorkbenchExample<typeof Example> = wb(Example);
