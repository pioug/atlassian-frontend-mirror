import { wb, type WorkbenchExample } from '@atlassian/workbench';

import TestingAnimationCallbacksExample from '../127-testing-animation-callbacks';

export const TestingAnimationCallbacks: WorkbenchExample<typeof TestingAnimationCallbacksExample> =
	wb(TestingAnimationCallbacksExample);
