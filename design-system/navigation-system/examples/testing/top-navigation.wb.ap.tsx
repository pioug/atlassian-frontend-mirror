import { wb, type WorkbenchExample } from '@atlassian/workbench';

import TopNavigationExample from '../top-navigation.vr.ap';

export const TopNavigation: WorkbenchExample<typeof TopNavigationExample> =
	wb(TopNavigationExample);
