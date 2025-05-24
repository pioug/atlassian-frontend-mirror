export default {
	meta: {
		auth: [],
		definitionId: 'confluence-object-provider',
		visibility: 'restricted',
		access: 'granted',
		resourceType: 'space',
		key: 'confluence-object-provider',
		objectId: 'space-id',
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
		'@type': ['Object', 'atlassian:Project'],
		url: 'https://confluence-url/wiki/spaces/space-id',
		icon: {
			'@type': 'Image',
			url: 'https://icon-url',
		},
		name: 'ShipIt',
		'atlassian:state': 'current',
		summary: '',
		'atlassian:titlePrefix': { text: '', '@type': 'atlassian:Emoji' },
	},
};
