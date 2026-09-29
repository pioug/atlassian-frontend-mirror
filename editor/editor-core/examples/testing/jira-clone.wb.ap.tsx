import { wb, type WorkbenchExample } from '@atlassian/workbench';

import { default as Example } from '../30-jira-clone';

export const JiraClone: WorkbenchExample<typeof Example> = wb(Example);
