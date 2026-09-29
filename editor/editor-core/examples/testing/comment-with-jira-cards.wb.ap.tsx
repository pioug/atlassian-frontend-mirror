import { wb, type WorkbenchExample } from '@atlassian/workbench';

import { default as Example } from '../2-comment-with-jira-cards';

export const CommentWithJiraCards: WorkbenchExample<typeof Example> = wb(Example);
