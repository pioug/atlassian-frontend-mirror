export type Node = {
	id: number;
	parentId?: number;
	name: string;
	jobTitle: string;
	children?: Node[];
};

export const rootNode: Node = {
	id: 1,
	name: 'Lydia',
	jobTitle: 'CEO',
	children: [
		{
			id: 2,
			name: 'Joey',
			parentId: 1,
			jobTitle: 'Archetect',
			children: [
				{
					id: 3,
					parentId: 2,
					name: 'Ivan',
					jobTitle: 'lead',
					children: [
						{
							id: 4,
							parentId: 3,
							name: 'Daniel',
							jobTitle: 'intern',
						},
					],
				},
				{
					id: 5,
					parentId: 2,
					name: 'Miles',
					jobTitle: 'lead',
				},
			],
		},
	],
};
