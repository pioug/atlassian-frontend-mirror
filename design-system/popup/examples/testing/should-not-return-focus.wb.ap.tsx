import { wb, type WorkbenchExample } from '@atlassian/workbench';

import ShouldNotReturnFocusExample from '../should-not-return-focus';

export const ShouldNotReturnFocus: WorkbenchExample<typeof ShouldNotReturnFocusExample> = wb(
	ShouldNotReturnFocusExample,
);
