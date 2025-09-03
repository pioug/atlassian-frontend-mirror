import type { DataConsumerDefinition, DocNode } from '@atlaskit/adf-schema';

export const inlineExtensionAdf: DocNode = {
	version: 1,
	type: 'doc',
	content: [
		{
			type: 'paragraph',
			content: [
				{
					text: 'hello!',
					type: 'text',
				},
				{
					type: 'inlineExtension',
					attrs: {
						extensionType: 'com.atlassian.confluence.macro.core',
						extensionKey: 'inline-eh',
						localId: 'a08ec99d-835d-4cfa-8c7f-9114ec265738',
						text: 'Inline extension demo',
					},
				},
				{
					type: 'text',
					text: 'goodbye!',
				},
			],
		},
	],
};

export const inlineExtensionPlainTextMacroAdfLongText: DocNode = {
	version: 1,
	type: 'doc',
	content: [
		{
			type: 'paragraph',
			content: [
				{
					type: 'text',
					text: 'hello!',
				},
				{
					type: 'inlineExtension',
					attrs: {
						extensionType: 'com.atlassian.confluence.macro.core',
						extensionKey: 'inline-eh',
						localId: 'a08ec99d-835d-4cfa-8c7f-9114ec265738',
						parameters: {
							macroParams: {
								__bodyContent:
									'Inline extension with plain text macro, and very very very very very very very very very very very very very very very very very very very very very long text.',
							},
						},
					},
				},
				{
					type: 'text',
					text: 'goodbye!',
				},
			],
		},
	],
};

export const inlineExtensionPlainTextMacroAdf: DocNode = {
	version: 1,
	type: 'doc',
	content: [
		{
			type: 'paragraph',
			content: [
				{
					type: 'text',
					text: 'hello!',
				},
				{
					type: 'inlineExtension',
					attrs: {
						extensionType: 'com.atlassian.confluence.macro.core',
						extensionKey: 'inline-eh',
						localId: 'a08ec99d-835d-4cfa-8c7f-9114ec265738',
						parameters: {
							macroParams: {
								__bodyContent: 'Inline extension with plain text macro',
							},
						},
					},
				},
				{
					type: 'text',
					text: 'goodbye!',
				},
			],
		},
	],
};

export const extensionBlockEh: DocNode = {
	version: 1,
	type: 'doc',
	content: [
		{
			type: 'extension',
			attrs: {
				extensionType: 'com.atlassian.confluence.macro.core',
				extensionKey: 'block-eh',
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
				text: 'Block extension demo',
				layout: 'default',
			},
		},
		{
			type: 'extension',
			attrs: {
				extensionType: 'com.atlassian.confluence.macro.core',
				extensionKey: 'block-eh',
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
				text: 'Block extension demo',
				layout: 'wide',
			},
		},
		{
			type: 'extension',
			attrs: {
				extensionType: 'com.atlassian.confluence.macro.core',
				extensionKey: 'block-eh',
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
				text: 'Block extension demo',
				layout: 'full-width',
			},
		},
	],
};

export const extensionAwesomeList: DocNode = {
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
				layout: 'default',
			},
			marks: [
				{
					type: 'dataConsumer',
					attrs: {
						sources: ['132017fa-dcdd-4c9f-80e7-9fefbde3974f'],
					},
				},
			] as DataConsumerDefinition[],
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
			},
			marks: [
				{
					type: 'dataConsumer',
					attrs: {
						sources: ['132017fa-dcdd-4c9f-80e7-9fefbde3974f'],
					},
				},
			] as DataConsumerDefinition[],
		},
		{
			type: 'extension',
			attrs: {
				extensionType: 'com.atlassian.forge',
				extensionKey: 'awesome:list',
				parameters: {
					items: ['a', 'b', 'c', 'd'],
				},
				layout: 'full-width',
			},
			marks: [
				{
					type: 'dataConsumer',
					attrs: {
						sources: ['132017fa-dcdd-4c9f-80e7-9fefbde3974f'],
					},
				},
			] as DataConsumerDefinition[],
		},
	],
};

