// eslint-disable-next-line import/no-extraneous-dependencies -- Removed import for fixing circular dependencies
import { hyperlinkSelectors } from '@atlaskit/editor-test-helpers/page-objects/hyperlink';

import { _getCopyButtonTestSuite } from '../../../../../src/__tests__/integration/copy-button/_getCopyButtonTestSuite';
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
  skipTests: { 'Copy block with floating toolbar copy button': ['safari'] },
});
