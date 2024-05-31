export const helloEmojiAdf = {
	version: 1,
	type: 'doc',
	content: [
		{
			type: 'paragraph',
			content: [
				{
					type: 'emoji',
					attrs: {
						shortName: ':not-an-emoji:',
						id: '',
						text: '',
					},
				},
				{
					type: 'text',
					text: 'hello ',
				},
			],
		},
	],
};

export const helloAdf = {
	type: 'doc',
	version: 1,
	content: [
		{
			type: 'paragraph',
			content: [
				{
					type: 'text',
					text: 'Hello, World',
				},
			],
		},
	],
};

export const loremLoremAdf = {
	type: 'doc',
	version: 1,
	content: [
		{
			type: 'paragraph',
			content: [
				{
					type: 'text',
					text: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
				},
			],
		},
		{
			type: 'paragraph',
			content: [
				{
					type: 'text',
					text: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
				},
			],
		},
	],
};

export const decisionListAdf = {
	version: 1,
	type: 'doc',
	content: [
		{
			type: 'decisionList',
			attrs: {
				localId: '60c54e29-6f7f-41be-9c05-fa36850017de',
			},
			content: [
				{
					type: 'decisionItem',
					attrs: {
						localId: '5d2bbe43-1ccb-44f4-82d5-2687af1c0711',
						state: 'DECIDED',
					},
					content: [
						{
							type: 'text',
							text: 'Decision Item',
						},
					],
				},
			],
		},
		{
			type: 'paragraph',
			content: [
				{
					type: 'text',
					text: 'End',
				},
			],
		},
	],
};

export const taskListAdf = {
	version: 1,
	type: 'doc',
	content: [
		{
			type: 'taskList',
			attrs: {
				localId: '9d733924-c4a6-4290-a507-3d8be4aacd9b',
			},
			content: [
				{
					type: 'taskItem',
					attrs: {
						localId: 'e580c4d0-4a27-43a0-8321-f52d16f7d788',
						state: 'TODO',
					},
					content: [
						{
							type: 'text',
							text: 'Task Item ',
						},
					],
				},
			],
		},
		{
			type: 'paragraph',
			content: [
				{
					type: 'text',
					text: 'End',
				},
			],
		},
	],
};

export const bigNestedAdf = {
	version: 1,
	type: 'doc',
	content: [
		{
			type: 'paragraph',
			content: [
				{
					type: 'text',
					text: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aenean mi nisl, venenatis eget auctor vitae, venenatis quis lorem. Suspendisse maximus tortor vel dui tincidunt cursus. ',
				},
			],
		},
		{
			type: 'layoutSection',
			content: [
				{
					type: 'layoutColumn',
					attrs: {
						width: 50,
					},
					content: [
						{
							type: 'paragraph',
							content: [
								{
									type: 'text',
									text: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aenean mi nisl, venenatis eget auctor vitae, venenatis quis lorem. Suspendisse maximus tortor vel dui tincidunt cursus. ',
								},
							],
						},
					],
				},
				{
					type: 'layoutColumn',
					attrs: {
						width: 50,
					},
					content: [
						{
							type: 'paragraph',
							content: [
								{
									type: 'text',
									text: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aenean mi nisl, venenatis eget auctor vitae, venenatis quis lorem. Suspendisse maximus tortor vel dui tincidunt cursus. ',
								},
							],
						},
					],
				},
			],
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
							type: 'tableHeader',
							attrs: {},
							content: [
								{
									type: 'heading',
									attrs: {
										level: 1,
									},
									content: [
										{
											type: 'text',
											text: 'Big heading inside this table!',
										},
									],
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
							attrs: {},
							content: [
								{
									type: 'panel',
									attrs: {
										panelType: 'info',
									},
									content: [
										{
											type: 'bulletList',
											content: [
												{
													type: 'listItem',
													content: [
														{
															type: 'paragraph',
															content: [
																{
																	type: 'text',
																	text: 'Hello',
																},
															],
														},
													],
												},
												{
													type: 'listItem',
													content: [
														{
															type: 'paragraph',
															content: [
																{
																	type: 'text',
																	text: 'World',
																},
															],
														},
													],
												},
											],
										},
										{
											type: 'orderedList',
											content: [
												{
													type: 'listItem',
													content: [
														{
															type: 'paragraph',
															content: [
																{
																	type: 'text',
																	text: 'Hello',
																},
															],
														},
													],
												},
												{
													type: 'listItem',
													content: [
														{
															type: 'paragraph',
															content: [
																{
																	type: 'text',
																	text: 'World',
																},
															],
														},
													],
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
					type: 'tableRow',
					content: [
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

export const helloMateEmojiAdf = {
	version: 1,
	type: 'doc',
	content: [
		{
			type: 'paragraph',
			content: [
				{
					type: 'text',
					text: 'hello ',
				},
				{
					type: 'emoji',
					attrs: {
						shortName: ':cactus:',
						id: '1f335',
						text: '🌵',
					},
				},
				{
					type: 'text',
					text: ' mate',
				},
			],
		},
	],
};
