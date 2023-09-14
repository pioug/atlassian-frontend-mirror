import { _getCopyButtonTestSuite } from '../../../copy-button/__tests__/unit/_getCopyButtonTestSuite';
// eslint-disable-next-line import/no-extraneous-dependencies -- Removed import for fixing circular dependencies
import { doc, p, panel } from '@atlaskit/editor-test-helpers/doc-builder';

_getCopyButtonTestSuite({
  nodeType: 'panel',
  editorOptions: {
    allowPanel: true,
  },
  doc: doc(panel({ type: 'info' })(p('text{<>}'))),
});
