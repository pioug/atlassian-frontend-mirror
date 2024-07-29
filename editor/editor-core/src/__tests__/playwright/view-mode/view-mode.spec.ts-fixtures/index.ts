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
				url: 'http://www.atlassian.com',
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
