import { fg } from '@atlaskit/platform-feature-flags';
import { getStudioSessionSyncUrl } from '@atlassian/studio-entry-link';

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

const getStudioEnv = (): 'production' | 'staging' => (isStaging() ? 'staging' : 'production');

export const getStudioHost = (): string => {
	return isStaging() ? STUDIO_STAGING_URL : STUDIO_PROD_URL;
};

export const getStudioPath = (path: string, email?: string): string => {
	if (email && fg('asf-944-account-sync')) {
		return getStudioSessionSyncUrl(getStudioEnv(), path, email);
	}
	return `${getStudioHost()}${path}`;
};

export const getAtlassianStudioAgentEditUrl = (siteId: string, agentId: string, email?: string): string =>
	getStudioPath(
		`/s/${siteId}/agents/enrich/rovo/agents/${agentId}?redirect=${encodeURIComponent('/:agentId/overview')}`,
		email,
	);

export const getAtlassianStudioAgentDuplicateUrl = (siteId: string, agentId: string, email?: string): string =>
	getStudioPath(
		`/s/${siteId}/agents/enrich/rovo/agents/${agentId}?redirect=${encodeURIComponent('/create')}`,
		email,
	);
