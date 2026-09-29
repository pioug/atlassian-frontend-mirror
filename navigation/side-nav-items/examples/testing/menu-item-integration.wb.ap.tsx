import { wb, type WorkbenchExample } from '@atlassian/workbench';

import MenuItemIntegrationExample from '../menu-item-integration';

export const MenuItemIntegration: WorkbenchExample<typeof MenuItemIntegrationExample> = wb(
	MenuItemIntegrationExample,
);
