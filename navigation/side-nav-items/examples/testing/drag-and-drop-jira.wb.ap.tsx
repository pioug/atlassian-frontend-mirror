import { wb, type WorkbenchExample } from '@atlassian/workbench';

import DragAndDropJiraExample from '../drag-and-drop-jira';

export const DragAndDropJira: WorkbenchExample<typeof DragAndDropJiraExample> =
	wb(DragAndDropJiraExample);
