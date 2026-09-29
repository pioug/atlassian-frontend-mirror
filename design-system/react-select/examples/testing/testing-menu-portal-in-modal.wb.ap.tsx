import { wb, type WorkbenchExample } from '@atlassian/workbench';

import TestingMenuPortalInModalExample from '../testing-menu-portal-in-modal';

export const TestingMenuPortalInModal: WorkbenchExample<typeof TestingMenuPortalInModalExample> =
	wb(TestingMenuPortalInModalExample);
