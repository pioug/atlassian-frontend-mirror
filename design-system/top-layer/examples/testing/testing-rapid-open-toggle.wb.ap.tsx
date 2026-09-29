import { wb, type WorkbenchExample } from '@atlassian/workbench';

import TestingRapidOpenToggleExample from '../131-testing-rapid-open-toggle';

export const TestingRapidOpenToggle: WorkbenchExample<typeof TestingRapidOpenToggleExample> = wb(
	TestingRapidOpenToggleExample,
);
