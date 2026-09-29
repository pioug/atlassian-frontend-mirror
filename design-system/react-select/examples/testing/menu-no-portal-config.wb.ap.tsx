import { wb, type WorkbenchExample } from '@atlassian/workbench';

import MenuNoPortalConfigExample from '../34-menu-no-portal-config.vr.ap';

export const MenuNoPortalConfig: WorkbenchExample<typeof MenuNoPortalConfigExample> =
	wb(MenuNoPortalConfigExample);
