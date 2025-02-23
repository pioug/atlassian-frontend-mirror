import { snapshot } from '@af/visual-regression';

import ProgressTrackerDefault from '../../../examples/progress-tracker-default';

snapshot(ProgressTrackerDefault, {
	drawsOutsideBounds: true,
	featureFlags: {
		platform_progress_tracker_link_migration: [true, false],
	},
});
