import { wb, type WorkbenchExample } from '@atlassian/workbench';

import { default as LegacyVarTestingExample } from '../legacy-var-testing';

export const LegacyVarTesting: WorkbenchExample<typeof LegacyVarTestingExample> =
	wb(LegacyVarTestingExample);
