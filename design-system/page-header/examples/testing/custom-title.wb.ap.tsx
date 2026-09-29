import { wb, type WorkbenchExample } from '@atlassian/workbench';

import CustomTitleExample from '../03-custom-title';

export const CustomTitle: WorkbenchExample<typeof CustomTitleExample> = wb(CustomTitleExample);
