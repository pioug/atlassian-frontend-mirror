import type { DocNode } from '@atlaskit/adf-schema';

export const borderADF: DocNode = {
	version: 1,
	type: 'doc',
	content: [
		{
			type: 'mediaSingle',
			attrs: {
				width: 50,
				layout: 'center',
			},
			content: [
				{
					type: 'media',
					attrs: {
						url: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAFAAAAAyCAYAAADLLVz8AAAAWklEQVR42u3QMQEAAAQAMJIL5BVQB68twjKmKzhLgQIFChSIQIECBSJQoECBCBQoUCACBQoUiECBAgUiUKBAgQgUKFAgAgUKFIhAgQIFIlCgQIECBQoUKPCrBUAeXY/1wpUbAAAAAElFTkSuQmCC',
						type: 'external',
					},
					marks: [
						{
							type: 'border',
							attrs: {
								color: '#BF2600',
								size: 3,
							},
						},
					],
				},
			],
		},
	],
};
