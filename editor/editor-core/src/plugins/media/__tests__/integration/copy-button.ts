import { _getCopyButtonTestSuite } from '../../../copy-button/__tests__/integration/_getCopyButtonTestSuite';
import * as mediaAdf from '../visual-regression/__fixtures__/media.adf.json';

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
