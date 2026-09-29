import { wb, type WorkbenchExample } from '@atlassian/workbench';

import ProgressIndicatorAppearancesExample from '../progress-indicator-appearances.vr.ap';

export const ProgressIndicatorAppearances: WorkbenchExample<
	typeof ProgressIndicatorAppearancesExample
> = wb(ProgressIndicatorAppearancesExample);
