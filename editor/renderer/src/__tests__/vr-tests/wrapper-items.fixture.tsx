import { generateRendererComponent } from '../__helpers/rendererComponents';

// Wrapper items ADF - list items that contain only nested lists
// Used to test that wrapper item markers are hidden in renderer
const wrapperItems = {
	version: 1,
	type: 'doc',
	content: [
		{
			type: 'paragraph',
			content: [
				{
					type: 'text',
					text: 'Multi-level step up and down (1 → 3 → 5 → 5 → 3 → 1)',
				},
			],
		},
		{
			// Level 1 item, then jump to level 3 (1 wrapper), then to level 5 (2 wrappers),
			// two items at level 5, step back up to 3, then back to 1
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
									text: 'Level 1 item',
								},
							],
						},
					],
				},
				{
					type: 'listItem',
					content: [
						{
							type: 'bulletList',
							content: [
								{
									type: 'listItem',
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
																	text: 'Level 3 item (stepped down from 1)',
																},
															],
														},
													],
												},
												{
													type: 'listItem',
													content: [
														{
															type: 'bulletList',
															content: [
																{
																	type: 'listItem',
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
																									text: 'Level 5 item A (stepped down from 3)',
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
																									text: 'Level 5 item B',
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
													type: 'listItem',
													content: [
														{
															type: 'paragraph',
															content: [
																{
																	type: 'text',
																	text: 'Level 3 item (stepped up from 5)',
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
					type: 'listItem',
					content: [
						{
							type: 'paragraph',
							content: [
								{
									type: 'text',
									text: 'Level 1 item (stepped up from 3)',
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
					text: 'All items at max depth 6 (5 wrapper layers above)',
				},
			],
		},
		{
			// 5 consecutive wrappers then 3 sibling items at depth 6
			type: 'bulletList',
			content: [
				{
					type: 'listItem',
					content: [
						{
							type: 'bulletList',
							content: [
								{
									type: 'listItem',
									content: [
										{
											type: 'bulletList',
											content: [
												{
													type: 'listItem',
													content: [
														{
															type: 'bulletList',
															content: [
																{
																	type: 'listItem',
																	content: [
																		{
																			type: 'bulletList',
																			content: [
																				{
																					type: 'listItem',
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
																													text: 'Max depth 6 - first item',
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
																													text: 'Max depth 6 - second item',
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
																													text: 'Max depth 6 - third item',
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
			],
		},
		{
			type: 'paragraph',
			content: [
				{
					type: 'text',
					text: 'Alternating depths (4 → 1 → 5 → 2 → 6 → 3)',
				},
			],
		},
		{
			// Rapidly alternating between deep and shallow levels
			type: 'bulletList',
			content: [
				{
					type: 'listItem',
					content: [
						{
							type: 'bulletList',
							content: [
								{
									type: 'listItem',
									content: [
										{
											type: 'bulletList',
											content: [
												{
													type: 'listItem',
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
																					text: 'Item 1 at level 4',
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
									text: 'Item 2 at level 1',
								},
							],
						},
					],
				},
				{
					type: 'listItem',
					content: [
						{
							type: 'bulletList',
							content: [
								{
									type: 'listItem',
									content: [
										{
											type: 'bulletList',
											content: [
												{
													type: 'listItem',
													content: [
														{
															type: 'bulletList',
															content: [
																{
																	type: 'listItem',
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
																									text: 'Item 3 at level 5',
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
													type: 'listItem',
													content: [
														{
															type: 'paragraph',
															content: [
																{
																	type: 'text',
																	text: 'Item 4 at level 2',
																},
															],
														},
													],
												},
												{
													type: 'listItem',
													content: [
														{
															type: 'bulletList',
															content: [
																{
																	type: 'listItem',
																	content: [
																		{
																			type: 'bulletList',
																			content: [
																				{
																					type: 'listItem',
																					content: [
																						{
																							type: 'bulletList',
																							content: [
																								{
																									type: 'listItem',
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
																																	text: 'Item 5 at level 6',
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
																					type: 'listItem',
																					content: [
																						{
																							type: 'paragraph',
																							content: [
																								{
																									type: 'text',
																									text: 'Item 6 at level 3',
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
			type: 'paragraph',
			content: [
				{
					type: 'text',
					text: 'Ordered: Multi-level step up and down (1 → 3 → 5 → 5 → 3 → 1)',
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
									text: 'Level 1 item',
								},
							],
						},
					],
				},
				{
					type: 'listItem',
					content: [
						{
							type: 'orderedList',
							content: [
								{
									type: 'listItem',
									content: [
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
																	text: 'Level 3 item (stepped down from 1)',
																},
															],
														},
													],
												},
												{
													type: 'listItem',
													content: [
														{
															type: 'orderedList',
															content: [
																{
																	type: 'listItem',
																	content: [
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
																									text: 'Level 5 item A (stepped down from 3)',
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
																									text: 'Level 5 item B',
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
													type: 'listItem',
													content: [
														{
															type: 'paragraph',
															content: [
																{
																	type: 'text',
																	text: 'Level 3 item (stepped up from 5)',
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
					type: 'listItem',
					content: [
						{
							type: 'paragraph',
							content: [
								{
									type: 'text',
									text: 'Level 1 item (stepped up from 3)',
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
					text: 'Ordered: All items at max depth 6 (5 wrapper layers above)',
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
							type: 'orderedList',
							content: [
								{
									type: 'listItem',
									content: [
										{
											type: 'orderedList',
											content: [
												{
													type: 'listItem',
													content: [
														{
															type: 'orderedList',
															content: [
																{
																	type: 'listItem',
																	content: [
																		{
																			type: 'orderedList',
																			content: [
																				{
																					type: 'listItem',
																					content: [
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
																													text: 'Max depth 6 - first item',
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
																													text: 'Max depth 6 - second item',
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
																													text: 'Max depth 6 - third item',
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
			],
		},
		{
			type: 'paragraph',
			content: [
				{
					type: 'text',
					text: 'Ordered: Alternating depths (4 → 1 → 5 → 2 → 6 → 3)',
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
							type: 'orderedList',
							content: [
								{
									type: 'listItem',
									content: [
										{
											type: 'orderedList',
											content: [
												{
													type: 'listItem',
													content: [
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
																					text: 'Item 1 at level 4',
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
									text: 'Item 2 at level 1',
								},
							],
						},
					],
				},
				{
					type: 'listItem',
					content: [
						{
							type: 'orderedList',
							content: [
								{
									type: 'listItem',
									content: [
										{
											type: 'orderedList',
											content: [
												{
													type: 'listItem',
													content: [
														{
															type: 'orderedList',
															content: [
																{
																	type: 'listItem',
																	content: [
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
																									text: 'Item 3 at level 5',
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
													type: 'listItem',
													content: [
														{
															type: 'paragraph',
															content: [
																{
																	type: 'text',
																	text: 'Item 4 at level 2',
																},
															],
														},
													],
												},
												{
													type: 'listItem',
													content: [
														{
															type: 'orderedList',
															content: [
																{
																	type: 'listItem',
																	content: [
																		{
																			type: 'orderedList',
																			content: [
																				{
																					type: 'listItem',
																					content: [
																						{
																							type: 'orderedList',
																							content: [
																								{
																									type: 'listItem',
																									content: [
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
																																	text: 'Item 5 at level 6',
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
																					type: 'listItem',
																					content: [
																						{
																							type: 'paragraph',
																							content: [
																								{
																									type: 'text',
																									text: 'Item 6 at level 3',
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
};

export const WrapperItemsRenderer = generateRendererComponent({
	document: wrapperItems,
	appearance: 'full-page',
});

export const WrapperItemsCommentRenderer = generateRendererComponent({
	document: wrapperItems,
	appearance: 'comment',
});
