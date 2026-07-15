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
					// @ts-ignore - deliberately invalid ADF: a block node nested where the (broken) parent type expects inline content. Uses @ts-ignore (not @ts-expect-error) because only the newer TS7 DOM lib flags this; TS5 does not, which would make @ts-expect-error unused.
					type: 'paragraph',
					content: [
						{
							type: 'text',
							text: 'text in panel',
						},
					],
				},
			],
		},
	],
};
