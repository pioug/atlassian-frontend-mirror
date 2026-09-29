import { wb, type WorkbenchExample } from '@atlassian/workbench';

import { default as Example } from '../2-comment-confluence';

export const CommentConfluence: WorkbenchExample<typeof Example> = wb(Example);
