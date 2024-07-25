export const justText = {
	version: 1,
	type: 'doc',
	content: [
		{
			type: 'paragraph',
			content: [
				{
					type: 'text',
					text: 'Lorem ipsum',
					marks: [],
				},
			],
		},
		{
			type: 'paragraph',
			content: [
				{
					type: 'text',
					text: 'Second ipsum',
					marks: [],
				},
			],
		},
	],
};

export const viewModeBlockAdf = {
	version: 1,
	type: 'doc',
	content: [
		{
			type: 'paragraph',
			content: [
				{
					type: 'text',
					text: ' ',
				},
			],
		},
		{
			type: 'blockCard',
			attrs: {
				data: {
					'@context': 'https://www.w3.org/ns/activitystreams',
					'@type': 'Document',
					name: 'Welcome to Atlassian!',
					url: 'http://www.atlassian.com',
					generator: {
						icon: 'https://wac-cdn.atlassian.com/assets/img/favicons/atlassian/favicon.png',
					},
					summary: "Recently, we've been talking to Tesla about how they use JIRA. Read on!",
				},
			},
		},
	],
};

export const viewModeHyperlinkAdf = {
	version: 1,
	type: 'doc',
	content: [
		{
			type: 'paragraph',
			content: [
				{
					type: 'text',
					text: 'http://atlassian.com',
					marks: [
						{
							type: 'link',
							attrs: {
								href: 'http://atlassian.com',
							},
						},
					],
				},
			],
		},
	],
};
