import { wb, type WorkbenchExample } from '@atlassian/workbench';

import ProgressTrackerDefaultExample from '../progress-tracker-default.vr.ap';

export const ProgressTrackerDefault: WorkbenchExample<typeof ProgressTrackerDefaultExample> = wb(
	ProgressTrackerDefaultExample,
);
