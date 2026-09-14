import { type RequireOrgIdOrCloudId } from '../../common/types';
import { generateTeamsAppPath } from './generateTeamsAppPath';

/**
 * This function generates a URL for navigating to the Teams app based on a path and search params.
 * This _always_ returns a Teams app URL, regardless of feature gates & context.
 */
export const toTeamsAppURL = (
	path: string,
	search: string,
	config: RequireOrgIdOrCloudId,
): string => {
	return generateTeamsAppPath(path, config, new URLSearchParams(search));
};
