import { presidents } from './presidents';

interface President {
  id: number;
  name: string;
  party: string;
  term: string;
}

function createKey(input: string) {
  return input ? input.replace(/^(the|a|an)/, '').replace(/\s/g, '') : input;
}

export const caption = 'List of US Presidents';

export const createHead = (withWidth: boolean) => {
  return {
    cells: [
      {
        key: 'name',
        content: 'Name',
        isSortable: true,
        width: withWidth ? 25 : undefined,
      },
      {
        key: 'party',
        content: 'Party',
        shouldTruncate: true,
        isSortable: true,
        width: withWidth ? 15 : undefined,
      },
      {
        key: 'term',
        content: 'Term',
        shouldTruncate: true,
        isSortable: true,
        width: withWidth ? 10 : undefined,
      },
    ],
  };
};

export const head = createHead(true);

export const rows = presidents.map((president: President, index: number) => ({
  key: `row-${index}-${president.name}`,
  isHighlighted: false,
  cells: [
    {
      key: createKey(president.name),
      content: president.name,
    },
    {
      key: createKey(president.party),
      content: president.party,
    },
    {
      key: president.id,
      content: president.term,
    },
  ],
}));
