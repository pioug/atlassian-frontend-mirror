import { wb, type WorkbenchExample } from '@atlassian/workbench';

import TestingManualFocusRestoreTargetExample from '../168-testing-manual-focus-restore-target';

export const TestingManualFocusRestoreTarget: WorkbenchExample<
	typeof TestingManualFocusRestoreTargetExample
> = wb(TestingManualFocusRestoreTargetExample);
