// To match mocked date
const mockedDate = new Date(Date.UTC(2017, 7, 16));

export const taskWithDateAdf = {
	version: 1,
	type: 'doc',
	content: [
		{
			type: 'taskList',
			content: [
				{
					type: 'taskItem',
					content: [
						{
							type: 'date',
							attrs: {
								timestamp: mockedDate,
							},
						},
					],
					attrs: {
						localId: 'test-list-id',
						state: 'TODO',
					},
				},
			],
			attrs: {
				localId: 'test-id',
			},
		},
		{
			type: 'paragraph',
			content: [],
		},
	],
};
