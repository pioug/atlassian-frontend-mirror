import { _getCopyButtonTestSuite } from '../../../copy-button/__tests__/unit/_getCopyButtonTestSuite';
import {
  doc,
  media,
  mediaSingle,
} from '@atlaskit/editor-test-helpers/doc-builder';

_getCopyButtonTestSuite({
  nodeType: 'mediaSingle',
  editorOptions: {
    media: {
      allowMediaSingle: true,
    },
  },
  doc: doc(
    mediaSingle()(
      media({
        url: 'http://path/to/image.jpg',
        type: 'external',
        alt: 'Alt text',
      })(),
    ),
  ),
});
