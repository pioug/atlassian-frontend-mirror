import { isIsolatedCloud } from '@atlaskit/atlassian-context/is-isolated-cloud';
import { fg } from '@atlaskit/platform-feature-flags';

import { type NavigationActionCommon } from '../../types';

export function isTeamsAppEnabled(
	_config?: Pick<NavigationActionCommon, 'userHasNav4Enabled' | 'hostProduct'>,
): boolean {
	//  Hard kill switch for isolated cloud until Standalone directory is deployed
	if (isIsolatedCloud() && !fg('remove-ic-kill-switch-teams-app')) {
		return false;
	}

	return true;
}
