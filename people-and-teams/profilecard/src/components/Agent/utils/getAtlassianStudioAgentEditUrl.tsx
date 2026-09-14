import { getStudioPath } from './getStudioPath';

export const getAtlassianStudioAgentEditUrl = (
	siteId: string,
	agentId: string,
	email?: string,
): string =>
	getStudioPath(
		`/s/${siteId}/agents/enrich/rovo/agents/${agentId}?redirect=${encodeURIComponent(
			'/:agentId/overview',
		)}`,
		email,
	);
