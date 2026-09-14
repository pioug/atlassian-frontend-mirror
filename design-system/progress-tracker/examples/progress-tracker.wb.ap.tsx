import { wb, type WorkbenchExample } from '@atlassian/workbench';

import CompletedExample from './completed';
import DynamicStagesExample from './dynamic-stages';
import NoLinkExample from './no-link';
import ProgressTrackerDefaultVrExample from './progress-tracker-default.vr.ap';
import ProgressTrackerSpacingComfortableExample from './progress-tracker-spacing-comfortable';
import ProgressTrackerSpacingCompactExample from './progress-tracker-spacing-compact';
import ProgressTrackerSpacingCozyExample from './progress-tracker-spacing-cozy';
import TransitionsExample from './transitions';
import UnanimatedExample from './unanimated';

const Completed: WorkbenchExample = wb(CompletedExample);

export default Completed;
export const DynamicStages: WorkbenchExample = wb(DynamicStagesExample);
export const NoLink: WorkbenchExample = wb(NoLinkExample);
export const ProgressTrackerDefaultVr: WorkbenchExample = wb(ProgressTrackerDefaultVrExample);
export const ProgressTrackerSpacingComfortable: WorkbenchExample = wb(
	ProgressTrackerSpacingComfortableExample,
);
export const ProgressTrackerSpacingCompact: WorkbenchExample = wb(
	ProgressTrackerSpacingCompactExample,
);
export const ProgressTrackerSpacingCozy: WorkbenchExample = wb(ProgressTrackerSpacingCozyExample);
export const Transitions: WorkbenchExample = wb(TransitionsExample);
export const Unanimated: WorkbenchExample = wb(UnanimatedExample);
