export default {
	meta: {
		auth: [],
		definitionId: 'confluence-object-provider',
		visibility: 'restricted',
		access: 'granted',
		resourceType: 'page',
		key: 'confluence-object-provider',
		objectId: 'page-id',
		tenantId: 'confluence-tenant',
	},
	data: {
		'@context': {
			'@vocab': 'https://www.w3.org/ns/activitystreams#',
			atlassian: 'https://schema.atlassian.com/ns/vocabulary#',
			schema: 'http://schema.org/',
		},
		generator: {
			'@type': 'Application',
			'@id': 'https://www.atlassian.com/#Confluence',
			name: 'Confluence',
		},
		'@type': ['Document', 'schema:TextDigitalDocument'],
		url: 'https://confluence-url/wiki/spaces/space-id/pages/page-id',
		name: 'Everything you need to know about ShipIt53!',
		'atlassian:state': 'current',
		summary: 'ShipIt 53 is on 9 Dec 2021 and 10 Dec 2021!',
		'schema:commentCount': 24,
		'atlassian:subscriberCount': 21,
		'atlassian:titlePrefix': { text: '', '@type': 'atlassian:Emoji' },
		'atlassian:attributedTo': {
			'@type': 'Person',
			name: 'Angie Mccarthy',
			icon: 'https://person-url',
		},
		'atlassian:ownedBy': {
			'@type': 'Person',
			name: 'Angie Mccarthy',
			icon: 'https://person-url',
		},
		preview: {
			'@type': 'Link',
			href: 'https://preview-url',
			'atlassian:supportedPlatforms': ['web'],
		},
	},
};
