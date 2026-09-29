import { wb, type WorkbenchExample } from '@atlassian/workbench';

import { default as Example } from '../1-composable-editor-custom-toolbar';

export const ComposableEditorCustomToolbar: WorkbenchExample<typeof Example> = wb(Example);
