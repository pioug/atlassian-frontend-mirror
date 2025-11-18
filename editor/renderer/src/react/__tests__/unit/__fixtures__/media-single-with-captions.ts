import { createPlaceholderImageDataUrl } from '@atlaskit/editor-test-helpers/placeholder-images';

export const mediaSingleWithCaptionsFixture = {
	version: 1,
	type: 'doc',
	content: [
		{
			type: 'mediaSingle',
			attrs: {
				width: 760,
				layout: 'center',
				widthType: 'pixel',
			},
			content: [
				{
					type: 'media',
					attrs: {
						id: '2l43o91r-2743-91e0-mip5-180s74u59180',
						type: 'external',
						collection: 'LoremIpsumdolOrsita',
						width: 1920,
						height: 1080,
						url: createPlaceholderImageDataUrl(1920, 1080, 'f4f5f7', 'a5adba'),
					},
				},
				{
					type: 'caption',
					content: [
						{
							type: 'text',
							text: 'My Cool Caption',
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