export const extensionsWithinTable: DocNode = {
	version: 1,
	type: 'doc',
	content: [
		{
			type: 'table',
			attrs: {
				isNumberColumnEnabled: false,
				layout: 'wide',
				localId: 'af1827d9-7149-4022-85d5-beeb08247bb8',
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
									type: 'paragraph',
									content: [
										{
											type: 'text',
											text: 'normal without data provider',
										},
									],
								},
								{
									type: 'extension',
									attrs: {
										extensionType: 'com.atlassian.confluence.macro.core',
										extensionKey: 'block-eh',
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
										text: 'Block extension demo',
										layout: 'default',
									},
								},
							],
						},
						{
							type: 'tableCell',
							attrs: {},
							content: [
								{
									type: 'paragraph',
									content: [
										{
											type: 'text',
											text: 'wide without data provider',
										},
									],
								},
								{
									type: 'extension',
									attrs: {
										extensionType: 'com.atlassian.confluence.macro.core',
										extensionKey: 'block-eh',
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
										text: 'Block extension demo',
										layout: 'wide',
									},
								},
							],
						},
						{
							type: 'tableCell',
							attrs: {},
							content: [
								{
									type: 'paragraph',
									content: [
										{
											type: 'text',
											text: 'full-width without data provider',
										},
									],
								},
								{
									type: 'extension',
									attrs: {
										extensionType: 'com.atlassian.confluence.macro.core',
										extensionKey: 'block-eh',
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
										text: 'Block extension demo',
										layout: 'full-width',
									},
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
									content: [
										{
											type: 'text',
											text: 'normal with data provider',
										},
									],
								},
								{
									type: 'extension',
									attrs: {
										extensionType: 'com.atlassian.forge',
										extensionKey: 'awesome:list',
										parameters: {
											items: ['a', 'b', 'c', 'd'],
										},
										layout: 'default',
									},
									marks: [
										{
											type: 'dataConsumer',
											attrs: {
												sources: ['132017fa-dcdd-4c9f-80e7-9fefbde3974f'],
											},
										},
									] as DataConsumerDefinition[],
								},
							],
						},
						{
							type: 'tableCell',
							attrs: {},
							content: [
								{
									type: 'paragraph',
									content: [
										{
											type: 'text',
											text: 'wide with data provider',
										},
									],
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
									},
									marks: [
										{
											type: 'dataConsumer',
											attrs: {
												sources: ['132017fa-dcdd-4c9f-80e7-9fefbde3974f'],
											},
										},
									] as DataConsumerDefinition[],
								},
							],
						},
						{
							type: 'tableCell',
							attrs: {},
							content: [
								{
									type: 'paragraph',
									content: [
										{
											type: 'text',
											text: 'full-width with data provider',
										},
									],
								},
								{
									type: 'extension',
									attrs: {
										extensionType: 'com.atlassian.forge',
										extensionKey: 'awesome:list',
										parameters: {
											items: ['a', 'b', 'c', 'd'],
										},
										layout: 'full-width',
									},
									marks: [
										{
											type: 'dataConsumer',
											attrs: {
												sources: ['132017fa-dcdd-4c9f-80e7-9fefbde3974f'],
											},
										},
									] as DataConsumerDefinition[],
								},
							],
						},
					],
				},
			],
		},
	],
};

