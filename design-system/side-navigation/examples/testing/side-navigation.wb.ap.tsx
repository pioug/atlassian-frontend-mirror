import { wb, type WorkbenchExample } from '@atlassian/workbench';

import NestedSideNavigationExample from '../00-nested-side-navigation.vr.ap';

export const NestedSideNavigation: WorkbenchExample<typeof NestedSideNavigationExample> = wb(
	NestedSideNavigationExample,
);
