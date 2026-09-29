import { wb, type WorkbenchExample } from '@atlassian/workbench';

import BasicEditorExample from '../00-basic-editor';

export const BasicEditor: WorkbenchExample<typeof BasicEditorExample> = wb(BasicEditorExample);
