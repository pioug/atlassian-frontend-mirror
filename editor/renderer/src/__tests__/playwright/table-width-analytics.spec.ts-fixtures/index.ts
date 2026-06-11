export const basicTableAdf: {
	content: {
		attrs: {
			isNumberColumnEnabled: boolean;
			layout: string;
		};
		content: {
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
	}[];
	type: string;
	version: number;
} = {
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
							type: 'tableCell',
							content: [
								{
									type: 'paragraph',
									content: [{ type: 'text', text: 'Cell 1' }],
								},
							],
						},
						{
							type: 'tableCell',
							content: [
								{
									type: 'paragraph',
									content: [{ type: 'text', text: 'Cell 2' }],
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
							content: [
								{
									type: 'paragraph',
									content: [{ type: 'text', text: 'Cell 3' }],
								},
							],
						},
						{
							type: 'tableCell',
							content: [
								{
									type: 'paragraph',
									content: [{ type: 'text', text: 'Cell 4' }],
								},
							],
						},
					],
				},
			],
		},
	],
};

export const nestedTablesInHeaderAndCellAdf: {
	content: {
		attrs: {
			isNumberColumnEnabled: boolean;
			layout: string;
		};
		content: {
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
								isNumberColumnEnabled: boolean;
								layout: string;
							};
							content: {
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
					  }
				)[];
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
							content: [
								{
									type: 'paragraph',
									content: [{ type: 'text', text: 'Header with nested table:' }],
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
													type: 'tableCell',
													content: [
														{
															type: 'paragraph',
															content: [{ type: 'text', text: 'Nested in Header A1' }],
														},
													],
												},
												{
													type: 'tableCell',
													content: [
														{
															type: 'paragraph',
															content: [{ type: 'text', text: 'Nested in Header B1' }],
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
													content: [
														{
															type: 'paragraph',
															content: [{ type: 'text', text: 'Nested in Header A2' }],
														},
													],
												},
												{
													type: 'tableCell',
													content: [
														{
															type: 'paragraph',
															content: [{ type: 'text', text: 'Nested in Header B2' }],
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
							type: 'tableHeader',
							content: [
								{
									type: 'paragraph',
									content: [{ type: 'text', text: 'Regular Header' }],
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
							content: [
								{
									type: 'paragraph',
									content: [{ type: 'text', text: 'Cell with nested table:' }],
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
													type: 'tableCell',
													content: [
														{
															type: 'paragraph',
															content: [{ type: 'text', text: 'Nested in Cell X1' }],
														},
													],
												},
												{
													type: 'tableCell',
													content: [
														{
															type: 'paragraph',
															content: [{ type: 'text', text: 'Nested in Cell Y1' }],
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
							type: 'tableCell',
							content: [
								{
									type: 'paragraph',
									content: [{ type: 'text', text: 'Regular Cell' }],
								},
							],
						},
					],
				},
			],
		},
	],
};

export const tableWithScrollbarAdf: {
	content: {
		attrs: {
			isNumberColumnEnabled: boolean;
			layout: string;
		};
		content: {
			content: {
				attrs: {
					colwidth: number[];
				};
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
	}[];
	type: string;
	version: number;
} = {
	version: 1,
	type: 'doc',
	content: [
		{
			type: 'table',
			attrs: {
				isNumberColumnEnabled: false,
				layout: 'center',
			},
			content: [
				{
					type: 'tableRow',
					content: [
						{
							type: 'tableHeader',
							attrs: {
								colwidth: [48],
							},
							content: [
								{
									type: 'paragraph',
									content: [{ type: 'text', text: 'a' }],
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
									content: [{ type: 'text', text: 'b' }],
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
									content: [{ type: 'text', text: 'c' }],
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
									content: [{ type: 'text', text: 'd' }],
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
									content: [{ type: 'text', text: 'e' }],
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
									content: [{ type: 'text', text: 'f' }],
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
									content: [{ type: 'text', text: 'g' }],
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
									content: [{ type: 'text', text: 'h' }],
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
									content: [{ type: 'text', text: 'i' }],
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
									content: [{ type: 'text', text: 'j' }],
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
									content: [{ type: 'text', text: 'k' }],
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
									content: [{ type: 'text', text: 'l' }],
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
									content: [{ type: 'text', text: 'm' }],
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
									content: [{ type: 'text', text: 'n' }],
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
									content: [{ type: 'text', text: 'o' }],
								},
							],
						},
						{
							type: 'tableHeader',
							attrs: {
								colwidth: [200],
							},
							content: [
								{
									type: 'paragraph',
									content: [{ type: 'text', text: 'p' }],
								},
							],
						},
					],
				},
			],
		},
	],
};
