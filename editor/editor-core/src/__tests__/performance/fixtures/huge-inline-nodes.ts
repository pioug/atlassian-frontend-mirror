export const manyDates = {
	version: 1,
	type: 'doc',
	content: [
		{
			type: 'paragraph',
			content: [
				...Array.from({ length: 300 }, () => ({
					type: 'date',
					attrs: {
						timestamp: '1551398400000',
					},
				})),
			],
		},
	],
};

export const manyStatuses = {
	version: 1,
	type: 'doc',
	content: [
		{
			type: 'paragraph',
			content: [
				...Array.from({ length: 300 }, () => ({
					type: 'status',
					attrs: {
						text: 'not started',
						color: 'neutral',
						localId: 'e2ea8bec-2b6e-492c-8665-cbfe95a200f5',
						style: '',
					},
				})),
			],
		},
	],
};

export const manyEmoji = {
	version: 1,
	type: 'doc',
	content: [
		{
			type: 'paragraph',
			content: [
				...Array.from({ length: 300 }, () => ({
					type: 'emoji',
					attrs: {
						shortName: ':grinning:',
						id: '1f600',
						text: '😀',
					},
				})),
			],
		},
	],
};

export const manyTasks = {
	version: 1,
	type: 'doc',
	content: [
		{
			type: 'taskList',
			attrs: {
				localId: 'd4367ae3-5f11-4ff6-9a1d-e019f0c58218',
			},
			content: [
				...Array.from({ length: 300 }, () => ({
					type: 'taskItem',
					attrs: {
						state: 'TODO',
					},
					content: [
						{
							type: 'text',
							text: 'hello',
						},
					],
				})),
			],
		},
	],
};

export const manyDecisions = {
	version: 1,
	type: 'doc',
	content: [
		{
			type: 'decisionList',
			attrs: {
				localId: '8db833ad-e2c7-4036-9e68-db3d5b478e2f',
			},
			content: [
				...Array.from({ length: 300 }, () => ({
					type: 'decisionItem',
					attrs: {
						state: 'DECIDED',
					},
					content: [
						{
							type: 'text',
							text: `Decision`,
						},
					],
				})),
			],
		},
	],
};

export const manyMentions = {
	version: 1,
	type: 'doc',
	content: [
		...Array.from({ length: 300 }, () => ({
			type: 'mention',
			attrs: {
				id: '1',
				text: '@Oscar Wallhult',
			},
		})),
	],
};
