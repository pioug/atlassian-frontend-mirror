import { wb, type WorkbenchExample } from '@atlassian/workbench';

import TestingPopoverEscapeExample from '../92-testing-popover-escape';

export const TestingPopoverEscape: WorkbenchExample<typeof TestingPopoverEscapeExample> = wb(
	TestingPopoverEscapeExample,
);
