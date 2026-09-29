import { wb, type WorkbenchExample } from '@atlassian/workbench';

import CustomTabComponentsExample from '../20-custom-tab-components';

export const CustomTabComponents: WorkbenchExample<typeof CustomTabComponentsExample> = wb(
	CustomTabComponentsExample,
);
