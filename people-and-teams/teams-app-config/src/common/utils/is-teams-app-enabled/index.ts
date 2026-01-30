import { isIsolatedCloud } from '@atlaskit/atlassian-context';

import { type NavigationActionCommon } from '../../types';

export function isTeamsAppEnabled(
	_config?: Pick<NavigationActionCommon, 'userHasNav4Enabled' | 'hostProduct'>,
) {
	//  Hard kill switch for isolated cloud until Standalone directory is deployed
	if (isIsolatedCloud()) {
		return false;
	}

	return true;
}
