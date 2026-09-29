import { wb, type WorkbenchExample } from '@atlassian/workbench';

import CustomizablePageLayoutExample from '../00-customizable-page-layout';

export const CustomizablePageLayout: WorkbenchExample<typeof CustomizablePageLayoutExample> = wb(
	CustomizablePageLayoutExample,
);
