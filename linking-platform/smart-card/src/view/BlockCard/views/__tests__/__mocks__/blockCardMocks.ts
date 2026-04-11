export const mockBaseResponse: {
	meta: {
		visibility: string;
		access: string;
		auth: never[];
		definitionId: string;
		key: string;
	};
	data: {
		'@context': {
			'@vocab': string;
			atlassian: string;
			schema: string;
		};
		'@type': string[];
		name: string;
		summary: string;
		'schema:potentialAction': {
			'@id': string;
			'@type': string;
			identifier: string;
			name: string;
		};
		attributedTo: {
			'@type': string;
			icon: {
				'@type': string;
				url: string;
			};
			name: string;
		};
		preview: {
			'@type': string;
			href: string;
		};
		image: {
			'@type': string;
			url: string;
		};
		url: string;
	};
} = {
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

export const mockConfluenceResponse: {
	meta: {
		key: string;
		visibility: string;
		access: string;
		auth: never[];
		definitionId: string;
	};
	data: {
		'schema:commentCount': number;
		'atlassian:reactCount': number;
		generator: {
			'@type': string;
			'@id': string;
			name: string;
		};
		'@context': {
			'@vocab': string;
			atlassian: string;
			schema: string;
		};
		'@type': string[];
		name: string;
		summary: string;
		'schema:potentialAction': {
			'@id': string;
			'@type': string;
			identifier: string;
			name: string;
		};
		attributedTo: {
			'@type': string;
			icon: {
				'@type': string;
				url: string;
			};
			name: string;
		};
		preview: {
			'@type': string;
			href: string;
		};
		image: {
			'@type': string;
			url: string;
		};
		url: string;
	};
} = {
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

export const mockConfluenceResponseWithOwnedBy: {
	meta: {
		key: string;
		visibility: string;
		access: string;
		auth: never[];
		definitionId: string;
	};
	data: {
		'schema:commentCount': number;
		'atlassian:reactCount': number;
		'atlassian:ownedBy': {
			'@type': string;
			icon: {
				'@type': string;
				url: string;
			};
			name: string;
		};
		generator: {
			'@type': string;
			'@id': string;
			name: string;
		};
		'@context': {
			'@vocab': string;
			atlassian: string;
			schema: string;
		};
		'@type': string[];
		name: string;
		summary: string;
		'schema:potentialAction': {
			'@id': string;
			'@type': string;
			identifier: string;
			name: string;
		};
		attributedTo: {
			'@type': string;
			icon: {
				'@type': string;
				url: string;
			};
			name: string;
		};
		preview: {
			'@type': string;
			href: string;
		};
		image: {
			'@type': string;
			url: string;
		};
		url: string;
	};
} = {
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

export const mockCompassResponse: {
	meta: {
		key: string;
		visibility: string;
		access: string;
		auth: never[];
		definitionId: string;
	};
	data: {
		'@context': {
			'@vocab': string;
			atlassian: string;
			schema: string;
		};
		'@type': string[];
		name: string;
		summary: string;
		'schema:potentialAction': {
			'@id': string;
			'@type': string;
			identifier: string;
			name: string;
		};
		attributedTo: {
			'@type': string;
			icon: {
				'@type': string;
				url: string;
			};
			name: string;
		};
		preview: {
			'@type': string;
			href: string;
		};
		image: {
			'@type': string;
			url: string;
		};
		url: string;
	};
} = {
	...mockBaseResponse,
	meta: {
		...mockBaseResponse.meta,
		key: 'dragonfruit-object-provider',
	},
};

export const mockCompassResponseWithOwnedBy: {
	meta: {
		key: string;
		visibility: string;
		access: string;
		auth: never[];
		definitionId: string;
	};
	data: {
		'atlassian:ownedBy': {
			'@type': string;
			icon: string;
			name: string;
		};
		'@context': {
			'@vocab': string;
			atlassian: string;
			schema: string;
		};
		'@type': string[];
		name: string;
		summary: string;
		'schema:potentialAction': {
			'@id': string;
			'@type': string;
			identifier: string;
			name: string;
		};
		attributedTo: {
			'@type': string;
			icon: {
				'@type': string;
				url: string;
			};
			name: string;
		};
		preview: {
			'@type': string;
			href: string;
		};
		image: {
			'@type': string;
			url: string;
		};
		url: string;
	};
} = {
	meta: {
		...mockBaseResponse.meta,
		key: 'dragonfruit-object-provider',
	},
	data: {
		...mockBaseResponse.data,
		'atlassian:ownedBy': {
			'@type': 'Person',
			icon: 'avatar_url',
			name: 'Atnes Ness',
		},
	},
};

export const mockPassionfruitResponse: {
	meta: {
		key: string;
		visibility: string;
		access: string;
		auth: never[];
		definitionId: string;
	};
	data: {
		'@context': {
			'@vocab': string;
			atlassian: string;
			schema: string;
		};
		'@type': string[];
		name: string;
		summary: string;
		'schema:potentialAction': {
			'@id': string;
			'@type': string;
			identifier: string;
			name: string;
		};
		attributedTo: {
			'@type': string;
			icon: {
				'@type': string;
				url: string;
			};
			name: string;
		};
		preview: {
			'@type': string;
			href: string;
		};
		image: {
			'@type': string;
			url: string;
		};
		url: string;
	};
} = {
	...mockBaseResponse,
	meta: {
		...mockBaseResponse.meta,
		key: 'integration-passionfruit-object-provider',
	},
};

export const mockPassionfruitResponseWithOwnedBy: {
	meta: {
		key: string;
		visibility: string;
		access: string;
		auth: never[];
		definitionId: string;
	};
	data: {
		'atlassian:ownedBy': {
			'@type': string;
			icon: string;
			name: string;
		};
		'@context': {
			'@vocab': string;
			atlassian: string;
			schema: string;
		};
		'@type': string[];
		name: string;
		summary: string;
		'schema:potentialAction': {
			'@id': string;
			'@type': string;
			identifier: string;
			name: string;
		};
		attributedTo: {
			'@type': string;
			icon: {
				'@type': string;
				url: string;
			};
			name: string;
		};
		preview: {
			'@type': string;
			href: string;
		};
		image: {
			'@type': string;
			url: string;
		};
		url: string;
	};
} = {
	meta: {
		...mockBaseResponse.meta,
		key: 'integration-passionfruit-object-provider',
	},
	data: {
		...mockBaseResponse.data,
		'atlassian:ownedBy': {
			'@type': 'Person',
			icon: 'avatar_url',
			name: 'Aashna Shah',
		},
	},
};

export const mockCompassResponseWithAppliedToComponentsCount: {
	meta: {
		key: string;
		visibility: string;
		access: string;
		auth: never[];
		definitionId: string;
	};
	data: {
		'atlassian:appliedToComponentsCount': number;
		'@context': {
			'@vocab': string;
			atlassian: string;
			schema: string;
		};
		'@type': string[];
		name: string;
		summary: string;
		'schema:potentialAction': {
			'@id': string;
			'@type': string;
			identifier: string;
			name: string;
		};
		attributedTo: {
			'@type': string;
			icon: {
				'@type': string;
				url: string;
			};
			name: string;
		};
		preview: {
			'@type': string;
			href: string;
		};
		image: {
			'@type': string;
			url: string;
		};
		url: string;
	};
} = {
	meta: {
		...mockBaseResponse.meta,
		key: 'dragonfruit-object-provider',
	},
	data: {
		...mockBaseResponse.data,
		'atlassian:appliedToComponentsCount': 5,
	},
};

export const mockJiraResponse: {
	meta: {
		key: string;
		visibility: string;
		access: string;
		auth: never[];
		definitionId: string;
	};
	data: {
		'atlassian:assignedTo': {
			'@type': string;
			icon: {
				'@type': string;
				url: string;
			};
			name: string;
		};
		updated: string;
		tag: {
			'@type': string;
			appearance: string;
			name: string;
		};
		'@type': string[];
		'atlassian:priority': {
			'@type': string;
			icon: {
				'@type': string;
				url: string;
			};
			name: string;
		};
		generator: {
			'@type': string;
			'@id': string;
			name: string;
		};
		'@context': {
			'@vocab': string;
			atlassian: string;
			schema: string;
		};
		name: string;
		summary: string;
		'schema:potentialAction': {
			'@id': string;
			'@type': string;
			identifier: string;
			name: string;
		};
		attributedTo: {
			'@type': string;
			icon: {
				'@type': string;
				url: string;
			};
			name: string;
		};
		preview: {
			'@type': string;
			href: string;
		};
		image: {
			'@type': string;
			url: string;
		};
		url: string;
	};
} = {
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

export const mockBBFileResponse: {
	meta: {
		key: string;
		visibility: string;
		access: string;
		auth: never[];
		definitionId: string;
	};
	data: {
		'@type': string[];
		'atlassian:updatedBy': {
			'@type': string;
			icon: {
				'@type': string;
				url: string;
			};
			name: string;
		};
		'atlassian:latestCommit': {
			name: string;
			'@type': string;
			summary: string;
		};
		updated: string;
		'@context': {
			'@vocab': string;
			atlassian: string;
			schema: string;
		};
		name: string;
		summary: string;
		'schema:potentialAction': {
			'@id': string;
			'@type': string;
			identifier: string;
			name: string;
		};
		attributedTo: {
			'@type': string;
			icon: {
				'@type': string;
				url: string;
			};
			name: string;
		};
		preview: {
			'@type': string;
			href: string;
		};
		image: {
			'@type': string;
			url: string;
		};
		url: string;
	};
} = {
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
