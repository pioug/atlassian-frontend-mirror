import { wb, type WorkbenchExample } from '@atlassian/workbench';

import { default as Example } from '../2-comment-bitbucket';

export const CommentBitbucket: WorkbenchExample<typeof Example> = wb(Example);
