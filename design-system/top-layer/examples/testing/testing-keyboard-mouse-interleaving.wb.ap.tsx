import { wb, type WorkbenchExample } from '@atlassian/workbench';

import TestingKeyboardMouseInterleavingExample from '../128-testing-keyboard-mouse-interleaving';

export const TestingKeyboardMouseInterleaving: WorkbenchExample<
	typeof TestingKeyboardMouseInterleavingExample
> = wb(TestingKeyboardMouseInterleavingExample);
