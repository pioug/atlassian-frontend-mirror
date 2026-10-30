export const twoDatesAdf: {
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
						timestamp: '1701734400000',
					},
				},
				{
					type: 'text',
					text: '',
				},
				{
					type: 'date',
					attrs: {
						timestamp: '1701820800000',
					},
				},
				{
					type: 'text',
					text: '',
				},
			],
		},
		{
			type: 'paragraph',
			content: [],
		},
	],
};

export const tableAdf: {
	content: {
		attrs: {
			isNumberColumnEnabled: boolean;
			layout: string;
			localId: string;
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
				localId: '1030dece-a85b-4e66-809c-0c796e483c0b',
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
			],
		},
	],
};
