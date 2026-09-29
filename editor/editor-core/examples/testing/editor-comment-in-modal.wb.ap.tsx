import { wb, type WorkbenchExample } from '@atlassian/workbench';

import { default as Example } from '../999-editor-comment-in-modal';

export const EditorCommentInModal: WorkbenchExample<typeof Example> = wb(Example);
