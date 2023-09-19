// eslint-disable-next-line import/no-extraneous-dependencies -- Removed import for fixing circular dependencies
import { hyperlinkSelectors } from '@atlaskit/editor-test-helpers/page-objects/hyperlink';

import { _getCopyButtonTestSuite } from '../../../../../src/__tests__/visual-regression/copy-button/_getCopyButtonTestSuite';
import hyperlink from '../__fixtures__/basic-hyperlink.adf.json';

_getCopyButtonTestSuite({
  nodeName: 'Hyperlink',
  editorOptions: { allowPanel: true, defaultValue: hyperlink },
  nodeSelector: hyperlinkSelectors.hyperlink,
});
