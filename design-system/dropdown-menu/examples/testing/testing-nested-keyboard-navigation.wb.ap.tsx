import { wb, type WorkbenchExample } from '@atlassian/workbench';

import TestingNestedKeyboardNavigationExample from '../91-testing-nested-keyboard-navigation';

export const TestingNestedKeyboardNavigation: WorkbenchExample<
	typeof TestingNestedKeyboardNavigationExample
> = wb(TestingNestedKeyboardNavigationExample);
