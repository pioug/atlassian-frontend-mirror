import { wb, type WorkbenchExample } from '@atlassian/workbench';

import { default as Example } from '../1-chromeless-editor-component-composable';

export const ChromelessEditorComponentComposable: WorkbenchExample<typeof Example> = wb(Example);
