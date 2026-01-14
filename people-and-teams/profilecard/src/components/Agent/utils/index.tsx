const STUDIO_PROD_URL = 'https://studio.atlassian.com';
const STUDIO_STAGING_URL = 'https://atlassian-studio.stg-east.frontend.public.atl-paas.net';

const isStaging = (): boolean => {
	const host = window.location.host;
	return (
		host.includes('localhost') ||
		host.includes('.stg.atlassian') ||
		host.includes('.stg-east.frontend.public.atl-paas.net') ||
		host.includes('jira-dev.com')
	);
};

export const getStudioHost = (): string => {
	return isStaging() ? STUDIO_STAGING_URL : STUDIO_PROD_URL;
};

export const getStudioPath = (path: string) => `${getStudioHost()}${path}`;

export const getAtlassianStudioAgentEditUrl = (siteId: string, agentId: string): string =>
	getStudioPath(
		`/s/${siteId}/agents/enrich/rovo/agents/${agentId}?redirect=${encodeURIComponent('/:agentId/overview')}`,
	);

export const getAtlassianStudioAgentDuplicateUrl = (siteId: string, agentId: string): string =>
	getStudioPath(
		`/s/${siteId}/agents/enrich/rovo/agents/${agentId}?redirect=${encodeURIComponent('/create')}`,
	);
