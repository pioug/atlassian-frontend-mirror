import { _getCopyButtonTestSuite } from '../../../copy-button/__tests__/visual-regression/_getCopyButtonTestSuite';
import { hyperlinkSelectors } from '@atlaskit/editor-test-helpers/page-objects/hyperlink';
import hyperlink from '../__fixtures__/basic-hyperlink.adf.json';

_getCopyButtonTestSuite({
  nodeName: 'Hyperlink',
  editorOptions: { allowPanel: true, defaultValue: hyperlink },
  nodeSelector: hyperlinkSelectors.hyperlink,
});
