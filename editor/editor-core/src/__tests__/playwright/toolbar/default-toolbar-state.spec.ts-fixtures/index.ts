import type { DocNode } from '@atlaskit/adf-schema';

export const headingAndFormattingAdf: DocNode = {
	version: 1,
	type: 'doc',
	content: [
		{
			type: 'heading',
			attrs: { level: 3 },
			content: [{ type: 'text', text: 'Heading content' }],
		},
		{
			type: 'paragraph',
			content: [
				{
					type: 'text',
					text: 'Bold and italic',
					marks: [{ type: 'strong' }, { type: 'em' }],
				},
			],
		},
	],
};

export const rightAlignedAdf: DocNode = {
	version: 1,
	type: 'doc',
	content: [
		{
			type: 'paragraph',
			marks: [{ type: 'alignment', attrs: { align: 'end' } }],
			content: [{ type: 'text', text: 'Right aligned text' }],
		},
	],
};

export const highlightAdf: DocNode = {
	version: 1,
	type: 'doc',
	content: [
		{
			type: 'paragraph',
			content: [
				{
					type: 'text',
					text: 'hello ',
				},
				{
					type: 'text',
					text: 'world!',
					marks: [{ type: 'backgroundColor', attrs: { color: '#fdd0ec' } }],
				},
			],
		},
	],
};

export const taskListAdf: DocNode = {
	version: 1,
	type: 'doc',
	content: [
		{
			type: 'taskList',
			attrs: {
				localId: 'default-toolbar-state-task-list',
			},
			content: [
				{
					type: 'taskItem',
					attrs: {
						localId: 'default-toolbar-state-task-item',
						state: 'TODO',
					},
					content: [
						{
							type: 'text',
							text: 'Task item',
						},
					],
				},
			],
		},
	],
};
