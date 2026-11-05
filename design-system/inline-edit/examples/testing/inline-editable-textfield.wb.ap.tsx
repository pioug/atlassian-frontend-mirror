import { wb, type WorkbenchExample } from '@atlassian/workbench';

import InlineEditableTextfieldExample from '../04-inline-editable-textfield';

export const InlineEditableTextfield: WorkbenchExample<typeof InlineEditableTextfieldExample> = wb(
	InlineEditableTextfieldExample,
);
