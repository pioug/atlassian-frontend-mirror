/**
 * Starting document for the example: one paragraph that validates, then a planted problem of each
 * kind — an invalid attribute value, an unknown attribute, invalid content, an unsupported mark and
 * a missing required prop.
 */
export const DEFAULT_ADF: string = JSON.stringify(
	{
		version: 1,
		type: 'doc',
		content: [
			{
				type: 'paragraph',
				content: [{ type: 'text', text: 'This paragraph is fine.' }],
			},
			{
				type: 'heading',
				attrs: { level: 9 },
				content: [{ type: 'text', text: 'Heading levels only go up to 6' }],
			},
			{
				type: 'panel',
				attrs: { panelType: 'info', colour: 'blue' },
				content: [
					{
						type: 'paragraph',
						content: [{ type: 'text', text: 'Panels have no "colour" attribute' }],
					},
				],
			},
			{
				type: 'paragraph',
				content: [
					{
						type: 'paragraph',
						content: [{ type: 'text', text: 'A paragraph cannot hold a paragraph' }],
					},
				],
			},
			{
				type: 'codeBlock',
				content: [{ type: 'text', text: 'no marks allowed here', marks: [{ type: 'strong' }] }],
			},
			{
				type: 'paragraph',
				content: [{ type: 'emoji' }],
			},
		],
	},
	null,
	2,
);
