import { wb, type WorkbenchExample } from '@atlassian/workbench';

import InlineMenuCustomMenuExample from '../37-inline-menu-custom-menu.vr.ap';

export const InlineMenuCustomMenu: WorkbenchExample<typeof InlineMenuCustomMenuExample> = wb(
	InlineMenuCustomMenuExample,
);
