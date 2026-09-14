import { STUDIO_PROD_URL, STUDIO_STAGING_URL } from './index';

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
