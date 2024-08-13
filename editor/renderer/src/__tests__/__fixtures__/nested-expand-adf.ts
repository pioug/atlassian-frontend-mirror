import type { DocNode } from '@atlaskit/adf-schema';

export const nestedExpandInExpandADF: (breakoutMode?: string) => DocNode = (
	breakoutMode = 'default',
) => ({
	version: 1,
	type: 'doc',
	content: [
		{
			type: 'expand',
			attrs: {
				title: 'Hello',
			},
			content: [
				{
					type: 'nestedExpand',
					attrs: {
						title: '',
					},
					content: [
						{
							type: 'paragraph',
							content: [
								{
									type: 'text',
									text: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aenean mi nisl, venenatis eget auctor vitae, venenatis quis lorem. Suspendisse maximus tortor vel dui tincidunt cursus. Vestibulum magna nibh, auctor non auctor id, finibus vitae orci. Nulla viverra ipsum et nunc fringilla ultricies.',
								},
							],
						},
					],
				},
			],
			marks: [
				{
					type: 'breakout',
					attrs: {
						mode: breakoutMode,
					},
				},
			],
		},
	],
});
