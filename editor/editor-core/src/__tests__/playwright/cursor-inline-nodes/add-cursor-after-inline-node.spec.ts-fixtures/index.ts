export const statusADF: {
	version: number;
	type: string;
	content: {
		type: string;
		content: (
			| {
					type: string;
					content: {
						type: string;
						content: {
							type: string;
							attrs: {
								text: string;
								color: string;
								localId: string;
								style: string;
							};
						}[];
					}[];
			  }
			| {
					type: string;
					content: {
						type: string;
						content: {
							type: string;
							text: string;
						}[];
					}[];
			  }
		)[];
	}[];
} = {
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
									type: 'status',
									attrs: {
										text: 'HELLO',
										color: 'neutral',
										localId: '556019ae-70e7-42b2-a213-8566efca769f',
										style: '',
									},
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
									text: 'LOL',
								},
							],
						},
					],
				},
			],
		},
	],
};

export const dateADF: {
	version: number;
	type: string;
	content: {
		type: string;
		content: (
			| {
					type: string;
					content: {
						type: string;
						content: {
							type: string;
							attrs: {
								timestamp: string;
							};
						}[];
					}[];
			  }
			| {
					type: string;
					content: {
						type: string;
						content: {
							type: string;
							text: string;
						}[];
					}[];
			  }
		)[];
	}[];
} = {
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
									type: 'date',
									attrs: {
										timestamp: '1616371200000',
									},
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
									text: 'LOL',
								},
							],
						},
					],
				},
			],
		},
	],
};

export const emojiADF: {
	version: number;
	type: string;
	content: {
		type: string;
		content: (
			| {
					type: string;
					content: {
						type: string;
						content: {
							type: string;
							attrs: {
								shortName: string;
								id: string;
								text: string;
							};
						}[];
					}[];
			  }
			| {
					type: string;
					content: {
						type: string;
						content: {
							type: string;
							text: string;
						}[];
					}[];
			  }
		)[];
	}[];
} = {
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
									type: 'emoji',
									attrs: {
										shortName: ':smiley:',
										id: '1f603',
										text: '😃',
									},
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
									text: 'LOL',
								},
							],
						},
					],
				},
			],
		},
	],
};

export const inlineExtensionADF: {
	version: number;
	type: string;
	content: {
		type: string;
		content: (
			| {
					type: string;
					content: {
						type: string;
						content: {
							type: string;
							attrs: {
								extensionType: string;
								extensionKey: string;
								parameters: {
									macroParams: {};
									macroMetadata: {
										placeholder: {
											data: {
												url: string;
											};
											type: string;
										}[];
									};
								};
								text: string;
							};
						}[];
					}[];
			  }
			| {
					type: string;
					content: {
						type: string;
						content: {
							type: string;
							text: string;
						}[];
					}[];
			  }
		)[];
	}[];
} = {
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
									type: 'inlineExtension',
									attrs: {
										extensionType: 'com.atlassian.confluence.macro.core',
										extensionKey: 'inline-eh',
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
										text: 'Inline extension demo',
									},
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
									text: 'LOL',
								},
							],
						},
					],
				},
			],
		},
	],
};

export const mentionADF: {
	version: number;
	type: string;
	content: {
		type: string;
		content: (
			| {
					type: string;
					content: {
						type: string;
						content: {
							type: string;
							attrs: {
								id: string;
								text: string;
								accessLevel: string;
								userType: null;
							};
						}[];
					}[];
			  }
			| {
					type: string;
					content: {
						type: string;
						content: {
							type: string;
							text: string;
						}[];
					}[];
			  }
		)[];
	}[];
} = {
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
									type: 'mention',
									attrs: {
										id: '0',
										text: '@Carolyn',
										accessLevel: '',
										userType: null,
									},
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
									text: 'LOL',
								},
							],
						},
					],
				},
			],
		},
	],
};

export const multipleMentionsADF: {
	version: number;
	type: string;
	content: {
		type: string;
		content: {
			type: string;
			attrs: {
				id: string;
				text: string;
				accessLevel: string;
			};
		}[];
	}[];
} = {
	version: 1,
	type: 'doc',
	content: [
		{
			type: 'paragraph',
			content: [
				{
					type: 'mention',
					attrs: {
						id: '0',
						text: '@Carolyn',
						accessLevel: '',
					},
				},
				{
					type: 'mention',
					attrs: {
						id: '0',
						text: '@Carolyn',
						accessLevel: '',
					},
				},
				{
					type: 'mention',
					attrs: {
						id: '0',
						text: '@Carolyn',
						accessLevel: '',
					},
				},
			],
		},
	],
};
