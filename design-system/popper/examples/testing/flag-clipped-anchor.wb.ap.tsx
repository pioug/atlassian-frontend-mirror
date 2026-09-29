import { wb, type WorkbenchExample } from '@atlassian/workbench';

import FlagClippedAnchorExample from '../13-flag-clipped-anchor';

export const FlagClippedAnchor: WorkbenchExample<typeof FlagClippedAnchorExample> =
	wb(FlagClippedAnchorExample);
