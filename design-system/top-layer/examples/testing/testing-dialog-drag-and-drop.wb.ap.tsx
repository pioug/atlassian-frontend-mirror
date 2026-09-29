import { wb, type WorkbenchExample } from '@atlassian/workbench';

import TestingDialogDragAndDropExample from '../159-testing-dialog-drag-and-drop';

export const TestingDialogDragAndDrop: WorkbenchExample<typeof TestingDialogDragAndDropExample> =
	wb(TestingDialogDragAndDropExample);
