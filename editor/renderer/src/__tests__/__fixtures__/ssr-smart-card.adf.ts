import type { DocNode } from '@atlaskit/adf-schema';

export const smartCardAdf: DocNode = {
	version: 1,
	type: 'doc',
	content: [
		{
			type: 'paragraph',
			content: [
				{
					type: 'inlineCard',
					attrs: {
						url: 'https://bitbucket.org/atlassian/incredible-monorepo/pull-requests/42',
					},
				},
				{
					type: 'text',
					text: ' ',
				},
			],
		},
	],
};

export const smartCardAtlassianProjectAdf: DocNode = {
	version: 1,
	type: 'doc',
	content: [
		{
			type: 'paragraph',
			content: [
				{
					type: 'inlineCard',
					attrs: {
						url: 'https://team.atlassian.com/project/CGFCFBKQ-45/about',
					},
				},
				{
					type: 'text',
					text: ' ',
				},
			],
		},
	],
};
