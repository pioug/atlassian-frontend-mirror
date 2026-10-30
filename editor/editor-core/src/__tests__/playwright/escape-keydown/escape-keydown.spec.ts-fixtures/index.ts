export const adfDate: {
	content: {
		content: (
			| {
					attrs: {
						timestamp: string;
					};
					text?: undefined;
					type: string;
			  }
			| {
					attrs?: undefined;
					text: string;
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
					text: '  ',
				},
			],
		},
	],
};
