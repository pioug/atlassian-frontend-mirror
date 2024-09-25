import { type DocNode, PanelType } from '@atlaskit/adf-schema';

export const paragraphAdf: DocNode = {
	version: 1,
	type: 'doc',
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
					text: 'Donec sollicitudin odio ante, sed tempor leo pharetra in.',
				},
			],
		},
	],
};

export const blockquoteAdf: DocNode = {
	version: 1,
	type: 'doc',
	content: [
		{
			type: 'blockquote',
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
			],
		},
		{
			type: 'blockquote',
			content: [
				{
					type: 'paragraph',
					content: [
						{
							type: 'text',
							text: 'Donec sollicitudin odio ante, sed tempor leo pharetra in.',
						},
					],
				},
			],
		},
	],
};

export const decisionListAdf: DocNode = {
	version: 1,
	type: 'doc',
	content: [
		{
			type: 'decisionList',
			attrs: {
				localId: '95e1cd49-63f4-4203-951e-4c454a635335',
			},
			content: [
				{
					type: 'decisionItem',
					attrs: {
						localId: 'a90f24eb-a156-4ade-905d-9f2594b66822',
						state: 'DECIDED',
					},
					content: [
						{
							type: 'text',
							text: 'Interesting. No, wait, the other thing: tedious. ',
						},
					],
				},
			],
		},
		{
			type: 'decisionList',
			attrs: {
				localId: '95e1cd49-63f4-4203-951e-4c454a635336',
			},
			content: [
				{
					type: 'decisionItem',
					attrs: {
						localId: 'a90f24eb-a156-4ade-905d-9f2594b66823',
						state: 'DECIDED',
					},
					content: [
						{
							type: 'text',
							text: 'Interesting. No, wait, the other thing: tedious. ',
						},
					],
				},
			],
		},
	],
};

export const taskListAdf: DocNode = {
	version: 1,
	type: 'doc',
	content: [
		{
			type: 'taskList',
			attrs: {
				localId: '1986f204-1ec7-439d-b0da-d55534de5fd2',
			},
			content: [
				{
					type: 'taskItem',
					attrs: {
						localId: 'bbfc2bfe-a8bf-4e39-9541-baf76dd7657d',
						state: 'TODO',
					},
					content: [
						{
							type: 'text',
							text: 'Good news, everyone! ',
						},
					],
				},
			],
		},
		{
			type: 'taskList',
			attrs: {
				localId: '1986f204-1ec7-439d-b0da-d55534de5fd2',
			},
			content: [
				{
					type: 'taskItem',
					attrs: {
						localId: 'bbfc2bfe-a8bf-4e39-9541-baf76dd7657d',
						state: 'TODO',
					},
					content: [
						{
							type: 'text',
							text: 'Good news, everyone! ',
						},
					],
				},
			],
		},
	],
};

export const bulletListAdf: DocNode = {
	version: 1,
	type: 'doc',
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
									text: 'Why, those are the Grunka-Lunkas! ',
								},
							],
						},
					],
				},
			],
		},
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
									text: 'Why, those are the Grunka-Lunkas! ',
								},
							],
						},
					],
				},
			],
		},
	],
};

export const panelAdf: DocNode = {
	version: 1,
	type: 'doc',
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
							text: 'Bender, this is',
						},
					],
				},
			],
		},
		{
			type: 'panel',
			attrs: {
				panelType: PanelType.SUCCESS,
			},
			content: [
				{
					type: 'paragraph',
					content: [
						{
							type: 'text',
							text: 'Bender, this is',
						},
					],
				},
			],
		},
	],
};

export const codeBlockAdf: DocNode = {
	version: 1,
	type: 'doc',
	content: [
		{
			type: 'codeBlock',
			attrs: {
				language: 'javascript',
			},
			content: [
				{
					type: 'text',
					text: '// Create a map.\nfinal IntIntOpenHashMap map = new IntIntOpenHashMap();\nmap.put(1, 2);\nmap.put(2, 5);\nmap.put(3, 10);',
				},
			],
		},
		{
			type: 'codeBlock',
			attrs: {
				language: 'javascript',
			},
			content: [
				{
					type: 'text',
					text: '// Create a map.\nfinal IntIntOpenHashMap map = new IntIntOpenHashMap();\nmap.put(1, 2);\nmap.put(2, 5);\nmap.put(3, 10);',
				},
			],
		},
	],
};

