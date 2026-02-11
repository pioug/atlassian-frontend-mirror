type Item = {
	title: string;
	numbering: string;
	page: number;
	children?: Item[];
	id: string;
};

/**
 * Wrapped in a function, so that examples which manipulate data have unique instances.
 */
export const getDefaultItems: () => Item[] = (): Item[] => [
	{
		title: 'Chapter 1: Clean code',
		page: 1,
		numbering: '1',
		id: 'chapter-one',
	},
	{
		title: 'Chapter 2: Meaningful names',
		page: 17,
		numbering: '2',
		id: 'chapter-two',
		children: [
			{
				title: 'Section 2.1: Naming conventions',
				page: 17,
				numbering: '2.1',
				id: 'section-two-one',
			},
		],
	},
];

let lastId = 2;
export const fetchNewItems: () => Promise<Item[]> = async (): Promise<Item[]> => {
	const id = lastId++;
	return [
		{
			title: `Section 2.${id}`,
			numbering: `2.${id}`,
			page: 17,
			id: `section-two-${id}`,
		},
	];
};

export const fetchItems: () => Promise<Item[]> = async (): Promise<Item[]> => {
	return new Promise((resolve) => {
		setTimeout(() => {
			resolve([
				{
					title: 'Section 2.1: Naming conventions',
					page: 17,
					numbering: '2.1',
					id: 'section-two-one',
				},
			]);
		}, 1500);
	});
};

export default getDefaultItems();
