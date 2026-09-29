import { wb, type WorkbenchExample } from '@atlassian/workbench';

import MultipleInlineDialogsExample from '../08-multiple-inline-dialogs';

export const MultipleInlineDialogs: WorkbenchExample<typeof MultipleInlineDialogsExample> = wb(
	MultipleInlineDialogsExample,
);
