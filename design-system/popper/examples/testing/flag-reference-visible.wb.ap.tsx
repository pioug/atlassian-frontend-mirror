import { wb, type WorkbenchExample } from '@atlassian/workbench';

import FlagReferenceVisibleExample from '../05-flag-reference-visible';

export const FlagReferenceVisible: WorkbenchExample<typeof FlagReferenceVisibleExample> = wb(
	FlagReferenceVisibleExample,
);
