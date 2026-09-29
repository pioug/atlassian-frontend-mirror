import { wb, type WorkbenchExample } from '@atlassian/workbench';

import TestingSimpleLightDismissExample from '../119-testing-simple-light-dismiss';

export const TestingSimpleLightDismiss: WorkbenchExample<typeof TestingSimpleLightDismissExample> =
	wb(TestingSimpleLightDismissExample);
