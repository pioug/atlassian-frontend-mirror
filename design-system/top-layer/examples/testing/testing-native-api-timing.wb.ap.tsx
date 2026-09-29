import { wb, type WorkbenchExample } from '@atlassian/workbench';

import TestingNativeApiTimingExample from '../150-testing-native-api-timing';

export const TestingNativeApiTiming: WorkbenchExample<typeof TestingNativeApiTimingExample> = wb(
	TestingNativeApiTimingExample,
);
