import { isFedRamp } from '@atlaskit/atlassian-context';

// https://sentry.io/settings/atlassian-2y/projects/people-and-teams-directory/keys/
export const SENTRY_PUBLIC_KEY = '1dc056d49dfe4df8961dc1b810e4620d';
export const SENTRY_PROJECT_ID = '5988845';
export const SENTRY_FEDRAMP_PUBLIC_KEY = '067abcc494be9a87b3cdf9416f2b97d5';
export const SENTRY_FEDRAMP_PROJECT_ID = '47';
const SENTRY_COMMERCIAL_DSN = `https://${SENTRY_PUBLIC_KEY}@o55978.ingest.sentry.io/${SENTRY_PROJECT_ID}`;
const SENTRY_FEDRAMP_DSN = `https://${SENTRY_FEDRAMP_PUBLIC_KEY}@sentry.atlassian-us-gov-mod.com/${SENTRY_FEDRAMP_PROJECT_ID}`;

export const SENTRY_DSN = isFedRamp() ? SENTRY_FEDRAMP_DSN : SENTRY_COMMERCIAL_DSN;
