import type { RequireOrgIdOrCloudId } from '../../common/types';
import { generateTeamsAppPath } from './generateTeamsAppPath';

export function generatePath(
	path: string,
	config: RequireOrgIdOrCloudId,
	query: URLSearchParams = new URLSearchParams(),
	anchor?: string,
): string {
	return generateTeamsAppPath(path, config, query, anchor);
}
