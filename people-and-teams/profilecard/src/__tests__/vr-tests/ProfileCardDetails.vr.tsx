import { type Hooks, snapshot, type SnapshotTestOptions } from '@af/visual-regression';

import {
	ProfileCardExampleWithMetaAndLozenges,
	ProfileCardExampleWithoutReportingLines,
	ProfileCardExampleWithReportingLines,
} from './ProfileCardDetails.fixtures';

const defaultSettings: SnapshotTestOptions<Hooks> = {
	drawsOutsideBounds: true,
};

snapshot(ProfileCardExampleWithReportingLines, defaultSettings);
snapshot(ProfileCardExampleWithoutReportingLines, defaultSettings);
snapshot(ProfileCardExampleWithMetaAndLozenges, defaultSettings);
