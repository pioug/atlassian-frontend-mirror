import { type DocNode, PanelType } from '@atlaskit/adf-schema';

export const ssrTableDoc: DocNode = {
	version: 1,
	type: 'doc',
	content: [
		{
			type: 'paragraph',
			content: [
				{
					type: 'text',
					text: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aenean mi nisl, venenatis eget auctor vitae, venenatis quis lorem. Suspendisse maximus tortor vel dui tincidunt cursus. Vestibulum magna nibh, auctor non auctor id, finibus vitae orci. Nulla viverra ipsum et nunc fringilla ultricies.',
				},
			],
		},
		{
			type: 'table',
			attrs: {
				isNumberColumnEnabled: false,
				layout: 'wide',
			},
			content: [
				{
					type: 'tableRow',
					content: [
						{
							type: 'tableHeader',
							attrs: {
								colwidth: [1421],
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
								colwidth: [256],
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
				{
					type: 'tableRow',
					content: [
						{
							type: 'tableCell',
							attrs: {
								colwidth: [1421],
							},
							content: [
								{
									type: 'paragraph',
									content: [
										{
											type: 'text',
											text: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aenean mi nisl, venenatis eget auctor vitae, venenatis quis lorem. Suspendisse maximus tortor vel dui tincidunt cursus.',
										},
									],
								},
							],
						},
						{
							type: 'tableCell',
							attrs: {
								colwidth: [48],
							},
							content: [
								{
									type: 'codeBlock',
									attrs: {
										language: 'arduino',
									},
									content: [
										{
											type: 'text',
											text: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aenean mi nisl, venenatis eget auctor vitae, venenatis quis lorem.',
										},
									],
								},
							],
						},
						{
							type: 'tableCell',
							attrs: {
								colwidth: [256],
							},
							content: [
								{
									type: 'paragraph',
									content: [
										{
											type: 'text',
											text: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aenean mi nisl, venenatis eget auctor vitae, venenatis quis lorem. ',
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
							attrs: {
								colwidth: [1421],
							},
							content: [
								{
									type: 'paragraph',
									content: [],
								},
							],
						},
						{
							type: 'tableCell',
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
							type: 'tableCell',
							attrs: {
								colwidth: [256],
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
		{
			type: 'paragraph',
			content: [
				{
					type: 'text',
					text: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aenean mi nisl, venenatis eget auctor vitae, venenatis quis lorem. Suspendisse maximus tortor vel dui tincidunt cursus. Vestibulum magna nibh, auctor non auctor id, finibus vitae orci. Nulla viverra ipsum et nunc fringilla ultricies.',
				},
			],
		},
		{
			type: 'table',
			attrs: {
				isNumberColumnEnabled: false,
				layout: 'full-width',
			},
			content: [
				{
					type: 'tableRow',
					content: [
						{
							type: 'tableHeader',
							attrs: {
								colwidth: [1421],
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
								colwidth: [256],
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
				{
					type: 'tableRow',
					content: [
						{
							type: 'tableCell',
							attrs: {
								colwidth: [1421],
							},
							content: [
								{
									type: 'paragraph',
									content: [
										{
											type: 'text',
											text: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aenean mi nisl, venenatis eget auctor vitae, venenatis quis lorem. Suspendisse maximus tortor vel dui tincidunt cursus. Vestibulum magna nibh, auctor non auctor id, finibus vitae orci. Nulla viverra ipsum et nunc fringilla ultricies. Pellentesque vitae felis molestie justo finibus accumsan. Suspendisse potenti. Nulla facilisi. Integer dignissim quis velit quis elementum. Sed sit amet varius ante. Duis vestibulum porta augue eu laoreet. Morbi id risus et augue sollicitudin aliquam. In et ligula dolor. Nam ac aliquet diam.',
										},
									],
								},
							],
						},
						{
							type: 'tableCell',
							attrs: {
								colwidth: [48],
							},
							content: [
								{
									type: 'codeBlock',
									attrs: {
										language: 'arduino',
									},
									content: [
										{
											type: 'text',
											text: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aenean mi nisl, venenatis eget auctor vitae, venenatis quis lorem.',
										},
									],
								},
							],
						},
						{
							type: 'tableCell',
							attrs: {
								colwidth: [256],
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
					type: 'tableRow',
					content: [
						{
							type: 'tableCell',
							attrs: {
								colwidth: [1421],
							},
							content: [
								{
									type: 'paragraph',
									content: [],
								},
							],
						},
						{
							type: 'tableCell',
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
							type: 'tableCell',
							attrs: {
								colwidth: [256],
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
		{
			type: 'paragraph',
			content: [
				{
					type: 'text',
					text: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aenean mi nisl, venenatis eget auctor vitae, venenatis quis lorem. Suspendisse maximus tortor vel dui tincidunt cursus. Vestibulum magna nibh, auctor non auctor id, finibus vitae orci. Nulla viverra ipsum et nunc fringilla ultricies.',
				},
			],
		},
	],
};

export const ssrCodeBlockDoc: DocNode = {
	version: 1,
	type: 'doc',
	content: [
		{
			type: 'codeBlock',
			attrs: {
				language: 'arduino',
			},
			content: [
				{
					type: 'text',
					text: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aenean mi nisl, venenatis eget auctor vitae, venenatis quis lorem. Suspendisse maximus tortor vel dui tincidunt cursus. Vestibulum magna nibh, auctor non auctor id, finibus vitae orci. Nulla viverra ipsum et nunc fringilla ultricies. Pellentesque vitae felis molestie justo finibus accumsan. Suspendisse potenti. Nulla facilisi. Integer dignissim quis velit quis elementum. Sed sit amet varius ante. Duis vestibulum porta augue eu laoreet. Morbi id risus et augue sollicitudin aliquam. In et ligula dolor. Nam ac aliquet diam.',
				},
			],
			marks: [
				{
					type: 'breakout',
					attrs: {
						mode: 'full-width',
					},
				},
			],
		},
		{
			type: 'paragraph',
			content: [
				{
					type: 'text',
					text: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aenean mi nisl, venenatis eget auctor vitae, venenatis quis lorem. Suspendisse maximus tortor vel dui tincidunt cursus. Vestibulum magna nibh, auctor non auctor id, finibus vitae orci. Nulla viverra ipsum et nunc fringilla ultricies.',
				},
			],
		},
		{
			type: 'codeBlock',
			attrs: {
				language: 'arduino',
			},
			content: [
				{
					type: 'text',
					text: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aenean mi nisl, venenatis eget auctor vitae, venenatis quis lorem. Suspendisse maximus tortor vel dui tincidunt cursus. Vestibulum magna nibh, auctor non auctor id, finibus vitae orci. Nulla viverra ipsum et nunc fringilla ultricies. Pellentesque vitae felis molestie justo finibus accumsan. Suspendisse potenti. Nulla facilisi. Integer dignissim quis velit quis elementum. Sed sit amet varius ante. Duis vestibulum porta augue eu laoreet. Morbi id risus et augue sollicitudin aliquam. In et ligula dolor. Nam ac aliquet diam.',
				},
			],
			marks: [
				{
					type: 'breakout',
					attrs: {
						mode: 'wide',
					},
				},
			],
		},
	],
};

export const ssrLayoutDoc: DocNode = {
	version: 1,
	type: 'doc',
	content: [
		{
			type: 'paragraph',
			content: [
				{
					type: 'text',
					text: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aenean mi nisl, venenatis eget auctor vitae, venenatis quis lorem.',
				},
			],
		},
		{
			type: 'layoutSection',
			content: [
				{
					type: 'layoutColumn',
					attrs: {
						width: 33.33,
					},
					content: [
						{
							type: 'paragraph',
							content: [
								{
									type: 'text',
									text: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aenean mi nisl, venenatis eget auctor vitae, venenatis quis lorem.',
								},
							],
						},
					],
				},
				{
					type: 'layoutColumn',
					attrs: {
						width: 33.33,
					},
					content: [
						{
							type: 'codeBlock',
							attrs: {},
							content: [
								{
									type: 'text',
									text: 'Code (O.o)',
								},
							],
						},
					],
				},
				{
					type: 'layoutColumn',
					attrs: {
						width: 33.33,
					},
					content: [
						{
							type: 'panel',
							attrs: {
								panelType: PanelType.INFO,
							},
							content: [
								{
									type: 'paragraph',
									content: [
										{
											type: 'text',
											text: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aenean mi nisl, venenatis eget auctor vitae, venenatis quis lorem.',
										},
									],
								},
							],
						},
					],
				},
			],
			marks: [
				{
					type: 'breakout',
					attrs: {
						mode: 'wide',
					},
				},
			],
		},
		{
			type: 'paragraph',
			content: [
				{
					type: 'text',
					text: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aenean mi nisl, venenatis eget auctor vitae, venenatis quis lorem. Suspendisse maximus tortor vel dui tincidunt cursus. Vestibulum magna nibh, auctor non auctor id, finibus vitae orci. Nulla viverra ipsum et nunc fringilla ultricies.',
				},
			],
		},
		{
			type: 'layoutSection',
			content: [
				{
					type: 'layoutColumn',
					attrs: {
						width: 33.33,
					},
					content: [
						{
							type: 'paragraph',
							content: [
								{
									type: 'text',
									text: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aenean mi nisl, venenatis eget auctor vitae, venenatis quis lorem.',
								},
							],
						},
					],
				},
				{
					type: 'layoutColumn',
					attrs: {
						width: 33.33,
					},
					content: [
						{
							type: 'codeBlock',
							attrs: {},
							content: [
								{
									type: 'text',
									text: 'Code (O.o)',
								},
							],
						},
					],
				},
				{
					type: 'layoutColumn',
					attrs: {
						width: 33.33,
					},
					content: [
						{
							type: 'panel',
							attrs: {
								panelType: PanelType.INFO,
							},
							content: [
								{
									type: 'paragraph',
									content: [
										{
											type: 'text',
											text: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aenean mi nisl, venenatis eget auctor vitae, venenatis quis lorem.',
										},
									],
								},
							],
						},
					],
				},
			],
			marks: [
				{
					type: 'breakout',
					attrs: {
						mode: 'full-width',
					},
				},
			],
		},
	],
};

export const ssrExpandDoc: DocNode = {
	version: 1,
	type: 'doc',
	content: [
		{
			type: 'expand',
			attrs: {
				title: 'Hello',
			},
			content: [
				{
					type: 'paragraph',
					content: [
						{
							type: 'text',
							text: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aenean mi nisl, venenatis eget auctor vitae, venenatis quis lorem. Suspendisse maximus tortor vel dui tincidunt cursus. Vestibulum magna nibh, auctor non auctor id, finibus vitae orci. Nulla viverra ipsum et nunc fringilla ultricies. Pellentesque vitae felis molestie justo finibus accumsan. Suspendisse potenti. Nulla facilisi. Integer dignissim quis velit quis elementum. Sed sit amet varius ante. Duis vestibulum porta augue eu laoreet. Morbi id risus et augue sollicitudin aliquam. In et ligula dolor. Nam ac aliquet diam.',
						},
					],
				},
				{
					type: 'codeBlock',
					attrs: {
						language: 'arduino',
					},
					content: [
						{
							type: 'text',
							text: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aenean mi nisl, venenatis eget auctor vitae, venenatis quis lorem. Suspendisse maximus tortor vel dui tincidunt cursus. Vestibulum magna nibh, auctor non auctor id, finibus vitae orci. Nulla viverra ipsum et nunc fringilla ultricies. Pellentesque vitae felis molestie justo finibus accumsan. Suspendisse potenti. Nulla facilisi. Integer dignissim quis velit quis elementum. Sed sit amet varius ante. Duis vestibulum porta augue eu laoreet. Morbi id risus et augue sollicitudin aliquam. In et ligula dolor. Nam ac aliquet diam.',
						},
					],
				},
				{
					type: 'paragraph',
					content: [
						{
							type: 'text',
							text: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aenean mi nisl, venenatis eget auctor vitae, venenatis quis lorem. ',
						},
					],
				},
			],
			marks: [
				{
					type: 'breakout',
					attrs: {
						mode: 'full-width',
					},
				},
			],
		},
		{
			type: 'paragraph',
			content: [
				{
					type: 'text',
					text: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aenean mi nisl, venenatis eget auctor vitae, venenatis quis lorem. Suspendisse maximus tortor vel dui tincidunt cursus. Vestibulum magna nibh, auctor non auctor id, finibus vitae orci. Nulla viverra ipsum et nunc fringilla ultricies.',
				},
			],
		},
	],
};
