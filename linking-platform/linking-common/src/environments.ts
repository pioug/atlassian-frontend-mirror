import { EnvironmentsKeys } from './types';

const devBaseUrl = 'https://api-private.dev.atlassian.com';
const stgBaseUrl = 'https://pug.jira-dev.com/gateway/api';
const prodBaseUrl = 'https://api-private.atlassian.com';

export const BaseUrls = {
  dev: devBaseUrl,
  development: devBaseUrl,

  stg: stgBaseUrl,
  staging: stgBaseUrl,

  prd: prodBaseUrl,
  prod: prodBaseUrl,
  production: prodBaseUrl,
};

export const getBaseUrl = (envKey?: keyof typeof BaseUrls) => {
  // If an environment is provided, then use Stargate.
  if (envKey) {
    return envKey in BaseUrls ? BaseUrls[envKey] : prodBaseUrl;
  }

  // Otherwise, use the current origin of the page.
  return window.location.origin;
};

export const getResolverUrl = (
  envKey?: EnvironmentsKeys,
  baseUrlOverride?: string,
) => {
  // If an environment is provided, then use Stargate directly for requests.
  if (envKey || baseUrlOverride) {
    const baseUrl = baseUrlOverride || getBaseUrl(envKey);

    return `${baseUrl}/object-resolver`;
  } else {
    // Otherwise, we fallback to using the Edge Proxy to access Stargate,
    // which fixes some cookie issues with strict Browser policies.
    return '/gateway/api/object-resolver';
  }
};

export default BaseUrls;
