import { wb, type WorkbenchExample } from '@atlassian/workbench';

import PersistentInlineMenuExample from '../36-persistent-inline-menu';

export const PersistentInlineMenu: WorkbenchExample<typeof PersistentInlineMenuExample> = wb(
	PersistentInlineMenuExample,
);
