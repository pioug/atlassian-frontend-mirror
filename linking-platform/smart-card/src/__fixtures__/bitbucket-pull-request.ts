export default {
	meta: {
		visibility: 'restricted',
		access: 'granted',
		resourceType: 'pull',
		key: 'native-bitbucket-object-provider',
		objectId: 'pull-id',
		tenantId: 'bitbucket-tenant',
	},
	data: {
		'@id': 'https://pull-request-url/61',
		'@context': {
			'@vocab': 'https://www.w3.org/ns/activitystreams#',
			atlassian: 'https://schema.atlassian.com/ns/vocabulary#',
			schema: 'http://schema.org/',
		},
		'@type': ['Object', 'atlassian:SourceCodePullRequest'],
		url: 'https://link-url',
		attributedTo: {
			'@type': 'Person',
			name: 'Angie Mccarthy',
			icon: 'https://person-url',
		},
		'schema:dateCreated': '2022-07-04T12:04:10.182Z',
		generator: {
			'@type': 'Application',
			name: 'Bitbucket',
			icon: {
				'@type': 'icon',
				url: 'https://icon-url',
			},
		},
		icon: {
			'@type': 'icon',
			url: 'https://icon-url',
		},
		name: 'EDM-3605: Cras ut nisi vitae lectus sagittis mattis',
		summary: '',
		'atlassian:mergeSource': {
			'@type': 'Link',
			href: 'https://source-branch-url',
			name: 'source-branch',
		},
		'atlassian:mergeDestination': {
			'@type': 'Link',
			href: 'https://target-branch-url',
			name: 'target-branch',
		},
		updated: '2022-07-04T12:05:28.601Z',
		'atlassian:internalId': '61',
		'atlassian:isMerged': false,
		'atlassian:state': 'OPEN',
		'atlassian:reviewer': [
			{ '@type': 'Person', name: 'Steve Johnson', icon: 'https://person-url' },
			{
				'@type': 'Person',
				name: 'Aliza Montgomery',
				icon: 'https://person-url',
			},
		],
		'atlassian:updatedBy': {
			'@type': 'Person',
			name: 'Angie Mccarthy',
			icon: 'https://person-url',
		},
		audience: [
			{ '@type': 'Person', name: 'Steve Johnson', icon: 'https://person-url' },
			{
				'@type': 'Person',
				name: 'Aliza Montgomery',
				icon: 'https://person-url',
			},
		],
		context: {
			'@type': 'atlassian:SourceCodeRepository',
			name: 'bitbucket-object-provider',
			url: 'https://provider-url',
		},
	},
};
