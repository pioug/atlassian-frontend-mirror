export const mockBaseResponse = {
	meta: {
		visibility: 'public',
		access: 'granted',
		auth: [],
		definitionId: 'd1',
		key: 'test-object-provider',
	},
	data: {
		'@context': {
			'@vocab': 'https://www.w3.org/ns/activitystreams#',
			atlassian: 'https://schema.atlassian.com/ns/vocabulary#',
			schema: 'http://schema.org/',
		},
		'@type': ['Object'],
		name: 'I love cheese',
		summary: 'Here is your serving of cheese',
		'schema:potentialAction': {
			'@id': 'comment',
			'@type': 'CommentAction',
			identifier: 'test-object-provider',
			name: 'Comment',
		},
		attributedTo: {
			'@type': 'Person',
			icon: {
				'@type': 'Image',
				url: 'avatar_url',
			},
			name: 'Michael Schrute',
		},
		preview: {
			'@type': 'Link',
			href: 'url',
		},
		image: {
			'@type': 'Image',
			url: 'url',
		},
		url: 'https://some.url',
	},
};

export const mockConfluenceResponse = {
	meta: {
		...mockBaseResponse.meta,
		key: 'confluence-object-provider',
	},
	data: {
		...mockBaseResponse.data,
		'schema:commentCount': 4,
		'atlassian:reactCount': 8,
		generator: {
			'@type': 'Application',
			'@id': 'https://www.atlassian.com/#Confluence',
			name: 'Confluence',
		},
	},
};

export const mockConfluenceResponseWithOwnedBy = {
	meta: {
		...mockBaseResponse.meta,
		key: 'confluence-object-provider',
	},
	data: {
		...mockBaseResponse.data,
		'schema:commentCount': 4,
		'atlassian:reactCount': 8,
		'atlassian:ownedBy': {
			'@type': 'Person',
			icon: {
				'@type': 'Image',
				url: 'avatar_url',
			},
			name: 'Michael Schrute',
		},
		generator: {
			'@type': 'Application',
			'@id': 'https://www.atlassian.com/#Confluence',
			name: 'Confluence',
		},
	},
};

export const mockJiraResponse = {
	meta: {
		...mockBaseResponse.meta,
		key: 'jira-object-provider',
	},
	data: {
		...mockBaseResponse.data,
		'atlassian:assignedTo': {
			'@type': 'Person',
			icon: {
				'@type': 'Image',
				url: 'avatar_url',
			},
			name: 'Michael Schrute',
		},
		updated: '2022-01-01T12:13:15.531+1000',
		tag: {
			'@type': 'Object',
			appearance: 'success',
			name: 'Done',
		},
		'@type': ['Object', 'atlassian:Task'],
		'atlassian:priority': {
			'@type': 'Object',
			icon: {
				'@type': 'Image',
				url: 'major_icon_url',
			},
			name: 'Major',
		},
		generator: {
			'@type': 'Application',
			'@id': 'https://www.atlassian.com/#Jira',
			name: 'Jira',
		},
	},
};

export const mockBBFileResponse = {
	meta: {
		...mockBaseResponse.meta,
		key: 'bitbucket-object-provider',
	},
	data: {
		...mockBaseResponse.data,
		'@type': ['schema:DigitalDocument'],
		'atlassian:updatedBy': {
			'@type': 'Person',
			icon: {
				'@type': 'Image',
				url: 'avatar_url',
			},
			name: 'Michael Schrute',
		},
		'atlassian:latestCommit': {
			name: '1b4hf3g',
			'@type': 'atlassian:SourceCodeCommit',
			summary: 'commit message',
		},
		updated: '2022-01-01T12:13:15.531+1000',
	},
};
