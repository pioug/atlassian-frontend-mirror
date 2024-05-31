import type { DocNode } from '@atlaskit/adf-schema';

export const unsupportedBlockAdf: DocNode = {
	type: 'doc',
	version: 1,
	content: [
		{
			// @ts-expect-error
			type: 'notapanel',
			attrs: {
				// @ts-expect-error
				panelType: 'info',
			},
			content: [
				{
					// @ts-expect-error
					type: 'paragraph',
					content: [
						{
							// @ts-expect-error
							type: 'text',
							text: 'text in panel',
						},
					],
				},
			],
		},
	],
};
