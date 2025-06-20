import type { SmartLinkResponse } from '@atlaskit/linking-types';

export default {
	meta: {
		access: 'granted',
		visibility: 'restricted',
		auth: [
			{
				key: 'gdrive',
				displayName: 'Atlassian - Google Drive',
				url: 'https://id.stg.internal.atlassian.com/login?continue=https%3A%2F%2Fid.stg.internal.atlassian.com%2FoutboundAuth%2Fstart%3FcontainerId%3D2357cbb7-bf5c-4fe4-a9c6-c8e172ccb5b1_3b53863d-a6bb-4818-91da-4de04f975f48%26serviceKey%3Dgdrive%26isAccountBased%3Dtrue%26contextAri%3Dari%253Acloud%253Agraph%253A%253Aintegration-context%252F3d1b1176-a2e3-4233-82bd-29a9cfc80cab%26scopes%3Dhttps%253A%252F%252Fwww.googleapis.com%252Fauth%252Fdrive.readonly%2Bhttps%253A%252F%252Fwww.googleapis.com%252Fauth%252Fuserinfo.profile%2Bhttps%253A%252F%252Fwww.googleapis.com%252Fauth%252Fuserinfo.email%2Bhttps%253A%252F%252Fwww.googleapis.com%252Fauth%252Fcontacts.readonly%2Bhttps%253A%252F%252Fwww.googleapis.com%252Fauth%252Fcontacts.other.readonly%2Bhttps%253A%252F%252Fwww.googleapis.com%252Fauth%252Fdirectory.readonly%2Bhttps%253A%252F%252Fwww.googleapis.com%252Fauth%252Fdrive.file&login_hint=zstevens%40atlassian.com&prompt=none&serviceKey=gdrive',
			},
		],
		definitionId: 'bf155190-d90c-449f-9690-d1d1aa9910e6',
		key: 'google-object-provider',
		resourceType: 'file',
		supportedFeature: ['RelatedLinks'],
		version: '8.2.1',
		hasScopeOverrides: true,
		generator: {
			'@type': 'Application',
			name: 'Google Drive',
			icon: {
				'@type': 'Image',
				url: 'https://provider-icon.com/drive_icon.png',
			},
		},
	},
	data: {
		'@type': 'Document',
		'@context': {
			'@vocab': 'https://www.w3.org/ns/activitystreams#',
			atlassian: 'https://schema.atlassian.com/ns/vocabulary#',
			schema: 'http://schema.org/',
		},
		'@version': '1.0',
		'@id': 'https://document.com',
		title: 'Google Sheets: Public',
		description: 'Really large content here...',
		provider: {
			name: 'Google Drive',
			url: 'https://developers.google.com/drive/',
			iconUrl: 'https://developers.google.com/drive/images/drive_icon.png',
		},
		type: 'document',
	},
	entityData: {
		schemaVersion: '1.0',
		id: 'my-document',
		updateSequenceNumber: 123,
		displayName: 'Google Sheets: Public',
		url: 'https://document.com',
		ari: 'ari:cloud:graph::document/my-document',
		thumbnail: {
			externalUrl: 'https://preview-image-url',
		},
		createdAt: '2024-04-16T09:01:32+00:00',
		createdBy: {
			accountId: '5b5775502abff9a219',
			id: 'Waanya Yoosthaporn',
			email: 'user@email.com',
			externalId: 'WELLJST6K',
		},
		lastUpdatedAt: '2022-06-22T00:44:14.956Z',
		parentKey: {
			type: 'atlassian:document',
			value: {
				entityId: 'another-document',
			},
		},
		permissions: {
			accessControls: [
				{
					principals: [
						{
							type: 'EVERYONE',
						},
					],
				},
			],
		},
		'atlassian:document': {
			type: {
				category: 'document',
				iconUrl: 'http://icon-url',
			},
			content: {
				mimeType: 'text/plain',
				text: 'Really large content here...',
			},
			byteSize: 456,
			labels: ['label1', 'label2'],
			reactions: [
				{
					type: 'LIKE',
					total: 1,
				},
			],
		},
		containerKey: {
			type: 'atlassian:space',
			value: {
				entityId: 'CFG3W7TKJ',
			},
		},
	},
} as SmartLinkResponse;
