import { _getCopyButtonTestSuite } from '../../../copy-button/__tests__/unit/_getCopyButtonTestSuite';
import {
  doc,
  p,
  layoutSection,
  layoutColumn,
} from '@atlaskit/editor-test-helpers/doc-builder';

_getCopyButtonTestSuite({
  nodeType: 'layoutColumn',
  editorOptions: {
    allowLayouts: true,
  },
  doc: doc(
    layoutSection(
      layoutColumn({ width: 50 })(p('{<>}')),
      layoutColumn({ width: 50 })(p('')),
    ),
  ),
});
