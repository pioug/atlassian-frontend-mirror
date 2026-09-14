/* eslint-disable @repo/internal/deprecations/deprecation-ticket-required -- VOLTC-139 tracks removal of these deprecated re-export shims. */
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

/**
 * @deprecated Use `import { getBaseUrl } from '@atlaskit/linking-common/client'` instead.
 */
export { getBaseUrl } from './getBaseUrl';
/**
 * @deprecated Use `import { getResolverUrl } from '@atlaskit/linking-common/client'` instead.
 */
export { getResolverUrl } from './getResolverUrl';
