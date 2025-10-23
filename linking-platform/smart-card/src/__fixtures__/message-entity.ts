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
		objectId: 'slack-message-12345',
		resourceType: 'message',
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
		'@id': 'https://atlassian.slack.com/archives/C02NKSU9XME/p1748619915934759',
		url: 'https://atlassian.slack.com/archives/C02NKSU9XME/p1748619915934759',
		'@context': {
			'@vocab': 'https://www.w3.org/ns/activitystreams#',
			atlassian: 'https://schema.atlassian.com/ns/vocabulary#',
			schema: 'http://schema.org/',
		},
		'@type': 'schema:Message',
		name: 'Message from Mel Policicchio in #swifties',
		summary:
			'So happy for her!! <https://www.rollingstone.com/music/music-news/taylor-swift-buys-original-album-recordings-1235351164/>',
		'schema:commentCount': 10,
		attributedTo: [
			{
				'@type': 'Person',
				name: 'Mel Policicchio',
				icon: 'https://avatars.slack-edge.com/2021-06-04/2151883122897_243c50d87650203c642b_48.jpg',
			},
			{
				'@type': 'Person',
				name: 'Alexa DiBenedetto',
				icon: 'https://avatars.slack-edge.com/2022-01-18/2993147985056_bd48bbf1f2d1ea55deca_48.jpg',
			},
			{
				'@type': 'Person',
				name: 'Eduardo Collaziol',
				icon: 'https://avatars.slack-edge.com/2025-01-27/8349667250102_2c856c97933295b36f54_48.png',
			},
			{
				'@type': 'Person',
				name: 'Bay Grove',
				icon: 'https://avatars.slack-edge.com/2024-12-05/8126967885318_77f3c895bb3781131bab_48.png',
			},
			{
				'@type': 'Person',
				name: 'Christopher Martin',
				icon: 'https://avatars.slack-edge.com/2025-03-07/8567681875029_4f81c4e4a0eb9a443987_48.png',
			},
		],
		'schema:dateCreated': '2025-05-30T15:45:15.934Z',
		'atlassian:reactCount': 33,
		generator: {
			'@type': 'Application',
			name: 'Slack',
			icon: {
				'@type': 'Image',
				url: 'https://a.slack-edge.com/80588/marketing/img/meta/favicon-32.png',
			},
		},
		dateSent: '2025-05-30T15:45:15.934Z',
		updated: '2025-05-30T15:45:15.934Z',
	},
	entityData: {
		schemaVersion: '1.0',
		id: 'https://atlassian.slack.com/archives/C02NKSU9XME/p1748619915934759',
		displayName: 'Message from Mel Policicchio in #swifties',
		description:
			'So happy for her!! <https://www.rollingstone.com/music/music-news/taylor-swift-buys-original-album-recordings-1235351164/>',
		url: 'https://atlassian.slack.com/archives/C02NKSU9XME/p1748619915934759',
		thirdPartyAri: 'ari:cloud:graph::message/slack-message-12345',
		thumbnail: {
			externalUrl: 'https://preview-image-url',
		},
		createdAt: '2025-05-30T15:45:15.934Z',
		owners: [
			{
				displayName: 'Mel Policicchio',
				picture:
					'https://avatars.slack-edge.com/2021-06-04/2151883122897_243c50d87650203c642b_48.jpg',
			},
			{
				displayName: 'Alexa DiBenedetto',
				picture:
					'https://avatars.slack-edge.com/2022-01-18/2993147985056_bd48bbf1f2d1ea55deca_48.jpg',
			},
			{
				displayName: 'Eduardo Collaziol',
				picture:
					'https://avatars.slack-edge.com/2025-01-27/8349667250102_2c856c97933295b36f54_48.png',
			},
			{
				displayName: 'Bay Grove',
				picture:
					'https://avatars.slack-edge.com/2024-12-05/8126967885318_77f3c895bb3781131bab_48.png',
			},
			{
				displayName: 'Christopher Martin',
				picture:
					'https://avatars.slack-edge.com/2025-03-07/8567681875029_4f81c4e4a0eb9a443987_48.png',
			},
		],
		hidden: false,
		isPinned: false,
		lastActive: '2025-05-30T15:45:15.934Z',
		attachments: [],
		commentCount: 10,
		reactions: [
			{
				reactionType: 'thumbsup',
				total: 20,
			},
			{
				reactionType: 'heart',
				total: 13,
			},
		],
	},
} as SmartLinkResponse;
