import { wb, type WorkbenchExample } from '@atlassian/workbench';

import TestingManualLightDismissFocusExample from '../testing-manual-light-dismiss-focus';

export const TestingManualLightDismissFocus: WorkbenchExample<
	typeof TestingManualLightDismissFocusExample
> = wb(TestingManualLightDismissFocusExample);
