import { wb, type WorkbenchExample } from '@atlassian/workbench';

import CustomThemeSpacingExample from '../custom-theme-spacing.wb.ap';

export const CustomThemeSpacing: WorkbenchExample<typeof CustomThemeSpacingExample> =
	wb(CustomThemeSpacingExample);
