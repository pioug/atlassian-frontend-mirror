export default {
	meta: {
		auth: [],
		definitionId: 'jira-object-provider',
		visibility: 'restricted',
		access: 'granted',
		resourceType: 'roadmap',
		key: 'jira-object-provider',
		objectId: 'timeline-id',
		tenantId: 'jira-tenant',
	},
	data: {
		'@context': {
			'@vocab': 'https://www.w3.org/ns/activitystreams#',
			atlassian: 'https://schema.atlassian.com/ns/vocabulary#',
			schema: 'http://schema.org/',
		},
		generator: {
			'@type': 'Application',
			'@id': 'https://www.atlassian.com/#Jira',
			name: 'Jira',
		},
		'@type': ['Object', 'atlassian:Project'],
		url: 'https://jira-url/projects/project-id/boards/board-id/timeline',
		name: 'Linking Platform',
		summary: '',
		icon: {
			'@type': 'Image',
			url: 'https://icon-url',
		},
		preview: {
			href: 'https://preview-url',
			'atlassian:supportedPlatforms': ['web'],
		},
	},
};
