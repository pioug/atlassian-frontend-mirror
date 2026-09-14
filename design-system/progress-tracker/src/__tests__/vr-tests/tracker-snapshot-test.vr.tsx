import { snapshot } from '@af/visual-regression';

import ProgressTrackerDefault from '../../../examples/progress-tracker-default.vr.ap';

snapshot(ProgressTrackerDefault, {
	drawsOutsideBounds: true,
});
