export const basicTableAdf = {
	version: 1,
	type: 'doc',
	content: [
		{
			type: 'table',
			attrs: {
				isNumberColumnEnabled: false,
				layout: 'default',
			},
			content: [
				{
					type: 'tableRow',
					content: [
						{
							type: 'tableCell',
							content: [
								{
									type: 'paragraph',
									content: [{ type: 'text', text: 'Cell 1' }],
								},
							],
						},
						{
							type: 'tableCell',
							content: [
								{
									type: 'paragraph',
									content: [{ type: 'text', text: 'Cell 2' }],
								},
							],
						},
					],
				},
				{
					type: 'tableRow',
					content: [
						{
							type: 'tableCell',
							content: [
								{
									type: 'paragraph',
									content: [{ type: 'text', text: 'Cell 3' }],
								},
							],
						},
						{
							type: 'tableCell',
							content: [
								{
									type: 'paragraph',
									content: [{ type: 'text', text: 'Cell 4' }],
								},
							],
						},
					],
				},
			],
		},
	],
};

export const nestedTablesInHeaderAndCellAdf = {
	version: 1,
	type: 'doc',
	content: [
		{
			type: 'table',
			attrs: {
				isNumberColumnEnabled: false,
				layout: 'default',
			},
			content: [
				{
					type: 'tableRow',
					content: [
						{
							type: 'tableHeader',
							content: [
								{
									type: 'paragraph',
									content: [{ type: 'text', text: 'Header with nested table:' }],
								},
								{
									type: 'table',
									attrs: {
										isNumberColumnEnabled: false,
										layout: 'default',
									},
									content: [
										{
											type: 'tableRow',
											content: [
												{
													type: 'tableCell',
													content: [
														{
															type: 'paragraph',
															content: [{ type: 'text', text: 'Nested in Header A1' }],
														},
													],
												},
												{
													type: 'tableCell',
													content: [
														{
															type: 'paragraph',
															content: [{ type: 'text', text: 'Nested in Header B1' }],
														},
													],
												},
											],
										},
										{
											type: 'tableRow',
											content: [
												{
													type: 'tableCell',
													content: [
														{
															type: 'paragraph',
															content: [{ type: 'text', text: 'Nested in Header A2' }],
														},
													],
												},
												{
													type: 'tableCell',
													content: [
														{
															type: 'paragraph',
															content: [{ type: 'text', text: 'Nested in Header B2' }],
														},
													],
												},
											],
										},
									],
								},
							],
						},
						{
							type: 'tableHeader',
							content: [
								{
									type: 'paragraph',
									content: [{ type: 'text', text: 'Regular Header' }],
								},
							],
						},
					],
				},
				{
					type: 'tableRow',
					content: [
						{
							type: 'tableCell',
							content: [
								{
									type: 'paragraph',
									content: [{ type: 'text', text: 'Cell with nested table:' }],
								},
								{
									type: 'table',
									attrs: {
										isNumberColumnEnabled: false,
										layout: 'default',
									},
									content: [
										{
											type: 'tableRow',
											content: [
												{
													type: 'tableCell',
													content: [
														{
															type: 'paragraph',
															content: [{ type: 'text', text: 'Nested in Cell X1' }],
														},
													],
												},
												{
													type: 'tableCell',
													content: [
														{
															type: 'paragraph',
															content: [{ type: 'text', text: 'Nested in Cell Y1' }],
														},
													],
												},
											],
										},
									],
								},
							],
						},
						{
							type: 'tableCell',
							content: [
								{
									type: 'paragraph',
									content: [{ type: 'text', text: 'Regular Cell' }],
								},
							],
						},
					],
				},
			],
		},
	],
};

export const tableWithScrollbarAdf = {
	version: 1,
	type: 'doc',
	content: [
		{
			type: 'table',
			attrs: {
				isNumberColumnEnabled: false,
				layout: 'center',
			},
			content: [
				{
					type: 'tableRow',
					content: [
						{
							type: 'tableHeader',
							attrs: {
								colwidth: [48],
							},
							content: [
								{
									type: 'paragraph',
									content: [],
								},
							],
						},
						{
							type: 'tableHeader',
							attrs: {
								colwidth: [48],
							},
							content: [
								{
									type: 'paragraph',
									content: [],
								},
							],
						},
						{
							type: 'tableHeader',
							attrs: {
								colwidth: [48],
							},
							content: [
								{
									type: 'paragraph',
									content: [],
								},
							],
						},
						{
							type: 'tableHeader',
							attrs: {
								colwidth: [48],
							},
							content: [
								{
									type: 'paragraph',
									content: [],
								},
							],
						},
						{
							type: 'tableHeader',
							attrs: {
								colwidth: [48],
							},
							content: [
								{
									type: 'paragraph',
									content: [],
								},
							],
						},
						{
							type: 'tableHeader',
							attrs: {
								colwidth: [48],
							},
							content: [
								{
									type: 'paragraph',
									content: [],
								},
							],
						},
						{
							type: 'tableHeader',
							attrs: {
								colwidth: [48],
							},
							content: [
								{
									type: 'paragraph',
									content: [],
								},
							],
						},
						{
							type: 'tableHeader',
							attrs: {
								colwidth: [48],
							},
							content: [
								{
									type: 'paragraph',
									content: [],
								},
							],
						},
						{
							type: 'tableHeader',
							attrs: {
								colwidth: [48],
							},
							content: [
								{
									type: 'paragraph',
									content: [],
								},
							],
						},
						{
							type: 'tableHeader',
							attrs: {
								colwidth: [48],
							},
							content: [
								{
									type: 'paragraph',
									content: [],
								},
							],
						},
						{
							type: 'tableHeader',
							attrs: {
								colwidth: [48],
							},
							content: [
								{
									type: 'paragraph',
									content: [],
								},
							],
						},
						{
							type: 'tableHeader',
							attrs: {
								colwidth: [48],
							},
							content: [
								{
									type: 'paragraph',
									content: [],
								},
							],
						},
						{
							type: 'tableHeader',
							attrs: {
								colwidth: [48],
							},
							content: [
								{
									type: 'paragraph',
									content: [],
								},
							],
						},
						{
							type: 'tableHeader',
							attrs: {
								colwidth: [48],
							},
							content: [
								{
									type: 'paragraph',
									content: [],
								},
							],
						},
						{
							type: 'tableHeader',
							attrs: {
								colwidth: [48],
							},
							content: [
								{
									type: 'paragraph',
									content: [],
								},
							],
						},
						{
							type: 'tableHeader',
							attrs: {
								colwidth: [200],
							},
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
