import type { DocNode } from '@atlaskit/adf-schema';
import { PanelType } from '@atlaskit/adf-schema';

export const paragraphNodeAdf: DocNode = {
	version: 1,
	type: 'doc',
	content: [
		{
			type: 'paragraph',
			content: [
				{
					type: 'text',
					text: 'Hello, ',
					marks: [
						{
							type: 'link',
							attrs: {
								href: 'https://www.atlassian.com',
							},
						},
					] as const,
				},
				{
					type: 'text',
					text: 'World!',
					marks: [
						{
							type: 'link',
							attrs: {
								href: 'https://www.atlassian.com',
							},
						},
						{
							type: 'strong',
						},
					] as const,
				},
				{
					type: 'text',
					text: ' and action mark',
				},
				{
					type: 'text',
					text: ' and invalid action mark',
				},
			],
		},
		{
			type: 'paragraph',
			content: [
				{
					type: 'text',
					text: 'Hello, ',
					marks: [
						{
							type: 'link',
							attrs: {
								href: 'https://www.atlassian.com',
							},
						},
					] as const,
				},
				{
					type: 'text',
					text: 'italic',
					marks: [
						{
							type: 'em',
						},
					] as const,
				},
				{
					type: 'text',
					text: 'link',
					marks: [
						{
							type: 'link',
							attrs: {
								href: 'https://www.atlassian.com',
							},
						},
					] as const,
				},
				{
					type: 'text',
					text: 'strike-through',
					marks: [
						{
							type: 'strike',
						},
					] as const,
				},
				{
					type: 'text',
					text: 'strong',
					marks: [
						{
							type: 'strong',
						},
					] as const,
				},
				{
					type: 'text',
					text: 'sub',
					marks: [
						{
							type: 'subsup',
							attrs: {
								type: 'sub',
							},
						},
					] as const,
				},
				{
					type: 'text',
					text: 'sup',
					marks: [
						{
							type: 'subsup',
							attrs: {
								type: 'sup',
							},
						},
					] as const,
				},
				{
					type: 'text',
					text: 'underline',
					marks: [
						{
							type: 'underline',
						},
					] as const,
				},
				{
					type: 'text',
					text: ' red text ',
					marks: [
						{
							type: 'textColor',
							attrs: {
								color: '#ff0000',
							},
						},
					] as const,
				},
				{
					type: 'text',
					text: 'strike-through',
					marks: [
						{
							type: 'textColor',
							attrs: {
								color: '#ff0000',
							},
						},
						{
							type: 'strike',
						},
					] as const,
				},
				{
					type: 'text',
					text: ' ',
					marks: [
						{
							type: 'textColor',
							attrs: {
								color: '#ff0000',
							},
						},
					] as const,
				},
				{
					type: 'text',
					text: 'underline',
					marks: [
						{
							type: 'textColor',
							attrs: {
								color: '#ff0000',
							},
						},
						{
							type: 'underline',
						},
					] as const,
				},
				{
					type: 'text',
					text: ' ',
					marks: [
						{
							type: 'textColor',
							attrs: {
								color: '#ff0000',
							},
						},
					] as const,
				},
				{
					type: 'text',
					text: 'mixed',
					marks: [
						{
							type: 'strong',
						},
						{
							type: 'textColor',
							attrs: {
								color: '#ff0000',
							},
						},
						{
							type: 'strike',
						},
						{
							type: 'subsup',
							attrs: {
								type: 'sup',
							},
						},
						{
							type: 'underline',
						},
					] as const,
				},
			],
		},
		{
			type: 'paragraph',
			content: [
				{
					type: 'text',
					text: 'some inline code: ',
				},
				{
					type: 'text',
					text: 'const foo = bar();',
					marks: [
						{
							type: 'code',
						},
					] as const,
				},
			],
		},
		{
			type: 'paragraph',
			content: [
				{
					type: 'text',
					text: 'some inline code: ',
				},
				{
					type: 'text',
					text: 'const foo = bar();',
					marks: [
						{
							type: 'code',
						},
					] as const,
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
				level: 2,
			},
			content: [
				{
					type: 'text',
					text: 'Heading 2',
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

export const listNodeAdf: DocNode = {
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
									text: 'First list item',
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
													text: 'Nested',
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
																	text: 'Nested',
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
																					text: 'Nested',
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
																									text: 'Nested',
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
																													text: 'Nested',
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
																					type: 'listItem',
																					content: [
																						{
																							type: 'paragraph',
																							content: [
																								{
																									type: 'text',
																									text: 'Nested',
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
																	type: 'listItem',
																	content: [
																		{
																			type: 'paragraph',
																			content: [
																				{
																					type: 'text',
																					text: 'Nested',
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
													type: 'listItem',
													content: [
														{
															type: 'paragraph',
															content: [
																{
																	type: 'text',
																	text: 'Nested',
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
									type: 'listItem',
									content: [
										{
											type: 'paragraph',
											content: [
												{
													type: 'text',
													text: 'Nested',
												},
											],
										},
									],
								},
							],
						},
					] as const,
				},
				{
					type: 'listItem',
					content: [
						{
							type: 'paragraph',
							content: [
								{
									type: 'text',
									text: 'Second list item',
								},
							],
						},
					] as const,
				},
				{
					type: 'listItem',
					content: [
						{
							type: 'paragraph',
							content: [
								{
									type: 'text',
									text: 'Third list item',
								},
							],
						},
					] as const,
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
									text: 'First list item',
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
													text: 'Nested',
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
																	text: 'Nested',
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
																					text: 'Nested',
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
																									text: 'Nested',
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
																													text: 'Nested',
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
																					type: 'listItem',
																					content: [
																						{
																							type: 'paragraph',
																							content: [
																								{
																									type: 'text',
																									text: 'Nested',
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
																	type: 'listItem',
																	content: [
																		{
																			type: 'paragraph',
																			content: [
																				{
																					type: 'text',
																					text: 'Nested',
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
													type: 'listItem',
													content: [
														{
															type: 'paragraph',
															content: [
																{
																	type: 'text',
																	text: 'Nested',
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
									type: 'listItem',
									content: [
										{
											type: 'paragraph',
											content: [
												{
													type: 'text',
													text: 'Nested',
												},
											],
										},
									],
								},
							],
						},
					] as const,
				},
				{
					type: 'listItem',
					content: [
						{
							type: 'paragraph',
							content: [
								{
									type: 'text',
									text: 'Second list item',
								},
							],
						},
					] as const,
				},
				{
					type: 'listItem',
					content: [
						{
							type: 'paragraph',
							content: [
								{
									type: 'text',
									text: 'Third list item',
								},
							],
						},
					] as const,
				},
			],
		},
	],
};

export const blockQuoteNodeAdf: DocNode = {
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
							text: 'All that is gold does not glitter, not all those who wander are lost; The old that is strong does not wither, deep roots are not reached by the frost.',
						},
					] as const,
				},
				{
					type: 'paragraph',
					content: [
						{
							type: 'text',
							text: 'From the ashes a fire shall be woken, a light from the shadows shall spring; Renewed shall be blade that was broken, the crownless again shall be king.',
						},
					] as const,
				},
				{
					type: 'paragraph',
					content: [
						{
							type: 'text',
							text: 'J.R.R. Tolkien, The Fellowship of the Ring.',
							marks: [
								{
									type: 'em',
								},
							],
						},
					] as const,
				},
			],
		},
	],
};

export const panelNodeAdf: DocNode = {
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
							text: 'This is an info panel with ',
						},
						{
							type: 'text',
							text: 'bold text',
							marks: [
								{
									type: 'strong',
								},
							],
						},
					] as const,
				},
			],
		},
		{
			type: 'panel',
			attrs: {
				panelType: PanelType.NOTE,
			},
			content: [
				{
					type: 'paragraph',
					content: [
						{
							type: 'text',
							text: 'This is a note panel with ',
						},
						{
							type: 'text',
							text: 'bold text',
							marks: [
								{
									type: 'strong',
								},
							],
						},
					] as const,
				},
			],
		},
		{
			type: 'panel',
			attrs: {
				panelType: PanelType.TIP,
			},
			content: [
				{
					type: 'paragraph',
					content: [
						{
							type: 'text',
							text: 'This is a tip panel with ',
						},
						{
							type: 'text',
							text: 'bold text',
							marks: [
								{
									type: 'strong',
								},
							],
						},
					] as const,
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
							text: 'This is a success panel with ',
						},
						{
							type: 'text',
							text: 'bold text',
							marks: [
								{
									type: 'strong',
								},
							],
						},
					] as const,
				},
			],
		},
		{
			type: 'panel',
			attrs: {
				panelType: PanelType.WARNING,
			},
			content: [
				{
					type: 'paragraph',
					content: [
						{
							type: 'text',
							text: 'This is a warning panel with ',
						},
						{
							type: 'text',
							text: 'bold text',
							marks: [
								{
									type: 'strong',
								},
							] as const,
						},
					],
				},
			],
		},
		{
			type: 'panel',
			attrs: {
				panelType: PanelType.ERROR,
			},
			content: [
				{
					type: 'paragraph',
					content: [
						{
							type: 'text',
							text: 'This is a error panel with ',
						},
						{
							type: 'text',
							text: 'bold text',
							marks: [
								{
									type: 'strong',
								},
							] as const,
						},
					],
				},
			],
		},
		{
			type: 'panel',
			attrs: {
				panelType: PanelType.CUSTOM,
				panelColor: '#998DD9',
			},
			content: [
				{
					type: 'paragraph',
					content: [
						{
							type: 'text',
							text: 'This is a custom panel with background color from ',
						},
						{
							type: 'text',
							text: 'color palette',
							marks: [
								{
									type: 'strong',
								},
							] as const,
						},
					],
				},
			],
		},
		{
			type: 'panel',
			attrs: {
				panelType: PanelType.CUSTOM,
				panelColor: '#FF0000',
			},
			content: [
				{
					type: 'paragraph',
					content: [
						{
							type: 'text',
							text: 'This is a custom panel with background color from ',
						},
						{
							type: 'text',
							text: 'hex color code',
							marks: [
								{
									type: 'strong',
								},
							] as const,
						},
					],
				},
			],
		},
	],
};

export const panelNodeNestedInTableAdf: DocNode = {
	content: [
		{
			attrs: {
				isNumberColumnEnabled: false,
				layout: 'default',
				localId: '08f1718e-c8dd-443b-b320-591c638a2fbe',
				width: 760,
			},
			content: [
				{
					content: [
						{
							attrs: {},
							content: [
								{
									content: [],
									type: 'paragraph',
								},
							],
							type: 'tableHeader',
						},
						{
							attrs: {},
							content: [
								{
									content: [],
									type: 'paragraph',
								},
							],
							type: 'tableHeader',
						},
						{
							attrs: {},
							content: [
								{
									content: [],
									type: 'paragraph',
								},
							],
							type: 'tableHeader',
						},
					],
					type: 'tableRow',
				},
				{
					content: [
						{
							attrs: {},
							content: [
								{
									attrs: {
										panelType: PanelType.INFO,
									},
									content: [
										{
											content: [],
											type: 'paragraph',
										},
									],
									type: 'panel',
								},
							],
							type: 'tableCell',
						},
						{
							attrs: {},
							content: [
								{
									content: [],
									type: 'paragraph',
								},
							],
							type: 'tableCell',
						},
						{
							attrs: {},
							content: [
								{
									content: [],
									type: 'paragraph',
								},
							],
							type: 'tableCell',
						},
					],
					type: 'tableRow',
				},
				{
					content: [
						{
							attrs: {},
							content: [
								{
									content: [],
									type: 'paragraph',
								},
							],
							type: 'tableCell',
						},
						{
							attrs: {},
							content: [
								{
									content: [],
									type: 'paragraph',
								},
							],
							type: 'tableCell',
						},
						{
							attrs: {},
							content: [
								{
									content: [],
									type: 'paragraph',
								},
							],
							type: 'tableCell',
						},
					],
					type: 'tableRow',
				},
			],
			type: 'table',
		},
		{
			content: [],
			type: 'paragraph',
		},
	],
	type: 'doc',
	version: 1,
};

export const ruleNodeAdf: DocNode = {
	version: 1,
	type: 'doc',
	content: [
		{
			type: 'rule',
		},
	],
};

export const decisionNodeAdf: DocNode = {
	version: 1,
	type: 'doc',
	content: [
		{
			type: 'decisionList',
			attrs: {
				localId: '9c1b864d-4d46-41ec-a537-1c1a88b7ceb2',
			},
			content: [
				{
					type: 'decisionItem',
					attrs: {
						localId: '98aea302-d2c3-47dc-82c2-8d1884150812',
						state: 'DECIDED',
					},
					content: [
						{
							type: 'text',
							text: 'Hello world',
						},
						{
							type: 'hardBreak',
						},
						{
							type: 'text',
							text: 'This is a decision ',
						},
						{
							type: 'emoji',
							attrs: {
								shortName: ':wink:',
								id: '1f609',
								text: '😉',
							},
						},
						{
							type: 'text',
							text: ' ',
						},
						{
							type: 'mention',
							attrs: {
								id: '0',
								text: '@Carolyn',
								accessLevel: 'CONTAINER',
							},
						},
						{
							type: 'text',
							text: ' ',
						},
						{
							type: 'text',
							text: 'was',
							marks: [
								{
									type: 'strong',
								},
							] as const,
						},
						{
							type: 'text',
							text: ' ',
						},
						{
							type: 'text',
							text: 'here',
							marks: [
								{
									type: 'em',
								},
								{
									type: 'underline',
								},
							] as const,
						},
						{
							type: 'text',
							text: '.',
						},
						{
							type: 'mention',
							attrs: {
								id: 'error:NotFound',
								text: '@NoLongerWorksHere',
								accessLevel: 'CONTAINER',
							},
						},
						{
							type: 'text',
							text: ' ',
						},
						{
							type: 'text',
							text: 'is not',
							marks: [
								{
									type: 'strong',
								},
							] as const,
						},
						{
							type: 'text',
							text: ' ',
						},
						{
							type: 'text',
							text: 'here.',
						},
					],
				},
				{
					type: 'decisionItem',
					attrs: {
						localId: '2916b781-30f1-45eb-8fa5-ca87988cecbe',
						state: 'DECIDED',
					},
					content: [
						{
							type: 'text',
							text: 'decision 2',
						},
					],
				},
				{
					type: 'decisionItem',
					attrs: {
						localId: 'to-be-ignored-as-no-content',
						state: 'DECIDED',
					},
				},
			],
		},
	],
};

export const taskNodeAdf: DocNode = {
	version: 1,
	type: 'doc',
	content: [
		{
			type: 'taskList',
			attrs: {
				localId: 'empty-list-should-not-render',
			},
			content: [
				{
					type: 'taskItem',
					attrs: {
						localId: 'to-be-ignored-as-no-content',
						state: 'TODO',
					},
				},
			],
		},
		{
			type: 'taskList',
			attrs: {
				localId: 'empty-list-should-not-render',
			},
			content: [
				{
					type: 'taskItem',
					attrs: {
						localId: 'task-1',
						state: 'TODO',
					},
					content: [
						{
							type: 'text',
							text: 'Could you please',
						},
						{
							type: 'hardBreak',
						},
						{
							type: 'text',
							text: 'do this ',
						},
						{
							type: 'mention',
							attrs: {
								id: '0',
								text: '@Carolyn',
								accessLevel: 'CONTAINER',
							},
						},
						{
							type: 'text',
							text: ' ',
						},
						{
							type: 'emoji',
							attrs: {
								shortName: ':wink:',
								id: '1f609',
								text: '😉',
							},
						},
					],
				},
			],
		},
		{
			type: 'taskList',
			attrs: {
				localId: 'empty-list-should-not-render',
			},
			content: [
				{
					type: 'taskItem',
					attrs: {
						localId: 'task-2',
						state: 'DONE',
					},
					content: [
						{
							type: 'text',
							text: 'This is completed',
						},
					],
				},
				{
					type: 'taskItem',
					attrs: {
						localId: 'to-be-ignored-as-no-content',
						state: 'TODO',
					},
				},
			],
		},
		{
			type: 'taskList',
			attrs: {
				localId: 'task-list-with-block-items',
			},
			content: [
				{
					type: 'taskItem',
					attrs: {
						localId: 'task-1',
						state: 'DONE',
					},
					content: [
						{
							type: 'text',
							text: 'Inline completed task item',
						},
					],
				},
				{
					type: 'blockTaskItem',
					attrs: {
						localId: 'task-2',
						state: 'DONE',
					},
					content: [
						{
							type: 'paragraph',
							content: [
								{
									type: 'text',
									text: 'Block completed task item',
								},
							],
						},
					],
				},
				{
					type: 'blockTaskItem',
					attrs: {
						localId: 'task-3',
						state: 'TODO',
					},
					content: [
						{
							type: 'paragraph',
							content: [
								{
									type: 'text',
									text: 'Block incomplete task item',
								},
							],
						},
					],
				},
				{
					type: 'taskItem',
					attrs: {
						localId: 'task-4',
						state: 'TODO',
					},
					content: [
						{
							type: 'text',
							text: 'Inline incomplete task item',
						},
					],
				},
			],
		},
	],
};

export const tableAdf: DocNode = {
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
							attrs: {
								colspan: 2,
								colwidth: [233, 100],
							},
							content: [
								{
									type: 'paragraph',
									content: [
										{
											type: 'text',
											text: 'header',
										},
									],
								},
							],
						},
						{
							type: 'tableHeader',
							attrs: {
								colwidth: [346],
								background: '#DEEBFF',
							},
							content: [
								{
									type: 'paragraph',
									content: [
										{
											type: 'text',
											text: 'header',
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
								colwidth: [233],
							},
							content: [
								{
									type: 'paragraph',
									content: [
										{
											type: 'text',
											text: 'cell',
										},
									],
								},
							],
						},
						{
							type: 'tableCell',
							attrs: {
								colwidth: [100],
							},
							content: [
								{
									type: 'paragraph',
									content: [
										{
											type: 'text',
											text: 'cell',
										},
									],
								},
							],
						},
						{
							type: 'tableCell',
							attrs: {
								colwidth: [346],
							},
							content: [
								{
									type: 'paragraph',
									content: [
										{
											type: 'text',
											text: 'cell',
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
								colwidth: [233],
							},
							content: [
								{
									type: 'paragraph',
									content: [
										{
											type: 'text',
											text: 'cell',
										},
									],
								},
							],
						},
						{
							type: 'tableCell',
							attrs: {
								colwidth: [100],
							},
							content: [
								{
									type: 'paragraph',
									content: [
										{
											type: 'text',
											text: 'cell',
										},
									],
								},
							],
						},
						{
							type: 'tableCell',
							attrs: {
								colwidth: [346],
							},
							content: [
								{
									type: 'paragraph',
									content: [
										{
											type: 'text',
											text: 'cell',
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
};

export const tableWithNumberedColumnAdf: DocNode = {
	version: 1,
	type: 'doc',
	content: [
		{
			type: 'table',
			attrs: {
				isNumberColumnEnabled: true,
				layout: 'default',
			},
			content: [
				{
					type: 'tableRow',
					content: [
						{
							type: 'tableHeader',
							attrs: {
								colspan: 2,
								colwidth: [233, 100],
							},
							content: [
								{
									type: 'paragraph',
									content: [
										{
											type: 'text',
											text: 'header',
										},
									],
								},
							],
						},
						{
							type: 'tableHeader',
							attrs: {
								colwidth: [346],
								background: '#DEEBFF',
							},
							content: [
								{
									type: 'paragraph',
									content: [
										{
											type: 'text',
											text: 'header',
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
								colwidth: [233],
							},
							content: [
								{
									type: 'paragraph',
									content: [
										{
											type: 'text',
											text: 'cell',
										},
									],
								},
							],
						},
						{
							type: 'tableCell',
							attrs: {
								colwidth: [100],
							},
							content: [
								{
									type: 'paragraph',
									content: [
										{
											type: 'text',
											text: 'cell',
										},
									],
								},
							],
						},
						{
							type: 'tableCell',
							attrs: {
								colwidth: [346],
							},
							content: [
								{
									type: 'paragraph',
									content: [
										{
											type: 'text',
											text: 'cell',
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
								colwidth: [233],
							},
							content: [
								{
									type: 'paragraph',
									content: [
										{
											type: 'text',
											text: 'cell',
										},
									],
								},
							],
						},
						{
							type: 'tableCell',
							attrs: {
								colwidth: [100],
							},
							content: [
								{
									type: 'paragraph',
									content: [
										{
											type: 'text',
											text: 'cell',
										},
									],
								},
							],
						},
						{
							type: 'tableCell',
							attrs: {
								colwidth: [346],
							},
							content: [
								{
									type: 'paragraph',
									content: [
										{
											type: 'text',
											text: 'cell',
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
};

export const bodiedExtensionNodeAdf: DocNode = {
	version: 1,
	type: 'doc',
	content: [
		{
			type: 'bodiedExtension',
			attrs: {
				extensionType: 'com.atlassian.fabric',
				extensionKey: 'clock',
				layout: 'default',
			},
			content: [
				{
					type: 'paragraph',
					content: [
						{
							type: 'text',
							text: 'This is the default content of the extension',
						},
					],
				},
			],
		},
	],
};

export const multiBodiedExtensionNodeAdf: DocNode = {
	version: 1,
	type: 'doc',
	content: [
		{
			type: 'multiBodiedExtension',
			attrs: {
				extensionKey: 'mbe-section',
				extensionType: 'com.atlassian.mbe.section',
				parameters: {
					extensionTitle: 'MBE Section',
					backgroundColor: 'lightblue',
				},
				text: 'fa3017fa-dcdd-4c9f-80e7-9fefbde3974f',
				layout: 'default',
				localId: 'a8c460db-d287-4903-a4cf-de7231f4b62d',
			},
			content: [
				{
					type: 'extensionFrame',
					content: [
						{
							type: 'paragraph',
							attrs: {
								localId: '24d23d24-91a0-4a21-845c-c811a3184e94',
							},
							content: [
								{
									type: 'text',
									text: 'At vero eos et accusamus et iusto odio dignissimos ducimus qui blanditiis praesentium voluptatum deleniti atque corrupti quos dolores et quas molestias excepturi sint occaecati cupiditate non provident, similique sunt in culpa qui officia deserunt mollitia animi, id est laborum et dolorum fuga.',
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
					text: 'MBE - Section',
				},
			],
		},
	],
};

export const multiBodiedExtensionExtNodeWideAdf: DocNode = {
	version: 1,
	type: 'doc',
	content: [
		{
			type: 'multiBodiedExtension',
			attrs: {
				extensionKey: 'mbe-section',
				extensionType: 'com.atlassian.mbe.section',
				parameters: {
					extensionTitle: 'MBE Section',
					backgroundColor: 'lightblue',
				},
				text: 'fa3017fa-dcdd-4c9f-80e7-9fefbde3974f',
				layout: 'wide',
				localId: 'a8c460db-d287-4903-a4cf-de7231f4b62d',
			},
			content: [
				{
					type: 'extensionFrame',
					content: [
						{
							type: 'paragraph',
							attrs: {
								localId: '24d23d24-91a0-4a21-845c-c811a3184e94',
							},
							content: [
								{
									type: 'text',
									text: 'At vero eos et accusamus et iusto odio dignissimos ducimus qui blanditiis praesentium voluptatum deleniti atque corrupti quos dolores et quas molestias excepturi sint occaecati cupiditate non provident, similique sunt in culpa qui officia deserunt mollitia animi, id est laborum et dolorum fuga.',
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
					text: 'MBE - Section',
				},
			],
		},
	],
};

export const multiBodiedExtensionExtNodeFullWidthAdf: DocNode = {
	version: 1,
	type: 'doc',
	content: [
		{
			type: 'multiBodiedExtension',
			attrs: {
				extensionKey: 'mbe-section',
				extensionType: 'com.atlassian.mbe.section',
				parameters: {
					extensionTitle: 'MBE Section',
					backgroundColor: 'lightblue',
				},
				text: 'fa3017fa-dcdd-4c9f-80e7-9fefbde3974f',
				layout: 'full-width',
				localId: 'a8c460db-d287-4903-a4cf-de7231f4b62d',
			},
			content: [
				{
					type: 'extensionFrame',
					content: [
						{
							type: 'paragraph',
							attrs: {
								localId: '24d23d24-91a0-4a21-845c-c811a3184e94',
							},
							content: [
								{
									type: 'text',
									text: 'At vero eos et accusamus et iusto odio dignissimos ducimus qui blanditiis praesentium voluptatum deleniti atque corrupti quos dolores et quas molestias excepturi sint occaecati cupiditate non provident, similique sunt in culpa qui officia deserunt mollitia animi, id est laborum et dolorum fuga.',
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
					text: 'MBE - Section',
				},
			],
		},
	],
};
