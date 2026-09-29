import { wb, type WorkbenchExample } from '@atlassian/workbench';

import TestingPopoverAnimationExample from '../115-testing-popover-animation';

export const TestingPopoverAnimation: WorkbenchExample<typeof TestingPopoverAnimationExample> = wb(
	TestingPopoverAnimationExample,
);
