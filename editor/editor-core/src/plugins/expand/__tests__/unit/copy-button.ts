import { _getCopyButtonTestSuite } from '../../../copy-button/__tests__/unit/_getCopyButtonTestSuite';
import { doc, p, expand } from '@atlaskit/editor-test-helpers/doc-builder';

_getCopyButtonTestSuite({
  nodeType: 'expand',
  editorOptions: {
    allowExpand: true,
  },
  doc: doc(expand()(p('text{<>}'))),
});
