import { _getCopyButtonTestSuite } from '../../../../src/__tests__/visual-regression/copy-button/_getCopyButtonTestSuite';
import * as mediaAdf from './__fixtures__/media.adf.json';

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
