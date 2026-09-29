import { wb, type WorkbenchExample } from '@atlassian/workbench';

import { default as DragAndDropInTheSidebarFlyoutExample } from '../drag-and-drop-in-the-sidebar-flyout';

export const DragAndDropInTheSidebarFlyout: WorkbenchExample<
	typeof DragAndDropInTheSidebarFlyoutExample
> = wb(DragAndDropInTheSidebarFlyoutExample);
