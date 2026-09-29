import { wb, type WorkbenchExample } from '@atlassian/workbench';

import TestingPopoverFocusHandoffExample from '../165-testing-popover-focus-handoff';

export const TestingPopoverFocusHandoff: WorkbenchExample<
	typeof TestingPopoverFocusHandoffExample
> = wb(TestingPopoverFocusHandoffExample);
