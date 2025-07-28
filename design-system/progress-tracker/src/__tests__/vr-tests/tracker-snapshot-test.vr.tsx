import { snapshot } from '@af/visual-regression';

import ProgressTrackerDefault from '../../../examples/progress-tracker-default';

snapshot(ProgressTrackerDefault, {
	drawsOutsideBounds: true,
});
