import { _getCopyButtonTestSuite } from '../../../copy-button/__tests__/integration/_getCopyButtonTestSuite';
import basicHyperlinkAdf from '../__fixtures__/basic-hyperlink.adf.json';
import { hyperlinkSelectors } from '../../../../__tests__/__helpers/page-objects/_hyperlink';

_getCopyButtonTestSuite({
  nodeName: 'Hyperlink',
  editorOptions: { defaultValue: basicHyperlinkAdf },
  nodeSelector: hyperlinkSelectors.hyperlink,
});
