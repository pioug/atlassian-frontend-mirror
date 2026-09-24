const devBaseUrl = 'https://api-private.dev.atlassian.com';

const stgBaseUrl = 'https://pug.jira-dev.com/gateway/api';

export const prodBaseUrl: any = 'https://api-private.atlassian.com';

export const BaseUrls: {
	dev: string;
	development: string;
	prd: string;
	prod: string;
	production: string;
	staging: string;
	stg: string;
} = {
	dev: devBaseUrl,
	development: devBaseUrl,

	stg: stgBaseUrl,
	staging: stgBaseUrl,

	prd: prodBaseUrl,
	prod: prodBaseUrl,
	production: prodBaseUrl,
};

export default BaseUrls;
