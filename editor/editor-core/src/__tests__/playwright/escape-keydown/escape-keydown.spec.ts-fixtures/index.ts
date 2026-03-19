export const adfDate: {
    version: number; type: string; content: {
        type: string;
        content: ({
            type: string;
            attrs: {
                timestamp: string;
            };
            text?: undefined;
        } | {
            type: string;
            text: string;
            attrs?: undefined;
        })[];
    }[];
} = {
	version: 1,
	type: 'doc',
	content: [
		{
			type: 'paragraph',
			content: [
				{
					type: 'date',
					attrs: {
						timestamp: '1658102400000',
					},
				},
				{
					type: 'text',
					text: '  ',
				},
			],
		},
		{
			type: 'paragraph',
			content: [],
		},
	],
};

export const emptyDocument: {
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
					text: '  ',
				},
			],
		},
	],
};
