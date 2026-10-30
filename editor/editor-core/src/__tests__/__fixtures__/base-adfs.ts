// This is used inside the type-ahead integration and playwright tests

export const onlyOneChar: {
	content: {
		content: {
			text: string;
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
					type: 'text',
					text: 'C',
				},
			],
		},
	],
};

export const spaceAtEnd: {
	content: {
		content: {
			text: string;
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
					type: 'text',
					text: ' ',
				},
			],
		},
	],
};

export const spaceBeforeText: {
	content: {
		content: {
			text: string;
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
					type: 'text',
					text: 'a b',
				},
			],
		},
	],
};

export const textAndStatusAtFirstParagraph: {
	content: {
		content: (
			| {
					attrs?: undefined;
					text: string;
					type: string;
			  }
			| {
					attrs: {
						color: string;
						localId: string;
						style: string;
						text: string;
					};
					text?: undefined;
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
	content: {
		attrs: {
			__autoSize: boolean;
			isNumberColumnEnabled: boolean;
			layout: string;
			localId: string;
		};
		content: {
			content: (
				| {
						attrs: {
							background: null;
							colspan: number;
							rowspan: number;
						};
						content: {
							content: {
								text: string;
								type: string;
							}[];
							type: string;
						}[];
						type: string;
				  }
				| {
						attrs: {
							background: null;
							colspan: number;
							rowspan: number;
						};
						content: {
							content: {
								attrs: {
									text: string;
								};
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
	}[];
	type: string;
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
	content: (
		| {
				attrs?: undefined;
				content: never[];
				type: string;
		  }
		| {
				attrs: {
					panelType: string;
				};
				content: {
					content: never[];
					type: string;
				}[];
				type: string;
		  }
	)[];
	type: string;
	version: number;
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
	content: {
		attrs: {
			order: number;
		};
		content: {
			content: {
				content: {
					text: string;
					type: string;
				}[];
				type: string;
			}[];
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
	content: {
		attrs: {
			order: number;
		};
		content: {
			content: (
				| {
						attrs?: undefined;
						content: {
							text: string;
							type: string;
						}[];
						type: string;
				  }
				| {
						attrs: {
							order: number;
						};
						content: {
							content: {
								content: {
									text: string;
									type: string;
								}[];
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
	}[];
	type: string;
	version: number;
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
	content: never[];
	type: string;
	version: number;
} = {
	version: 1,
	type: 'doc',
	content: [],
};