export const headingNodeAdf: DocNode = {
	version: 1,
	type: 'doc',
	content: [
		{
			type: 'heading',
			attrs: {
				level: 1,
			},
			content: [
				{
					type: 'text',
					text: 'Heading 1',
				},
			],
		},
		{
			type: 'heading',
			attrs: {
				level: 1,
			},
			content: [
				{
					type: 'text',
					text: 'Heading 1',
					marks: [
						{
							type: 'link',
							attrs: {
								href: 'www.atlassian.com',
							},
						},
					] as const,
				},
			],
		},
	],
};

export const ruleNodeAdf: DocNode = {
	version: 1,
	type: 'doc',
	content: [
		{
			type: 'rule',
		},
		{
			type: 'rule',
		},
	],
};

export const expandAdf = {
	version: 1,
	type: 'doc',
	content: [
		{
			type: 'expand',
			attrs: { title: 'beep' },
			content: [{ type: 'paragraph', content: [{ type: 'text', text: 'boop' }] }],
		},
		{
			type: 'expand',
			attrs: { title: 'beep 2' },
			content: [{ type: 'paragraph', content: [{ type: 'text', text: 'boop' }] }],
		},
	],
};

export const layoutAndBigParagraphs = {
	version: 1,
	type: 'doc',
	content: [
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
									text: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aenean mi nisl, venenatis eget auctor vitae, venenatis quis lorem. Suspendisse maximus tortor vel dui tincidunt cursus. Vestibulum magna nibh, auctor non auctor id, finibus vitae orci. Nulla viverra ipsum et nunc fringilla ultricies. Pellentesque vitae felis molestie justo finibus accumsan. Suspendisse potenti. Nulla facilisi. Integer dignissim quis velit quis elementum. Sed sit amet varius ante. Duis vestibulum porta augue eu laoreet. Morbi id risus et augue sollicitudin aliquam. In et ligula dolor. Nam ac aliquet diam.',
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
							content: [],
						},
					],
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
									text: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aenean mi nisl, venenatis eget auctor vitae, venenatis quis lorem. Suspendisse maximus tortor vel dui tincidunt cursus. Vestibulum magna nibh, auctor non auctor id, finibus vitae orci. Nulla viverra ipsum et nunc fringilla ultricies. Pellentesque vitae felis molestie justo finibus accumsan. Suspendisse potenti. Nulla facilisi. Integer dignissim quis velit quis elementum. Sed sit amet varius ante. Duis vestibulum porta augue eu laoreet. Morbi id risus et augue sollicitudin aliquam. In et ligula dolor. Nam ac aliquet diam.',
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
							content: [],
						},
					],
				},
			],
		},
	],
};

export const embedCardAdf = {
	version: 1,
	type: 'doc',
	content: [
		{
			type: 'embedCard',
			attrs: {
				url: 'https://product-fabric.atlassian.net/wiki/spaces/E/overview',
				layout: 'center',
				width: 768,
			},
		},
		{
			type: 'embedCard',
			attrs: {
				url: 'https://product-fabric.atlassian.net/wiki/spaces/E/overview',
				layout: 'center',
				width: 768,
			},
		},
	],
};

export const blockCardAdf = {
	version: 1,
	type: 'doc',
	content: [
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
				},
			},
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
				},
			},
		},
	],
};

