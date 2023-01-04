const listItem = {
  type: 'listItem',
  content: [
    {
      type: 'paragraph',
      content: [
        {
          type: 'text',
          text: ' ',
        },
      ],
    },
  ],
};

const withTable = (content: any) => ({
  type: 'table',
  attrs: {
    isNumberColumnEnabled: false,
    layout: 'default',
    localId: 'mock-local-id',
  },
  content: [
    {
      type: 'tableRow',
      content: [
        {
          type: 'tableCell',
          attrs: {},
          content,
        },
      ],
    },
  ],
});

export const createListWithNItems = (
  itemsCount: number,
  wrapListInTable: boolean = false,
) => {
  const orderedList = {
    type: 'orderedList',
    content: Array(itemsCount).fill(listItem),
  };

  let content = [orderedList];

  if (wrapListInTable) {
    content = [withTable([orderedList])];
  }

  return {
    version: 1,
    type: 'doc',
    content,
  };
};
