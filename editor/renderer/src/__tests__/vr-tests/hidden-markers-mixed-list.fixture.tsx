import { generateRendererComponent } from '../__helpers/rendererComponents';

const hiddenMarkersMixedListAdf = {
	version: 1,
	type: 'doc',
	content: [
		{
			type: 'paragraph',
			content: [
				{
					type: 'text',
					text: 'Task list nested inside a bullet list (task checkboxes should be visible)',
				},
			],
		},
		{
			type: 'bulletList',
			content: [
				{
					type: 'listItem',
					content: [
						{
							type: 'paragraph',
							content: [{ type: 'text', text: 'Bullet item with text' }],
						},
					],
				},
				{
					type: 'listItem',
					content: [
						{
							type: 'taskList',
							attrs: { localId: 'tl-in-bullet-1' },
							content: [
								{
									type: 'taskItem',
									attrs: { localId: 'ti-in-bullet-1', state: 'TODO' },
									content: [{ type: 'text', text: 'Task inside bullet list' }],
								},
								{
									type: 'taskItem',
									attrs: { localId: 'ti-in-bullet-2', state: 'DONE' },
									content: [{ type: 'text', text: 'Completed task inside bullet list' }],
								},
							],
						},
					],
				},
				{
					type: 'listItem',
					content: [
						{
							type: 'paragraph',
							content: [{ type: 'text', text: 'Another bullet item' }],
						},
					],
				},
			],
		},
		{
			type: 'paragraph',
			content: [
				{
					type: 'text',
					text: 'Task list nested inside an ordered list (task checkboxes should be visible)',
				},
			],
		},
		{
			type: 'orderedList',
			attrs: { order: 1 },
			content: [
				{
					type: 'listItem',
					content: [
						{
							type: 'paragraph',
							content: [{ type: 'text', text: 'Ordered item with text' }],
						},
					],
				},
				{
					type: 'listItem',
					content: [
						{
							type: 'taskList',
							attrs: { localId: 'tl-in-ordered-1' },
							content: [
								{
									type: 'taskItem',
									attrs: { localId: 'ti-in-ordered-1', state: 'TODO' },
									content: [{ type: 'text', text: 'Task inside ordered list' }],
								},
								{
									type: 'taskItem',
									attrs: { localId: 'ti-in-ordered-2', state: 'TODO' },
									content: [{ type: 'text', text: 'Another task inside ordered list' }],
								},
							],
						},
					],
				},
				{
					type: 'listItem',
					content: [
						{
							type: 'paragraph',
							content: [{ type: 'text', text: 'Another ordered item' }],
						},
					],
				},
			],
		},
		{
			type: 'paragraph',
			content: [
				{
					type: 'text',
					text: 'Deeply nested mixed list types',
				},
			],
		},
		{
			type: 'bulletList',
			content: [
				{
					type: 'listItem',
					content: [
						{
							type: 'paragraph',
							content: [{ type: 'text', text: 'Level 1 bullet item' }],
						},
					],
				},
				{
					type: 'listItem',
					content: [
						{
							type: 'orderedList',
							attrs: { order: 1 },
							content: [
								{
									type: 'listItem',
									content: [
										{
											type: 'paragraph',
											content: [
												{
													type: 'text',
													text: 'Level 2 ordered item',
												},
											],
										},
									],
								},
								{
									type: 'listItem',
									content: [
										{
											type: 'taskList',
											attrs: { localId: 'tl-deep-mixed' },
											content: [
												{
													type: 'taskItem',
													attrs: {
														localId: 'ti-deep-mixed-1',
														state: 'TODO',
													},
													content: [
														{
															type: 'text',
															text: 'Level 3 task inside ordered inside bullet',
														},
													],
												},
											],
										},
									],
								},
							],
						},
					],
				},
				{
					type: 'listItem',
					content: [
						{
							type: 'paragraph',
							content: [{ type: 'text', text: 'Level 1 bullet item again' }],
						},
					],
				},
			],
		},
	],
};

export const HiddenMarkersMixedListRenderer = generateRendererComponent({
	document: hiddenMarkersMixedListAdf,
	appearance: 'full-page',
});

export const HiddenMarkersMixedListCommentRenderer = generateRendererComponent({
	document: hiddenMarkersMixedListAdf,
	appearance: 'comment',
});
