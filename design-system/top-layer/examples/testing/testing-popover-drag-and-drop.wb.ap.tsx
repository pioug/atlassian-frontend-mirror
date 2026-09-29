import { wb, type WorkbenchExample } from '@atlassian/workbench';

import TestingPopoverDragAndDropExample from '../158-testing-popover-drag-and-drop';

export const TestingPopoverDragAndDrop: WorkbenchExample<typeof TestingPopoverDragAndDropExample> =
	wb(TestingPopoverDragAndDropExample);
