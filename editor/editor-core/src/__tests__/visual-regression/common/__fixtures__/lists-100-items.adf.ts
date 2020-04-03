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

export default {
  version: 1,
  type: 'doc',
  content: [
    {
      type: 'orderedList',
      content: Array(100).fill(listItem),
    },
  ],
};