export const extensionsWithinExpand: DocNode = {
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
					type: 'paragraph',
					content: [
						{
							type: 'text',
							text: 'normal with data provider',
						},
					],
				},
				{
					type: 'extension',
					attrs: {
						extensionType: 'com.atlassian.forge',
						extensionKey: 'awesome:list',
						parameters: {
							items: ['a', 'b', 'c', 'd'],
						},
						layout: 'default',
					},
					marks: [
						{
							type: 'dataConsumer',
							attrs: {
								sources: ['132017fa-dcdd-4c9f-80e7-9fefbde3974f'],
							},
						},
					] as DataConsumerDefinition[],
				},
				{
					type: 'paragraph',
					content: [
						{
							type: 'text',
							text: 'wide with data provider',
						},
					],
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
					},
					marks: [
						{
							type: 'dataConsumer',
							attrs: {
								sources: ['132017fa-dcdd-4c9f-80e7-9fefbde3974f'],
							},
						},
					] as DataConsumerDefinition[],
				},
				{
					type: 'paragraph',
					content: [
						{
							type: 'text',
							text: 'full-width with data provider',
						},
					],
				},
				{
					type: 'extension',
					attrs: {
						extensionType: 'com.atlassian.forge',
						extensionKey: 'awesome:list',
						parameters: {
							items: ['a', 'b', 'c', 'd'],
						},
						layout: 'full-width',
					},
					marks: [
						{
							type: 'dataConsumer',
							attrs: {
								sources: ['132017fa-dcdd-4c9f-80e7-9fefbde3974f'],
							},
						},
					] as DataConsumerDefinition[],
				},
				{
					type: 'paragraph',
					content: [
						{
							type: 'text',
							text: 'normal without data provider',
						},
					],
				},
				{
					type: 'extension',
					attrs: {
						extensionType: 'com.atlassian.confluence.macro.core',
						extensionKey: 'block-eh',
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
						text: 'Block extension demo',
						layout: 'default',
					},
				},
				{
					type: 'paragraph',
					content: [
						{
							type: 'text',
							text: 'wide without data provider',
						},
					],
				},
				{
					type: 'extension',
					attrs: {
						extensionType: 'com.atlassian.confluence.macro.core',
						extensionKey: 'block-eh',
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
						text: 'Block extension demo',
						layout: 'wide',
					},
				},
				{
					type: 'paragraph',
					content: [
						{
							type: 'text',
							text: 'full-width without data provider',
						},
					],
				},
				{
					type: 'extension',
					attrs: {
						extensionType: 'com.atlassian.confluence.macro.core',
						extensionKey: 'block-eh',
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
						text: 'Block extension demo',
						layout: 'full-width',
					},
				},
				{
					type: 'paragraph',
					content: [],
				},
			],
		},
	],
};

export const extensionsWithLayout: DocNode = {
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
									text: 'normal without data provider',
								},
							],
						},
						{
							type: 'extension',
							attrs: {
								extensionType: 'com.atlassian.confluence.macro.core',
								extensionKey: 'block-eh',
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
								text: 'Block extension demo',
								layout: 'default',
							},
						},
						{
							type: 'paragraph',
							content: [
								{
									type: 'text',
									text: 'wide without data provider',
								},
							],
						},
						{
							type: 'extension',
							attrs: {
								extensionType: 'com.atlassian.confluence.macro.core',
								extensionKey: 'block-eh',
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
								text: 'Block extension demo',
								layout: 'wide',
							},
						},
						{
							type: 'paragraph',
							content: [
								{
									type: 'text',
									text: 'full-width without data provider',
								},
							],
						},
						{
							type: 'extension',
							attrs: {
								extensionType: 'com.atlassian.confluence.macro.core',
								extensionKey: 'block-eh',
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
								text: 'Block extension demo',
								layout: 'full-width',
							},
						},
						{
							type: 'paragraph',
							content: [],
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
									text: 'normal with data provider',
								},
							],
						},
						{
							type: 'extension',
							attrs: {
								extensionType: 'com.atlassian.forge',
								extensionKey: 'awesome:list',
								parameters: {
									items: ['a', 'b', 'c', 'd'],
								},
								layout: 'default',
							},
							marks: [
								{
									type: 'dataConsumer',
									attrs: {
										sources: ['132017fa-dcdd-4c9f-80e7-9fefbde3974f'],
									},
								},
							] as DataConsumerDefinition[],
						},
						{
							type: 'paragraph',
							content: [
								{
									type: 'text',
									text: 'wide with data provider',
								},
							],
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
							},
							marks: [
								{
									type: 'dataConsumer',
									attrs: {
										sources: ['132017fa-dcdd-4c9f-80e7-9fefbde3974f'],
									},
								},
							] as DataConsumerDefinition[],
						},
						{
							type: 'paragraph',
							content: [
								{
									type: 'text',
									text: 'full-width with data provider',
								},
							],
						},
						{
							type: 'extension',
							attrs: {
								extensionType: 'com.atlassian.forge',
								extensionKey: 'awesome:list',
								parameters: {
									items: ['a', 'b', 'c', 'd'],
								},
								layout: 'full-width',
							},
							marks: [
								{
									type: 'dataConsumer',
									attrs: {
										sources: ['132017fa-dcdd-4c9f-80e7-9fefbde3974f'],
									},
								},
							] as DataConsumerDefinition[],
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
