export const numberedColumnTableWithWidthAdf: {
	content: {
		attrs: {
			isNumberColumnEnabled: boolean;
			width: number;
		};
		content: {
			content: {
				attrs: {};
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
				isNumberColumnEnabled: true,
				width: 760,
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
									content: [{ type: 'text', text: 'Cell 1' }],
								},
							],
						},
						{
							type: 'tableHeader',
							attrs: {},
							content: [
								{
									type: 'paragraph',
									content: [{ type: 'text', text: 'Cell 2' }],
								},
							],
						},
						{
							type: 'tableHeader',
							attrs: {},
							content: [
								{
									type: 'paragraph',
									content: [{ type: 'text', text: 'Cell 3' }],
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
