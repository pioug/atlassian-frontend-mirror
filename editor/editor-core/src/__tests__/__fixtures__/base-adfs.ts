// This is used inside the type-ahead integration and playwright tests

export const onlyOneChar: {
	version: number;
	type: string;
	content: {
		type: string;
		content: {
			type: string;
			text: string;
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
					type: 'text',
					text: 'C',
				},
			],
		},
	],
};

export const spaceAtEnd: {
	version: number;
	type: string;
	content: {
		type: string;
		content: {
			type: string;
			text: string;
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
					type: 'text',
					text: ' ',
				},
			],
		},
	],
};

export const spaceBeforeText: {
	version: number;
	type: string;
	content: {
		type: string;
		content: {
			type: string;
			text: string;
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
					type: 'text',
					text: 'a b',
				},
			],
		},
	],
};

export const textAndStatusAtFirstParagraph: {
	version: number;
	type: string;
	content: {
		type: string;
		content: (
			| {
					type: string;
					text: string;
					attrs?: undefined;
			  }
			| {
					type: string;
					attrs: {
						text: string;
						color: string;
						localId: string;
						style: string;
					};
					text?: undefined;
			  }
		)[];
	}[];
} = {
	version: 1,
	type: 'doc',
	content: [
		{
			type: 'paragraph',
			content: [
				{
					type: 'text',
					text: 'AAA ',
				},
				{
					type: 'status',
					attrs: {
						text: 'CLICK ME',
						color: 'neutral',
						localId: 'local-id',
						style: '',
					},
				},
				{
					type: 'text',
					text: ' ',
				},
			],
		},
		{
			type: 'paragraph',
			content: [
				{
					type: 'text',
					text: ' ',
				},
			],
		},
	],
};

export const tableWithPlaceholders: {
	type: string;
	content: {
		type: string;
		attrs: {
			isNumberColumnEnabled: boolean;
			layout: string;
			__autoSize: boolean;
			localId: string;
		};
		content: {
			type: string;
			content: (
				| {
						type: string;
						attrs: {
							colspan: number;
							rowspan: number;
							background: null;
						};
						content: {
							type: string;
							content: {
								type: string;
								text: string;
							}[];
						}[];
				  }
				| {
						type: string;
						attrs: {
							colspan: number;
							rowspan: number;
							background: null;
						};
						content: {
							type: string;
							content: {
								type: string;
								attrs: {
									text: string;
								};
							}[];
						}[];
				  }
			)[];
		}[];
	}[];
} = {
	type: 'doc',
	content: [
		{
			type: 'table',
			attrs: {
				isNumberColumnEnabled: false,
				layout: 'default',
				__autoSize: false,
				localId: 'local-id',
			},
			content: [
				{
					type: 'tableRow',
					content: [
						{
							type: 'tableHeader',
							attrs: {
								colspan: 1,
								rowspan: 1,
								background: null,
							},
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
						{
							type: 'tableCell',
							attrs: {
								colspan: 1,
								rowspan: 1,
								background: null,
							},
							content: [
								{
									type: 'paragraph',
									content: [
										{
											type: 'placeholder',
											attrs: {
												text: '@ mention someone',
											},
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

/** An info panel with empty paragraphs before and after */
export const infoPanel: {
	version: number;
	type: string;
	content: (
		| {
				type: string;
				content: never[];
				attrs?: undefined;
		  }
		| {
				type: string;
				attrs: {
					panelType: string;
				};
				content: {
					type: string;
					content: never[];
				}[];
		  }
	)[];
} = {
	version: 1,
	type: 'doc',
	content: [
		{
			type: 'paragraph',
			content: [],
		},
		{
			type: 'panel',
			attrs: {
				panelType: 'info',
			},
			content: [
				{
					type: 'paragraph',
					content: [],
				},
			],
		},
		{
			type: 'paragraph',
			content: [],
		},
	],
};

export const numberedListDocument: {
	version: number;
	type: string;
	content: {
		type: string;
		attrs: {
			order: number;
		};
		content: {
			type: string;
			content: {
				type: string;
				content: {
					type: string;
					text: string;
				}[];
			}[];
		}[];
	}[];
} = {
	version: 1,
	type: 'doc',
	content: [
		{
			type: 'orderedList',
			attrs: {
				order: 1,
			},
			content: [
				{
					type: 'listItem',
					content: [
						{
							type: 'paragraph',
							content: [
								{
									type: 'text',
									text: 'one',
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
									text: 'two',
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
									text: 'three',
								},
							],
						},
					],
				},
			],
		},
	],
};

export const nestedNumberedListDocument: {
	version: number;
	type: string;
	content: {
		type: string;
		attrs: {
			order: number;
		};
		content: {
			type: string;
			content: (
				| {
						type: string;
						content: {
							type: string;
							text: string;
						}[];
						attrs?: undefined;
				  }
				| {
						type: string;
						attrs: {
							order: number;
						};
						content: {
							type: string;
							content: {
								type: string;
								content: {
									type: string;
									text: string;
								}[];
							}[];
						}[];
				  }
			)[];
		}[];
	}[];
} = {
	version: 1,
	type: 'doc',
	content: [
		{
			type: 'orderedList',
			attrs: {
				order: 1,
			},
			content: [
				{
					type: 'listItem',
					content: [
						{
							type: 'paragraph',
							content: [
								{
									type: 'text',
									text: 'one',
								},
							],
						},
						{
							type: 'orderedList',
							attrs: {
								order: 1,
							},
							content: [
								{
									type: 'listItem',
									content: [
										{
											type: 'paragraph',
											content: [
												{
													type: 'text',
													text: 'nested',
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
									text: 'two',
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
									text: 'three',
								},
							],
						},
					],
				},
			],
		},
	],
};

export const emptyAdf: {
	version: number;
	type: string;
	content: never[];
} = {
	version: 1,
	type: 'doc',
	content: [],
};
