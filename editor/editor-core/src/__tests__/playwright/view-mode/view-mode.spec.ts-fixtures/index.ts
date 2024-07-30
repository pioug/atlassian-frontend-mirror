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

export const viewModeEmbedAdf = {
	version: 1,
	type: 'doc',
	content: [
		{
			type: 'embedCard',
			attrs: {
				url: 'https://www.loom.com/share/a46f8b2f41684b498e880893bf3837c5',
				layout: 'center',
				width: 66.66666666666666,
			},
		},
	],
};
