import { wb, type WorkbenchExample } from '@atlassian/workbench';

import TopNavigationThemingExample from '../top-navigation-theming.vr.ap';

export const TopNavigationTheming: WorkbenchExample<typeof TopNavigationThemingExample> = wb(
	TopNavigationThemingExample,
);
