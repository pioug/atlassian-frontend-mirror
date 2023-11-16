export const oneImage = {
  version: 1,
  type: 'doc',
  content: [
    {
      type: 'mediaSingle',
      attrs: {
        width: 66.67,
        layout: 'wrap-left',
      },
      content: [
        {
          type: 'media',
          attrs: {
            id: 'a559980d-cd47-43e2-8377-27359fcb905f',
            type: 'file',
            collection: 'MediaServicesSample',
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

export const imageWithCaption = {
  type: 'doc',
  content: [
    {
      type: 'paragraph',
    },
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
            id: 'a559980d-cd47-43e2-8377-27359fcb905f',
            type: 'file',
            collection: 'MediaServicesSample',
            occurrenceKey: null,
            alt: 'test',
            width: 500,
            height: 374,
            url: null,
          },
        },
        {
          type: 'caption',
          content: [
            {
              type: 'text',
              text: 'world',
            },
          ],
        },
      ],
    },
    {
      type: 'paragraph',
      content: [
        {
          type: 'text',
          text: 'last paragraph',
        },
      ],
    },
  ],
};
