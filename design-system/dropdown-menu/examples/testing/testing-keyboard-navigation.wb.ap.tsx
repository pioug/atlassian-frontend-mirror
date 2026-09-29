import { wb, type WorkbenchExample } from '@atlassian/workbench';

import TestingKeyboardNavigationExample from '../92-testing-keyboard-navigation';

export const TestingKeyboardNavigation: WorkbenchExample<typeof TestingKeyboardNavigationExample> =
	wb(TestingKeyboardNavigationExample);
