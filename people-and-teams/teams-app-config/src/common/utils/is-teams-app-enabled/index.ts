import { isFedRamp, isIsolatedCloud } from '@atlaskit/atlassian-context';
import FeatureGates from '@atlaskit/feature-gate-js-client';
import { fg } from '@atlaskit/platform-feature-flags';

import { type NavigationActionCommon } from '../../types';

export function isTeamsAppEnabled(
	config: Pick<NavigationActionCommon, 'userHasNav4Enabled' | 'hostProduct'>,
) {
	//  Hard kill switch for isolated cloud until Standalone directory is deployed
	if (isIsolatedCloud()) {
		return false;
	}

	// Hard kill switch for customers that have requested extensions.
	if (fg('teams-app-migration-exclusions')) {
		return false;
	}

	// Due to experiment exposures, we need to first check if Nav4 is enabled to see if the user is in the cohort
	// In FedRamp, we are ignoring the Nav4 dependency
	if (!isFedRamp() && config.userHasNav4Enabled !== undefined && !config.userHasNav4Enabled) {
		return false;
	}

	if (FeatureGates.initializeCompleted()) {
		// Next we check the experiment value based on the host product
		if (
			config.hostProduct === 'jira' &&
			FeatureGates.getExperimentValue(
				'migrate-jira-people-directory-to-teams-app',
				'isEnabled',
				false,
			)
		) {
			return true;
		}
		if (
			config.hostProduct === 'confluence' &&
			FeatureGates.getExperimentValue(
				'migrate-confluence-people-directory-to-teams-app',
				'isEnabled',
				false,
			)
		) {
			return true;
		}
	}

	// Lastly we check the feature gate which we are using for dogfooding, we won't roll this flag out in production.
	return fg('should-redirect-directory-to-teams-app');
}
