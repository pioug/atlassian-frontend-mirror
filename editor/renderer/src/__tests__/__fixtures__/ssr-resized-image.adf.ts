import type { DocNode } from '@atlaskit/adf-schema';

export const resizedImagedoc: DocNode = {
	version: 1,
	type: 'doc',
	content: [
		{
			type: 'mediaSingle',
			attrs: {
				width: 16.666666666666664,
				layout: 'center',
			},
			content: [
				{
					type: 'media',
					attrs: {
						id: 'a559980d-cd47-43e2-8377-27359fcb905f',
						type: 'file',
						collection: 'MediaServicesSample',
						width: 500,
						height: 375,
					},
				},
			],
		},
		{
			type: 'paragraph',
			content: [],
		},
	],
};
