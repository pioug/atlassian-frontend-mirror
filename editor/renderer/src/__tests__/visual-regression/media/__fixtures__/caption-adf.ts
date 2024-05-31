import type { DocNode } from '@atlaskit/adf-schema';

export const caption: DocNode = {
	version: 1,
	type: 'doc',
	content: [
		{
			type: 'mediaSingle',
			attrs: {
				width: 33.33333333333333,
				layout: 'center',
			},
			content: [
				{
					type: 'media',
					attrs: {
						url: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAFAAAAAyCAYAAADLLVz8AAAAWklEQVR42u3QMQEAAAQAMJIL5BVQB68twjKmKzhLgQIFChSIQIECBSJQoECBCBQoUCACBQoUiECBAgUiUKBAgQgUKFAgAgUKFIhAgQIFIlCgQIECBQoUKPCrBUAeXY/1wpUbAAAAAElFTkSuQmCC',
						type: 'external',
					},
				},
				{
					type: 'caption',
					content: [
						{
							type: 'text',
							text: 'this is a caption',
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
