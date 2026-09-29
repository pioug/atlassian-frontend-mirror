import { wb, type WorkbenchExample } from '@atlassian/workbench';

import SideNavLayeringExample from '../side-nav-layering.vr.ap';

export const SideNavLayering: WorkbenchExample<typeof SideNavLayeringExample> =
	wb(SideNavLayeringExample);
