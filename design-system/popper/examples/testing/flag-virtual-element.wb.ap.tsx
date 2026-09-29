import { wb, type WorkbenchExample } from '@atlassian/workbench';

import FlagVirtualElementExample from '../09-flag-virtual-element';

export const FlagVirtualElement: WorkbenchExample<typeof FlagVirtualElementExample> =
	wb(FlagVirtualElementExample);
