import { wb, type WorkbenchExample } from '@atlassian/workbench';

import { default as Example } from '../2-comment-jira-bento';

export const CommentJiraBento: WorkbenchExample<typeof Example> = wb(Example);
