import { _getCopyButtonTestSuite } from '../../../copy-button/__tests__/integration/_getCopyButtonTestSuite';
import basicHyperlinkAdf from '../__fixtures__/basic-hyperlink.adf.json';
import { hyperlinkSelectors } from '@atlaskit/editor-test-helpers/page-objects/hyperlink';

_getCopyButtonTestSuite({
  nodeName: 'Hyperlink',
  editorOptions: { defaultValue: basicHyperlinkAdf },
  nodeSelector: hyperlinkSelectors.hyperlink,
});
