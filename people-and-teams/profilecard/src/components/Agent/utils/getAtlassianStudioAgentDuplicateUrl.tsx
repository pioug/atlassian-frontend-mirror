import { getStudioPath } from './getStudioPath';

export const getAtlassianStudioAgentDuplicateUrl = (
	siteId: string,
	agentId: string,
	email?: string,
): string =>
	getStudioPath(
		`/s/${siteId}/agents/enrich/rovo/agents/${agentId}?redirect=${encodeURIComponent('/create')}`,
		email,
	);
