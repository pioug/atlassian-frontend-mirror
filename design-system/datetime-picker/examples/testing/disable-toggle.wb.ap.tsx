import { wb, type WorkbenchExample } from '@atlassian/workbench';

import DisableToggleExample from '../999-disable-toggle';

export const DisableToggle: WorkbenchExample<typeof DisableToggleExample> =
	wb(DisableToggleExample);
