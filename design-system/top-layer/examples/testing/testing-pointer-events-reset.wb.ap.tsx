import { wb, type WorkbenchExample } from '@atlassian/workbench';

import TestingPointerEventsResetExample from '../157-testing-pointer-events-reset';

export const TestingPointerEventsReset: WorkbenchExample<typeof TestingPointerEventsResetExample> =
	wb(TestingPointerEventsResetExample);
