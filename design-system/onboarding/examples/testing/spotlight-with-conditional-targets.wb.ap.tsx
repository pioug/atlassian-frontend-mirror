import { wb, type WorkbenchExample } from '@atlassian/workbench';

import SpotlightWithConditionalTargetsExample from '../102-spotlight-with-conditional-targets';

export const SpotlightWithConditionalTargets: WorkbenchExample<
	typeof SpotlightWithConditionalTargetsExample
> = wb(SpotlightWithConditionalTargetsExample);
