const _default_1: {
	meta: {
		auth: never[];
		definitionId: string;
		visibility: string;
		access: string;
		resourceType: string;
		key: string;
		objectId: string;
		tenantId: string;
	};
	data: {
		'@context': {
			'@vocab': string;
			atlassian: string;
			schema: string;
		};
		generator: {
			'@type': string;
			'@id': string;
			name: string;
		};
		'@type': string[];
		url: string;
		name: string;
		summary: string;
		icon: {
			'@type': string;
			url: string;
		};
		preview: {
			href: string;
			'atlassian:supportedPlatforms': string[];
		};
	};
} = {
	meta: {
		auth: [],
		definitionId: 'jira-object-provider',
		visibility: 'restricted',
		access: 'granted',
		resourceType: 'roadmap',
		key: 'jira-object-provider',
		objectId: 'roadmap-id',
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
		url: 'https://jira-url/projects/project-id/boards/board-id/roadmap',
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
export default _default_1;
