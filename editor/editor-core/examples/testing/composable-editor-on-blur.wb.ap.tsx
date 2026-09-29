import { wb, type WorkbenchExample } from '@atlassian/workbench';

import { default as Example } from '../1-composable-editor-on-blur';

export const ComposableEditorOnBlur: WorkbenchExample<typeof Example> = wb(Example);
