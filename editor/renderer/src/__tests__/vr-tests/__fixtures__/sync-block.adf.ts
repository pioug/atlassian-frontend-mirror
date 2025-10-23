import type { DocNode } from '@atlaskit/adf-schema';

export const syncBlockWithParagraphAndPanelAdf: DocNode = {
	version: 1,
	type: 'doc',
	content: [
		{
			type: 'syncBlock',
			attrs: {
				resourceId: 'test-sync-block-with-paragraph-and-panel',
				localId: '626d746e-50af-4ac9-b468-5f9685de50b6',
			},
		},
	],
};
