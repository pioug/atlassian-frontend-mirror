import { type Datasource } from '@atlaskit/linking-common';
import { type ProviderPattern, type UserPreferences } from '../types';

export type PatternsProviderResponse = {
	providers: Provider[];
	userPreferences?: UserPreferences;
};

type Provider = {
	key: string;
	patterns: ProviderPattern[];
};

export const getMockProvidersResponse = ({
	userPreferences,
}: { userPreferences?: UserPreferences } = {}): PatternsProviderResponse => ({
	providers: [
		{
			key: 'google-object-provider',
			patterns: [
				{
					source:
						'^https:\\/\\/docs.google.com\\/(?:spreadsheets|document|presentation)\\/d\\/[^\\\\]+\\/|^https:\\/\\/drive.google.com\\/file\\/d\\/[^\\\\]+\\/|^https:\\/\\/drive.google.com\\/open\\?id=[^&]+|^https:\\/\\/drive.google.com\\/drive\\/u\\/\\d+\\/folders\\/[^&\\?]+|^https:\\/\\/drive.google.com\\/drive\\/folders\\/[^&\\?]+',
				},
			],
		},
		{
			key: 'provider-with-default-view',
			patterns: [
				{
					source: '^https:\\/\\/site-with-default-view.com\\/.*?/?$',
					defaultView: 'embed',
				},
			],
		},
		{
			key: 'jira-object-provider',
			patterns: [
				{
					source: '^https:\\/\\/.*?\\.jira-dev\\.com\\/browse\\/([a-zA-Z0-9]+-\\d+)#?.*?\\/?$',
				},
				{
					source:
						'^https:\\/\\/.*?\\.jira-dev\\.com\\/jira\\/software\\/(c\\/)?projects\\/([^\\/]+?)\\/(list|issues)\\/?',
				},
				{
					source:
						'^https:\\/\\/.*?\\.jira-dev\\.com\\/jira\\/software\\/(c\\/)?projects\\/([^\\/]+?)\\/boards\\/(\\d+)\\/(timeline|roadmap)\\/?',
				},
				{
					source:
						'^https:\\/\\/.*?\\.jira-dev\\.com\\/jira\\/core\\/projects\\/(?<resourceId>\\w+)\\/(timeline|calendar|list|board|issues|summary)\\/?',
				},
				{
					source:
						'^https:\\/\\/.*?\\.jira-dev\\.com\\/jira\\/core\\/projects\\/(?<resourceId>\\w+)\\/form\\/(?<formId>\\w+)\\/?',
				},
				{
					source:
						'^https:\\/\\/[^/]+\\.jira-dev\\.com\\/jira\\/(core|software(\\/c)?|servicedesk)\\/projects\\/(\\w+)\\/forms\\/form\\/direct\\/\\d+\\/\\d+.*$',
				},
			],
		},
		{
			key: 'slack-object-provider',
			patterns: [
				{
					source:
						'^https:\\/\\/.+?\\.slack\\.com\\/archives\\/[CG][A-Z0-9][^/]+\\/?$|^https:\\/\\/app\\.slack\\.com\\/client\\/T[A-Z0-9]+\\/[CG][A-Z0-9][^/]+\\/?$|^https:\\/\\/.+?\\.slack\\.com\\/archives\\/[CG][A-Z0-9][^/]+\\/p[0-9]+(\\?.*)?$',
				},
			],
		},
		{
			key: 'polaris-object-provider',
			patterns: [
				{
					source:
						'^https:\\/\\/.*?\\/jira\\/polaris\\/projects\\/[^\\/]+?\\/ideas\\/view\\/\\d+$|^https:\\/\\/.*?\\/secure\\/JiraProductDiscoveryAnonymous\\.jspa\\?hash=\\w+|^https:\\/\\/.*?\\/jira\\/polaris\\/share\\/\\w+',
				},
			],
		},
		{
			key: 'jpd-views-service-object-provider',
			patterns: [
				{
					source:
						'^https:\\/\\/.*?\\/jira\\/polaris\\/share\\/\\w+|^https:\\/\\/.*?\\/jira\\/discovery\\/share\\/views\\/[\\w-]+(\\?selectedIssue=[\\w-]+&issueViewLayout=sidebar&issueViewSection=[\\w-]+)?$',
				},
			],
		},
		{
			key: 'rovo-object-provider',
			patterns: [
				{
					source: '^https:\\/\\/.*?\\/people\\/agent\\/.*$',
				},
			],
		},
		{
			key: 'confluence-object-provider',
			patterns: [
				{
					source:
						'^https:\\/\\/[^/]+\\.jira-dev\\.com\\/wiki\\/spaces\\/([^\\/]+)\\/calendars\\/([a-zA-Z0-9-]+)',
				},
			],
		},
	],
	...(userPreferences
		? {
				userPreferences,
			}
		: {}),
});

export const expectedInlineAdf = (url: string) => ({
	type: 'inlineCard',
	attrs: {
		url,
	},
});

export const expectedEmbedAdf = (url: string) => ({
	type: 'embedCard',
	attrs: {
		url,
		layout: 'wide',
	},
});

export const expectedBlockAdf = (url: string) => ({
	type: 'blockCard',
	attrs: {
		url,
	},
});

export const expectedDatasourceAdf = (datasource: Datasource, url?: string) => ({
	type: 'blockCard',
	attrs: {
		datasource,
		url,
	},
});
