import { testMediaSingle } from '@atlaskit/editor-test-helpers/media-mock';

export default {
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
            id: testMediaSingle.id,
            type: 'file',
            collection: 'MediaServicesSample',
            width: testMediaSingle.width,
            height: testMediaSingle.height,
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
