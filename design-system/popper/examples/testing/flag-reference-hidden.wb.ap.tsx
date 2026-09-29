import { wb, type WorkbenchExample } from '@atlassian/workbench';

import FlagReferenceHiddenExample from '../04-flag-reference-hidden';

export const FlagReferenceHidden: WorkbenchExample<typeof FlagReferenceHiddenExample> = wb(
	FlagReferenceHiddenExample,
);