export const mediaSingleAdf = {
	version: 1,
	type: 'doc',
	content: [
		{
			type: 'mediaSingle',
			attrs: {
				width: null,
				layout: 'center',
			},
			content: [
				{
					type: 'media',
					attrs: {
						type: 'file',
						collection: 'MediaServicesSample',
						id: 'a559980d-cd47-43e2-8377-27359fcb905f',
						width: 500,
						height: 374,
					},
				},
			],
		},
		{
			type: 'mediaSingle',
			attrs: {
				width: null,
				layout: 'center',
			},
			content: [
				{
					type: 'media',
					attrs: {
						type: 'file',
						collection: 'MediaServicesSample',
						id: 'a559980d-cd47-43e2-8377-27359fcbadsf',
						width: 300,
						height: 200,
					},
				},
			],
		},
	],
};

export const mediaGroupAdf = {
	type: 'doc',
	version: 1,
	content: [
		{
			type: 'mediaGroup',
			content: [
				{
					type: 'media',
					attrs: {
						id: '6c160aba-2294-4a1e-a793-33b002267735',
						type: 'file',
						collection: 'MediaServicesSample',
					},
				},
			],
		},
		{
			type: 'mediaGroup',
			content: [
				{
					type: 'media',
					attrs: {
						id: '6c160aba-2294-4a1e-a793-33b002261234',
						type: 'file',
						collection: 'MediaServicesSample',
					},
				},
			],
		},
	],
};

export const bodiedExtensionAdf: DocNode = {
	version: 1,
	type: 'doc',
	content: [
		{
			type: 'bodiedExtension',
			attrs: {
				extensionType: 'com.atlassian.confluence.macro.core',
				extensionKey: 'bodied-eh',
				parameters: {
					macroParams: {},
					macroMetadata: {
						placeholder: [
							{
								data: {
									url: '',
								},
								type: 'icon',
							},
						],
					},
				},
				layout: 'full-width',
				localId: '6664a572-b036-4743-9b91-b0eae2b04830',
			},
			content: [
				{
					type: 'paragraph',
					content: [],
				},
			],
		},
		{
			type: 'bodiedExtension',
			attrs: {
				extensionType: 'com.atlassian.confluence.macro.core',
				extensionKey: 'bodied-eh',
				parameters: {
					macroParams: {},
					macroMetadata: {
						placeholder: [
							{
								data: {
									url: '',
								},
								type: 'icon',
							},
						],
					},
				},
				layout: 'full-width',
				localId: '6664a572-b036-4743-9b91-b0eae2b01234',
			},
			content: [
				{
					type: 'paragraph',
					content: [],
				},
			],
		},
	],
};

export const extensionAdf: DocNode = {
	version: 1,
	type: 'doc',
	content: [
		{
			type: 'extension',
			attrs: {
				extensionType: 'com.atlassian.forge',
				extensionKey: 'awesome:list',
				parameters: {
					items: ['a', 'b', 'c', 'd'],
				},
				layout: 'wide',
				localId: '3ffbc438-e0e4-4ade-bf5c-e4b0098def2b',
			},
		},
		{
			type: 'extension',
			attrs: {
				extensionType: 'com.atlassian.forge',
				extensionKey: 'awesome:list',
				parameters: {
					items: ['a', 'b', 'c', 'd'],
				},
				layout: 'wide',
				localId: '3ffbc438-e0e4-4ade-bf5c-e4b00981234',
			},
		},
	],
};

export const tableAdf = {
	version: 1,
	type: 'doc',
	content: [
		{
			type: 'table',
			attrs: {
				isNumberColumnEnabled: false,
				layout: 'default',
				localId: '1030dece-a85b-4e66-809c-0c796e483c0b',
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
									type: 'paragraph',
									content: [],
								},
							],
						},
						{
							type: 'tableHeader',
							attrs: {},
							content: [
								{
									type: 'paragraph',
									content: [],
								},
							],
						},
						{
							type: 'tableHeader',
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
		{
			type: 'table',
			attrs: {
				isNumberColumnEnabled: false,
				layout: 'default',
				localId: '1030dece-a85b-4e66-809c-0c796e483c0b',
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
									type: 'paragraph',
									content: [],
								},
							],
						},
						{
							type: 'tableHeader',
							attrs: {},
							content: [
								{
									type: 'paragraph',
									content: [],
								},
							],
						},
						{
							type: 'tableHeader',
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
