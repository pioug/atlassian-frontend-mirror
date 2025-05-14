import { fg } from '@atlaskit/platform-feature-flags';

import { NavigationAction, NavigationResult } from './types';
import { generatePath, getPathAndQuery, onNavigateBase } from './utils';

/**
 * This function generates a URL for navigating to the Teams app based on the provided action.
 * This is not intended to be used within the Teams app itself.
 */
export const navigateToTeamsApp = (action: NavigationAction): NavigationResult => {
	const { shouldOpenInSameTab = !fg('should-redirect-directory-to-teams-app') } = action;

	const actionWithDefaults: NavigationAction = {
		...action,
		shouldOpenInSameTab,
	};

	const { path, query } = getPathAndQuery(actionWithDefaults);
	const href = generatePath(path, actionWithDefaults, query);
	const onNavigate = onNavigateBase(href, actionWithDefaults);
	const result: NavigationResult = {
		onNavigate,
		href,
	};
	return result;
};
