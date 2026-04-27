export const adfNestedTableData: {
    content: {
        attrs: {};
        content: ({
            content: {
                attrs: {};
                content: {
                    content: never[];
                    type: string;
                }[];
                type: string;
            }[];
            type: string;
        } | {
            content: {
                attrs: {};
                content: {
                    attrs: {
                        isNumberColumnEnabled: boolean;
                        layout: string;
                        localId: string;
                    };
                    content: {
                        content: ({
                            attrs: {};
                            content: {
                                content: never[];
                                type: string;
                            }[];
                            type: string;
                        } | {
                            attrs: {};
                            content: {
                                attrs: {
                                    localId: null;
                                };
                                content: {
                                    text: string;
                                    type: string;
                                }[];
                                type: string;
                            }[];
                            type: string;
                        })[];
                        type: string;
                    }[];
                    type: string;
                }[];
                type: string;
            }[];
            type: string;
        })[];
        type: string;
    }[]; type: string; version: number;
} = {
	type: 'doc',
	version: 1,
	content: [
		{
			type: 'table',
			attrs: {},
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
									type: 'table',
									attrs: {
										isNumberColumnEnabled: false,
										layout: 'default',
										localId: '4e503abf-13f9-484e-bc74-f439c17665ef',
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
															attrs: {
																localId: null,
															},
															content: [
																{
																	type: 'text',
																	text: 'inside first nested table',
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

export const mockCommentData: ({
    attrs: {
        isNumberColumnEnabled?: undefined;
        layout: string;
        localId?: undefined;
        width: number;
        widthType: string;
    };
    content: {
        attrs: {
            alt: string;
            collection: string;
            height: number;
            id: string;
            type: string;
            width: number;
        };
        type: string;
    }[];
    type: string;
} | {
    attrs: {
        isNumberColumnEnabled: boolean;
        layout: string;
        localId: string;
        width?: undefined;
        widthType?: undefined;
    };
    content: {
        content: {
            attrs: {};
            content: {
                content: never[];
                type: string;
            }[];
            type: string;
        }[];
        type: string;
    }[];
    type: string;
} | {
    attrs?: undefined;
    content: ({
        attrs: {
            accessLevel: string;
            id: string;
            localId: string;
            text: string;
        };
        text?: undefined;
        type: string;
    } | {
        attrs?: undefined;
        text: string;
        type: string;
    })[];
    type: string;
})[] = [
	{
		type: 'paragraph',
		content: [],
	},
	{
		type: 'paragraph',
		content: [],
	},
	{
		type: 'paragraph',
		content: [
			{
				type: 'text',
				text: 'I love comments!',
			},
		],
	},
	{
		type: 'paragraph',
		content: [],
	},
	{
		type: 'mediaSingle',
		attrs: {
			width: 226,
			layout: 'align-start',
			widthType: 'pixel',
		},
		content: [
			{
				type: 'media',
				attrs: {
					type: 'file',
					id: '4173a3ed-5a65-4ac9-ba5d-7eaec5a950ac',
					alt: 'image-20250312-000002.png',
					collection: 'contentId-453807636487',
					height: 263,
					width: 282,
				},
			},
		],
	},
	{
		type: 'paragraph',
		content: [],
	},
	{
		type: 'table',
		attrs: {
			isNumberColumnEnabled: false,
			layout: 'default',
			localId: 'ad05fd7a-e0a9-4561-b04c-8de142f02b02',
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
		type: 'paragraph',
		content: [],
	},
	{
		type: 'paragraph',
		content: [],
	},
	{
		type: 'paragraph',
		content: [
			{
				type: 'mention',
				attrs: {
					id: '6310ef2a3778a7aadf18bc7d',
					localId: '59e0d62b-b41e-4a52-a7c1-a5899217f2bf',
					text: '@Kevin Mach',
					accessLevel: 'CONTAINER',
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
		content: [],
	},
	{
		type: 'paragraph',
		content: [
			{
				type: 'text',
				text: 'Comments are awesome!',
			},
		],
	},
	{
		type: 'paragraph',
		content: [],
	},
	{
		type: 'paragraph',
		content: [],
	},
	{
		type: 'paragraph',
		content: [],
	},
];
