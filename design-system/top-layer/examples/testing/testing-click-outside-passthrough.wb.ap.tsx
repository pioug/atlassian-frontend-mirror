import { wb, type WorkbenchExample } from '@atlassian/workbench';

import TestingClickOutsidePassthroughExample from '../138-testing-click-outside-passthrough';

export const TestingClickOutsidePassthrough: WorkbenchExample<
	typeof TestingClickOutsidePassthroughExample
> = wb(TestingClickOutsidePassthroughExample);
