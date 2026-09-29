import { wb, type WorkbenchExample } from '@atlassian/workbench';

import TestingPopoverScrollExample from '../117-testing-popover-scroll';

export const TestingPopoverScroll: WorkbenchExample<typeof TestingPopoverScrollExample> = wb(
	TestingPopoverScrollExample,
);
