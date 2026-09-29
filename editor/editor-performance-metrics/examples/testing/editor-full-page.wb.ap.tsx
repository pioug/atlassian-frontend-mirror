import { wb, type WorkbenchExample } from '@atlassian/workbench';

import EditorFullPageExample from '../05-editor-full-page';

export const EditorFullPage: WorkbenchExample<typeof EditorFullPageExample> =
	wb(EditorFullPageExample);
