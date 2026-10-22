import { wb, type WorkbenchExample } from '@atlassian/workbench';

import TestingDialogEscapeRefusedExample from '../166-testing-dialog-escape-refused';

export const TestingDialogEscapeRefused: WorkbenchExample<
	typeof TestingDialogEscapeRefusedExample
> = wb(TestingDialogEscapeRefusedExample);
