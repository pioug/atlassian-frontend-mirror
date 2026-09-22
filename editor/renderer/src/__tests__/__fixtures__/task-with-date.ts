// To match the mocked browser date in the Playwright renderer fixture.
const mockedDate = Date.UTC(2017, 7, 16).toString();

export const taskWithDateAdf: {
	content: (
		| {
				attrs: {
					localId: string;
				};
				content: {
					attrs: {
						localId: string;
						state: string;
					};
					content: {
						attrs: {
							timestamp: string;
						};
						type: string;
					}[];
					type: string;
				}[];
				type: string;
		  }
		| {
				attrs?: undefined;
				content: never[];
				type: string;
		  }
	)[];
	type: string;
	version: number;
} = {
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
