import { wb, type WorkbenchExample } from '@atlassian/workbench';

import IntegrationExampleExample from '../03-integration-example';

export const IntegrationExample: WorkbenchExample<typeof IntegrationExampleExample> =
	wb(IntegrationExampleExample);
