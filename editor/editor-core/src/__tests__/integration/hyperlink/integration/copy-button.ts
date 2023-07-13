import { hyperlinkSelectors } from '@atlaskit/editor-test-helpers/page-objects/hyperlink';

import { _getCopyButtonTestSuite } from '../../../../plugins/copy-button/__tests__/integration/_getCopyButtonTestSuite';
import hyperlinkCopyButtonExample from '../__fixtures__/hyperlink-copy-button-example.adf.json';

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
