import { wb, type WorkbenchExample } from '@atlassian/workbench';

import FlagAnchorToggleExample from '../10-flag-anchor-toggle';

export const FlagAnchorToggle: WorkbenchExample<typeof FlagAnchorToggleExample> =
	wb(FlagAnchorToggleExample);
