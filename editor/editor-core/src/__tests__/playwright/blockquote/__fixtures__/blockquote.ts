export const blockquoteAdf = {
	version: 1,
	type: 'doc',
	content: [
		{
			type: 'blockquote',
			content: [
				{
					type: 'paragraph',
					content: [],
				},
			],
		},
	],
};

export const blockquoteInsideTableAdf = {
	version: 1,
	type: 'doc',
	content: [
		{
			type: 'table',
			attrs: {
				isNumberColumnEnabled: false,
				layout: 'default',
				localId: 'abc',
			},
			content: [
				{
					type: 'tableRow',
					content: [
						{
							type: 'tableCell',
							attrs: {},
							content: [
								{
									type: 'blockquote',
									content: [
										{
											type: 'paragraph',
											content: [],
										},
									],
								},
							],
						},
						{
							type: 'tableCell',
							attrs: {},
							content: [
								{
									type: 'paragraph',
									content: [],
								},
							],
						},
					],
				},
			],
		},
	],
};

export const blockquoteInsideExpandAdf = {
	version: 1,
	type: 'doc',
	content: [
		{
			type: 'expand',
			attrs: {
				title: '',
			},
			content: [
				{
					type: 'blockquote',
					content: [
						{
							type: 'paragraph',
							content: [
								{
									type: 'text',
									text: 'abcd',
								},
							],
						},
						{
							type: 'paragraph',
							content: [],
						},
					],
				},
			],
		},
	],
};
