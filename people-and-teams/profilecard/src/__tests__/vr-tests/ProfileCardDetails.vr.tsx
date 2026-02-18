import { type Hooks, snapshot, type SnapshotTestOptions } from '@af/visual-regression';

import {
	ProfileCardExampleWithMetaAndLozenges,
	ProfileCardExampleWithoutReportingLines,
	ProfileCardExampleWithReportingLines,
} from './ProfileCardDetails.fixtures';
import {
	TeamProfileCardWithDisbandedState,
	TeamProfileCardWithTriggerTest,
} from './TeamProfileCardWithTriggerTest';

const defaultSettings: SnapshotTestOptions<Hooks> = {
	drawsOutsideBounds: true,
};

snapshot(ProfileCardExampleWithReportingLines, defaultSettings);
snapshot(ProfileCardExampleWithoutReportingLines, defaultSettings);
snapshot(ProfileCardExampleWithMetaAndLozenges, defaultSettings);

snapshot(TeamProfileCardWithTriggerTest, {
	...defaultSettings,
	states: [
		{ state: 'hovered', selector: { byTestId: 'trigger' } },
		{ state: 'focused', selector: { byTestId: 'profilecard-avatar-group--avatar-group' } },
	],
	mockTimers: true,
	waitForReactLazy: true,
});

snapshot(TeamProfileCardWithDisbandedState, {
	...defaultSettings,
	states: [
		{ state: 'hovered', selector: { byTestId: 'trigger-disbanded' } },
		{ state: 'focused', selector: { byTestId: 'profilecard-avatar-group--avatar-group' } },
	],
	mockTimers: true,
	waitForReactLazy: true,
});
