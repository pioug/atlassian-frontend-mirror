import { wb, type WorkbenchExample } from '@atlassian/workbench';

import FlagsProviderHideFlagExample from '../21-flags-provider-hide-flag';

export const FlagsProviderHideFlag: WorkbenchExample<typeof FlagsProviderHideFlagExample> = wb(
	FlagsProviderHideFlagExample,
);
