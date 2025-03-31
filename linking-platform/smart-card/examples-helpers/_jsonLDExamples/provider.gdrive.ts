import { type JsonLd } from '@atlaskit/json-ld-types';

export const GoogleDocUrl =
	'https://docs.google.com/document/d/1MbN3KKm5Ih6QDeejgrduvrXeadEQGcINPK8Vz3vgGlc/edit?usp=sharing';
export const GoogleDoc = {
	meta: {
		access: 'granted',
		visibility: 'restricted',
		definitionId: '4f038a1b-65ff-4c8e-b1af-337ef352bd01',
		key: 'google-object-provider',
		resourceType: 'file',
		supportedFeature: ['AISummary'],
		version: '4.11.4',
	},
	data: {
		'@context': {
			'@vocab': 'https://www.w3.org/ns/activitystreams#',
			atlassian: 'https://schema.atlassian.com/ns/vocabulary#',
			schema: 'http://schema.org/',
		},
		'@type': ['schema:TextDigitalDocument', 'Object'],
		'@id': 'id:1MbN3KKm5Ih6QDeejgrduvrXeadEQGcINPK8Vz3vgGlc',
		url: GoogleDocUrl,
		icon: {
			'@type': 'Image',
			url: 'https://developers.google.com/drive/images/drive_icon.png',
		},
		name: 'Google Docs: Public (view + edit)',
		version: '45',
		'atlassian:fileSize': '407961',
		'schema:fileFormat': 'application/vnd.google-apps.document',
		'atlassian:dateViewed': '2024-10-07T05:27:27.481Z',
		attributedTo: {
			'@type': 'Person',
			name: 'Atlas',
			image:
				'https://lh3.googleusercontent.com/a-/ALV-UjX9yVpf9ietQLMPNzlB0bwEpH7bN7Icbu3Lzf2FEkHsHs9_Jg=s64',
		},
		'schema:dateCreated': '2022-07-04T13:25:17.611Z',
		updated: '2022-07-06T23:28:27.509Z',
		'atlassian:updatedBy': {
			'@type': 'Person',
			name: 'Atlas',
			image:
				'https://lh3.googleusercontent.com/a-/ALV-UjX9yVpf9ietQLMPNzlB0bwEpH7bN7Icbu3Lzf2FEkHsHs9_Jg=s64',
		},
		'atlassian:isDeleted': false,
		'schema:commentCount': 0,
		preview: {
			'@type': 'Link',
			href: 'https://docs.google.com/document/d/1MbN3KKm5Ih6QDeejgrduvrXeadEQGcINPK8Vz3vgGlc/edit?usp=drivesdk&rm=minimal&output=embed',
			interactiveHref:
				'https://docs.google.com/document/d/1MbN3KKm5Ih6QDeejgrduvrXeadEQGcINPK8Vz3vgGlc/edit?usp=drivesdk&rm=embedded&output=embed',
			'atlassian:supportedPlatforms': ['web'],
		},
		generator: {
			'@type': 'Application',
			name: 'Google Drive',
			icon: {
				'@type': 'Image',
				url: 'https://developers.google.com/drive/images/drive_icon.png',
			},
		},
	},
} as JsonLd.Response<JsonLd.Data.BaseData>;
