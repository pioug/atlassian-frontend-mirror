import { wb, type WorkbenchExample } from '@atlassian/workbench';

import TestingDialogSsrInitialOpenExample from '../151-testing-dialog-ssr-initial-open.vr.ap';

export const TestingDialogSsrInitialOpen: WorkbenchExample<
	typeof TestingDialogSsrInitialOpenExample
> = wb(TestingDialogSsrInitialOpenExample);
