import { testMediaFileId } from '@atlaskit/editor-test-helpers';

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
            id: testMediaFileId,
            type: 'file',
            collection: 'MediaServicesSample',
            width: 2378,
            height: 628,
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
