import { wb, type WorkbenchExample } from '@atlassian/workbench';

import TestingNestedDialogEscapeExample from '../152-testing-nested-dialog-escape';

export const TestingNestedDialogEscape: WorkbenchExample<typeof TestingNestedDialogEscapeExample> =
	wb(TestingNestedDialogEscapeExample);
