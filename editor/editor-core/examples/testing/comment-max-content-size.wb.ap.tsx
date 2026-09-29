import { wb, type WorkbenchExample } from '@atlassian/workbench';

import { default as Example } from '../2-comment-max-content-size';

export const CommentMaxContentSize: WorkbenchExample<typeof Example> = wb(Example);
