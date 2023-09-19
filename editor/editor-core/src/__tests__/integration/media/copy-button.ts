import { _getCopyButtonTestSuite } from '../../integration/copy-button/_getCopyButtonTestSuite';
const mediaAdf = {
  version: 1,
  type: 'doc',
  content: [
    {
      type: 'mediaSingle',
      attrs: {
        width: 33.33333333333333,
        layout: 'center',
      },
      content: [
        {
          type: 'media',
          attrs: {
            id: 'a559980d-cd47-43e2-8377-27359fcb905f',
            type: 'file',
            collection: 'MediaServicesSample',
            width: 1604,
            height: 1868,
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

_getCopyButtonTestSuite({
  nodeName: 'Media',
  editorOptions: {
    media: {
      allowMediaSingle: true,
    },
    defaultValue: mediaAdf,
  },
  nodeSelector: '.media-single-node',
});
