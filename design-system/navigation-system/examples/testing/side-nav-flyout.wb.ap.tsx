import { wb, type WorkbenchExample } from '@atlassian/workbench';

import SideNavFlyoutExample from '../side-nav-flyout.vr.ap';

export const SideNavFlyout: WorkbenchExample<typeof SideNavFlyoutExample> =
	wb(SideNavFlyoutExample);
