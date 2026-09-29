import { wb, type WorkbenchExample } from '@atlassian/workbench';

import TestingMenuPortalOverflowExample from '../testing-menu-portal-overflow';

export const TestingMenuPortalOverflow: WorkbenchExample<typeof TestingMenuPortalOverflowExample> =
	wb(TestingMenuPortalOverflowExample);
