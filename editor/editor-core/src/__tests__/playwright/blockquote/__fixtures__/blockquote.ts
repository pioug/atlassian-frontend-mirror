export const blockquoteAdf: {
	content: {
		content: {
			content: never[];
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
	content: {
		attrs: {
			title: string;
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
