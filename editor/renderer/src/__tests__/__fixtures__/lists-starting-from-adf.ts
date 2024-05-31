import type { DocNode } from '@atlaskit/adf-schema';

export const createListAdf = ({ order }: { order: number }): DocNode => {
	return {
		version: 1,
		type: 'doc',
		content: [
			{
				type: 'paragraph',
				content: [],
			},
			{
				type: 'orderedList',
				attrs: {
					order: order,
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
										text: 'a',
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
										text: 'b',
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
		],
	};
};
