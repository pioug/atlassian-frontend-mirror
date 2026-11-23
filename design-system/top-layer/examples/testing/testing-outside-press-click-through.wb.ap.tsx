import { wb, type WorkbenchExample } from '@atlassian/workbench';

import TestingOutsidePressClickThroughExample from '../174-testing-outside-press-click-through';

export const TestingOutsidePressClickThrough: WorkbenchExample<
	typeof TestingOutsidePressClickThroughExample
> = wb(TestingOutsidePressClickThroughExample);
