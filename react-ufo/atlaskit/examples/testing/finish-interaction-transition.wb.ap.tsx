import { wb, type WorkbenchExample } from '@atlassian/workbench';

import { default as FinishInteractionTransitionExample } from '../34-finish-interaction-transition';

export const FinishInteractionTransition: WorkbenchExample<
	typeof FinishInteractionTransitionExample
> = wb(FinishInteractionTransitionExample);
