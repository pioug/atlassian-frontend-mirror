import { wb, type WorkbenchExample } from '@atlassian/workbench';

import JiraIntegrationExampleExample from '../00-jira-integration-example';

export const JiraIntegrationExample: WorkbenchExample<typeof JiraIntegrationExampleExample> = wb(
	JiraIntegrationExampleExample,
);
