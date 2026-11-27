import { wb, type WorkbenchExample } from '@atlassian/workbench';

import TestingDialogClosesNestedDialogsExample from '../179-testing-dialog-closes-nested-dialogs';

export const TestingDialogClosesNestedDialogs: WorkbenchExample<
	typeof TestingDialogClosesNestedDialogsExample
> = wb(TestingDialogClosesNestedDialogsExample);
