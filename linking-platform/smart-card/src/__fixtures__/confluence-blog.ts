export default {
	meta: {
		auth: [],
		definitionId: 'confluence-object-provider',
		visibility: 'restricted',
		access: 'granted',
		resourceType: 'blog',
		key: 'confluence-object-provider',
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
		'@type': ['Document', 'schema:BlogPosting'],
		url: 'https://confluence-url/wiki/spaces/space-id/blog/blog-id',
		name: 'Announcing the winners of the Customer Fun Award for ShipIt 53',
		'atlassian:state': 'current',
		summary:
			'A few weeks ago, we announced a brand new award for ShipIt - the Customer Fun Award. The goal was to generate ideas to create fun experiences in our new product, Canvas.',
		'schema:commentCount': 7,
		'atlassian:subscriberCount': 17,
		'atlassian:titlePrefix': {
			text: '"1f3c6"',
			'@type': 'atlassian:Emoji',
		},
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
