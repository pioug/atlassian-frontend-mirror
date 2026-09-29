import { wb, type WorkbenchExample } from '@atlassian/workbench';

import TestingArrowNavigationExample from '../140-testing-arrow-navigation';

export const TestingArrowNavigation: WorkbenchExample<typeof TestingArrowNavigationExample> = wb(
	TestingArrowNavigationExample,
);
