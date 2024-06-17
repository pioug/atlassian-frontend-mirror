import { type Hooks, snapshot, type SnapshotTestOptions } from '@af/visual-regression';

import {
	ProfileCardExampleWithoutReportingLines,
	ProfileCardExampleWithReportingLines,
} from './ProfileCardDetails.fixtures';

const defaultSettings: SnapshotTestOptions<Hooks> = {
	drawsOutsideBounds: true,
};

snapshot(ProfileCardExampleWithReportingLines, defaultSettings);
snapshot(ProfileCardExampleWithoutReportingLines, defaultSettings);
