import { wb, type WorkbenchExample } from '@atlassian/workbench';

import VrBlockCardResolvedIconVariationsExample from './vr-block-card-resolved-icon-variations.vr.ap';
import VrBlockCardResolvedRovoActionsExample from './vr-block-card-resolved-rovo-actions.vr.ap';

export const VrBlockCardResolvedIconVariations: WorkbenchExample<
	typeof VrBlockCardResolvedIconVariationsExample
> = wb(VrBlockCardResolvedIconVariationsExample);
export const VrBlockCardResolvedRovoActions: WorkbenchExample<
	typeof VrBlockCardResolvedRovoActionsExample
> = wb(VrBlockCardResolvedRovoActionsExample);
