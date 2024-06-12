/* *NOTE*: please ensure any changes made to Perimeter and DomainKey type is copied in typings/atl-context.globals.d.ts */

import { type COMMERCIAL, type FEDRAMP_MODERATE } from './constants';

export type Perimeter = typeof FEDRAMP_MODERATE | typeof COMMERCIAL;

export const AllowedDomains = [
	'admin',
	'analytics',
	'api',
	'api.media',
	'api-private',
	'as',
	'atl-global',
	'atlaskit',
	'auth',
	'automation',
	'cassi.internal',
	'cc-import-sources.services',
	'confluence',
	'confluence-chats-integr.services',
	'confluence-cloud-bamboo.internal',
	'confluence-questions.services',
	'data-portal.internal',
	'design',
	'developer',
	'extranet',
	'go',
	'id',
	'id-mail-assets',
	'integrations',
	'ja',
	'jira',
	'jsd-widget',
	'jsd-widget-staging',
	'marketplace',
	'my',
	'my-reminders.services',
	'partners',
	'permalink',
	'permalink.stg',
	'schema',
	'start',
	'support',
	'surveys',
	'team',
	'wac-cdn',
	'xxid',
] as const;
// List of SubDomains: https://hello.atlassian.net/wiki/spaces/FEDRAMP/pages/2567950844/List+of+SubDomains
export type DomainKey = (typeof AllowedDomains)[number];

export type DomainConfig = {
	[key in DomainKey]: string;
};
