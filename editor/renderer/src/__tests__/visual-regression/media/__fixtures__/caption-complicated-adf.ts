import type { DocNode } from '@atlaskit/adf-schema';

export const captionComplicated: DocNode = {
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
							text: 'this is a complicated caption with ',
						},
						{
							type: 'mention',
							attrs: {
								id: '0',
								text: '@Carolyn',
								accessLevel: '',
							},
						},
						{
							type: 'text',
							text: ' ',
						},
						{
							type: 'emoji',
							attrs: {
								shortName: ':tada:',
								id: '1f389',
								text: '🎉',
							},
						},
						{
							type: 'text',
							text: ' ',
						},
						{
							type: 'emoji',
							attrs: {
								shortName: ':tada:',
								id: '1f389',
								text: '🎉',
							},
						},
						{
							type: 'text',
							text: ' ',
						},
						{
							type: 'emoji',
							attrs: {
								shortName: ':smiling_face_with_3_hearts:',
								id: '1f970',
								text: '🥰',
							},
						},
						{
							type: 'text',
							text: ' ',
						},
						{
							type: 'text',
							text: "FAB-1520 UI: Poor man's search",
							// @ts-ignore - unclear why this will not cast to node_modules/@atlaskit/adf-schema/dist/types/schema/marks/link.d.ts
							marks: [
								{
									type: 'link',
									attrs: {
										href: 'https://product-fabric.atlassian.net/browse/FAB-1520',
									},
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
