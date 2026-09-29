import { wb, type WorkbenchExample } from '@atlassian/workbench';

import FlagFitViewportRightExample from '../06-flag-fit-viewport-right.vr.ap';

export const FlagFitViewportRight: WorkbenchExample<typeof FlagFitViewportRightExample> = wb(
	FlagFitViewportRightExample,
);
