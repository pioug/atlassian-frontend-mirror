import { wb, type WorkbenchExample } from '@atlassian/workbench';

import { default as InteractionsSimpleButtonExample } from '../23-interactions-simple-button';

export const InteractionsSimpleButton: WorkbenchExample<typeof InteractionsSimpleButtonExample> =
	wb(InteractionsSimpleButtonExample);
