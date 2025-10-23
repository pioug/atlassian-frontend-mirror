import type { SmartLinkResponse } from '@atlaskit/linking-types';

export default {
	meta: {
		access: 'granted',
		visibility: 'restricted',
		auth: [
			{
				key: 'slack',
				displayName: 'Atlassian Connector - Slack',
				url: 'https://id.stg.internal.atlassian.com/login?continue=https%3A%2F%2Fid.stg.internal.atlassian.com%2FoutboundAuth%2Fstart%3FcontainerId%3D32a368b4-220e-45a9-b65f-df104dc2e559_7ab21f60-b89a-44c1-bed3-00282c3e7b9e%26serviceKey%3Dslack%26isAccountBased%3Dtrue%26contextAri%3Dari%253Acloud%253Agraph%253A%253Aintegration-context%252F3d1b1176-a2e3-4233-82bd-29a9cfc80cab&login_hint=zstevens%40atlassian.com&prompt=none&serviceKey=slack',
			},
		],
		definitionId: 'e1bfa9cc-ecfe-4466-bcfb-8759bf9a1c60',
		key: 'slack-object-provider',
		objectId: 'slack-channel-67890',
		resourceType: 'channel',
		tenantId: 'slack-tenant',
		version: '6.0.4',
		generator: {
			'@type': 'Application',
			name: 'Slack',
			icon: {
				'@type': 'Image',
				url: 'https://a.slack-edge.com/80588/marketing/img/meta/favicon-32.png',
			},
		},
	},
	data: {
		'@id': 'https://atlassian.enterprise.slack.com/archives/C02NKSU9XME',
		url: 'https://atlassian.enterprise.slack.com/archives/C02NKSU9XME',
		'@context': {
			'@vocab': 'https://www.w3.org/ns/activitystreams#',
			atlassian: 'https://schema.atlassian.com/ns/vocabulary#',
			schema: 'http://schema.org/',
		},
		'@type': 'Document',
		name: '#swifties',
		summary: ':taylor_swift:',
		'atlassian:subscriberCount': 111,
		'schema:potentialAction': [
			{
				'@type': 'ViewAction',
				name: 'View',
				identifier: 'slack-object-provider',
			},
		],
		generator: {
			'@type': 'Application',
			name: 'Slack',
			icon: {
				'@type': 'Image',
				url: 'https://a.slack-edge.com/80588/marketing/img/meta/favicon-32.png',
			},
		},
		updated: '2025-06-07T11:15:08.398Z',
	},
	entityData: {
		schemaVersion: '1.0',
		id: 'https://atlassian.enterprise.slack.com/archives/C02NKSU9XME',
		url: 'https://atlassian.enterprise.slack.com/archives/C02NKSU9XME',
		displayName: '#swifties',
		description: ':taylor_swift:',
		lastUpdatedAt: '2025-06-07T11:15:08.398Z',
		memberCount: 111,
	},
	debugInfo: {
		logs: [],
	},
} as SmartLinkResponse;
