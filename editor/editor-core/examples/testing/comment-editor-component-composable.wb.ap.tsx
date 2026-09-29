import { wb, type WorkbenchExample } from '@atlassian/workbench';

import { default as Example } from '../1-comment-editor-component-composable';

export const CommentEditorComponentComposable: WorkbenchExample<typeof Example> = wb(Example);
