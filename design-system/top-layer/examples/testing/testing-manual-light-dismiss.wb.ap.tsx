import { wb, type WorkbenchExample } from '@atlassian/workbench';

import TestingManualLightDismissExample from '../119-testing-manual-light-dismiss';

export const TestingManualLightDismiss: WorkbenchExample<typeof TestingManualLightDismissExample> =
	wb(TestingManualLightDismissExample);
