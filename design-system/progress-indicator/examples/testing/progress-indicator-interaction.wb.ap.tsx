import { wb, type WorkbenchExample } from '@atlassian/workbench';

import ProgressIndicatorInteractionExample from '../progress-indicator-interaction';

export const ProgressIndicatorInteraction: WorkbenchExample<
	typeof ProgressIndicatorInteractionExample
> = wb(ProgressIndicatorInteractionExample);
