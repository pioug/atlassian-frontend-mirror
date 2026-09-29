import { wb, type WorkbenchExample } from '@atlassian/workbench';

import TestingKeyboardNavigationDisabledItemsExample from '../89-testing-keyboard-navigation-disabled-items';

export const TestingKeyboardNavigationDisabledItems: WorkbenchExample<
	typeof TestingKeyboardNavigationDisabledItemsExample
> = wb(TestingKeyboardNavigationDisabledItemsExample);
