import type { DocNode } from '@atlaskit/adf-schema/doc';
export const adf: DocNode = {
	version: 1,
	type: 'doc',
	content: [
		{
			type: 'blockCard',
			attrs: {
				url: 'https://blockCardTestUrl',
			},
		},
		{
			type: 'embedCard',
			attrs: {
				url: 'https://embedCardTestUrl',
				layout: 'center',
			},
		},
	],
};
