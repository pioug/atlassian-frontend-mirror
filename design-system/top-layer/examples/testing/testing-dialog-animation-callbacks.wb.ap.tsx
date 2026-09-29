import { wb, type WorkbenchExample } from '@atlassian/workbench';

import TestingDialogAnimationCallbacksExample from '../testing-dialog-animation-callbacks';

export const TestingDialogAnimationCallbacks: WorkbenchExample<
	typeof TestingDialogAnimationCallbacksExample
> = wb(TestingDialogAnimationCallbacksExample);
