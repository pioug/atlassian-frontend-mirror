import { wb, type WorkbenchExample } from '@atlassian/workbench';

import TestingNativeFocusRestorationExample from '../132-testing-native-focus-restoration';

export const TestingNativeFocusRestoration: WorkbenchExample<
	typeof TestingNativeFocusRestorationExample
> = wb(TestingNativeFocusRestorationExample);
