export const statusADF: {
	content: {
		content: (
			| {
					content: {
						content: {
							attrs: {
								color: string;
								localId: string;
								style: string;
								text: string;
							};
							type: string;
						}[];
						type: string;
					}[];
					type: string;
			  }
			| {
					content: {
						content: {
							text: string;
							type: string;
						}[];
						type: string;
					}[];
					type: string;
			  }
		)[];
		type: string;
	}[];
	type: string;
	version: number;
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
	content: {
		content: (
			| {
					content: {
						content: {
							attrs: {
								timestamp: string;
							};
							type: string;
						}[];
						type: string;
					}[];
					type: string;
			  }
			| {
					content: {
						content: {
							text: string;
							type: string;
						}[];
						type: string;
					}[];
					type: string;
			  }
		)[];
		type: string;
	}[];
	type: string;
	version: number;
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
	content: {
		content: (
			| {
					content: {
						content: {
							attrs: {
								id: string;
								shortName: string;
								text: string;
							};
							type: string;
						}[];
						type: string;
					}[];
					type: string;
			  }
			| {
					content: {
						content: {
							text: string;
							type: string;
						}[];
						type: string;
					}[];
					type: string;
			  }
		)[];
		type: string;
	}[];
	type: string;
	version: number;
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
	content: {
		content: (
			| {
					content: {
						content: {
							attrs: {
								extensionKey: string;
								extensionType: string;
								parameters: {
									macroMetadata: {
										placeholder: {
											data: {
												url: string;
											};
											type: string;
										}[];
									};
									macroParams: {};
								};
								text: string;
							};
							type: string;
						}[];
						type: string;
					}[];
					type: string;
			  }
			| {
					content: {
						content: {
							text: string;
							type: string;
						}[];
						type: string;
					}[];
					type: string;
			  }
		)[];
		type: string;
	}[];
	type: string;
	version: number;
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
	content: {
		content: (
			| {
					content: {
						content: {
							attrs: {
								accessLevel: string;
								id: string;
								text: string;
								userType: null;
							};
							type: string;
						}[];
						type: string;
					}[];
					type: string;
			  }
			| {
					content: {
						content: {
							text: string;
							type: string;
						}[];
						type: string;
					}[];
					type: string;
			  }
		)[];
		type: string;
	}[];
	type: string;
	version: number;
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
	content: {
		content: {
			attrs: {
				accessLevel: string;
				id: string;
				text: string;
			};
			type: string;
		}[];
		type: string;
	}[];
	type: string;
	version: number;
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
