import { wb, type WorkbenchExample } from '@atlassian/workbench';

import MenuItemScrollIntoViewExample from '../menu-item-scroll-into-view.vr.ap';

export const MenuItemScrollIntoView: WorkbenchExample<typeof MenuItemScrollIntoViewExample> = wb(
	MenuItemScrollIntoViewExample,
);
