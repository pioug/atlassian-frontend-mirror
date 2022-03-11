type Item = {
  title: string;
  numbering: string;
  page: number;
  children?: Item[];
};

/**
 * Wrapped in a function, so that examples which manipulate data have unique instances.
 */
export const getDefaultItems = (): Item[] => [
  {
    title: 'Chapter 1: Clean Code',
    page: 1,
    numbering: '1',
  },
  {
    title: 'Chapter 2: Meaningful names',
    page: 17,
    numbering: '2',
    children: [
      {
        title: 'Section 2.1: Naming conventions',
        page: 17,
        numbering: '2.1',
      },
    ],
  },
];

let lastId = 2;
export const fetchNewItems = async (): Promise<Item[]> => {
  const id = lastId++;
  return [
    {
      title: `Section 2.${id}`,
      numbering: `2.${id}`,
      page: 17,
    },
  ];
};

export const fetchItems = async (): Promise<Item[]> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve([
        {
          title: 'Section 2.1: Naming conventions',
          page: 17,
          numbering: '2.1',
        },
      ]);
    }, 1500);
  });
};

export default getDefaultItems();
