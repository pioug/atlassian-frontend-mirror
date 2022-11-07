import { _getCopyButtonTestSuite } from '../../../copy-button/__tests__/integration/_getCopyButtonTestSuite';
import hyperlinkCopyButtonExample from '../__fixtures__/hyperlink-copy-button-example.adf.json';
import { hyperlinkSelectors } from '@atlaskit/editor-test-helpers/page-objects/hyperlink';

_getCopyButtonTestSuite({
  nodeName: 'Hyperlink',
  editorOptions: { defaultValue: hyperlinkCopyButtonExample },
  nodeSelector: hyperlinkSelectors.hyperlink,
  // At time of writing -- pasting on safari in webdriver was
  // broken.
  // This test is not testing code which is expected to have divergent
  // behaviour across browsers -- so skipping safari should not reduce
  // greatly confidence.
  skip: ['safari'],
});
