import { wb, type WorkbenchExample } from '@atlassian/workbench';

import { default as Example } from '../2-comment-with-resizing';

export const CommentWithResizing: WorkbenchExample<typeof Example> = wb(Example);
