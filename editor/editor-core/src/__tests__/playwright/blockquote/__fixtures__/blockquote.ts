export const blockquoteAdf: {
    version: number;
    type: string;
    content: {
        type: string;
        content: {
            type: string;
            content: never[];
        }[];
    }[];
} = {
	version: 1,
	type: 'doc',
	content: [
		{
			type: 'blockquote',
			content: [
				{
					type: 'paragraph',
					content: [],
				},
			],
		},
	],
};

export const blockquoteInsideTableAdf: {
    version: number; type: string; content: {
        type: string;
        attrs: {
            isNumberColumnEnabled: boolean;
            layout: string;
            localId: string;
        };
        content: {
            type: string;
            content: {
                type: string;
                attrs: {};
                content: {
                    type: string;
                    content: {
                        type: string;
                        content: never[];
                    }[];
                }[];
            }[];
        }[];
    }[];
} = {
	version: 1,
	type: 'doc',
	content: [
		{
			type: 'table',
			attrs: {
				isNumberColumnEnabled: false,
				layout: 'default',
				localId: 'abc',
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
									type: 'blockquote',
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

export const blockquoteInsideExpandAdf: {
    version: number; type: string; content: {
        type: string;
        attrs: {
            title: string;
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
			type: 'expand',
			attrs: {
				title: '',
			},
			content: [
				{
					type: 'blockquote',
					content: [
						{
							type: 'paragraph',
							content: [
								{
									type: 'text',
									text: 'abcd',
								},
							],
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
