import { wb, type WorkbenchExample } from '@atlassian/workbench';

import { default as Example } from '../33-jira-clone-right-panel';

export const JiraCloneRightPanel: WorkbenchExample<typeof Example> = wb(Example);
