export const simpleMediaGroup = {
  type: 'doc',
  version: 1,
  content: [
    {
      type: 'mediaGroup',
      content: [
        {
          type: 'media',
          attrs: {
            id: '6c160aba-2294-4a1e-a793-33b002267735',
            type: 'file',
            collection: 'MediaServicesSample',
          },
        },
      ],
    },
  ],
};

export const simpleMediaSingleWithAltText = {
  version: 1,
  type: 'doc',
  content: [
    {
      type: 'mediaSingle',
      attrs: {
        width: null,
        layout: 'center',
      },
      content: [
        {
          type: 'media',
          attrs: {
            type: 'file',
            collection: 'MediaServicesSample',
            id: 'a559980d-cd47-43e2-8377-27359fcb905f',
            width: 500,
            height: 374,
            alt: 'test',
          },
        },
      ],
    },
    {
      type: 'paragraph',
      content: [],
    },
  ],
};
