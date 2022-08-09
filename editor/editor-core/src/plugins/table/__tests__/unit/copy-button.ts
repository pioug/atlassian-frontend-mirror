import { _getCopyButtonTestSuite } from '../../../copy-button/__tests__/unit/_getCopyButtonTestSuite';
import {
  doc,
  p,
  table,
  tr,
  td,
} from '@atlaskit/editor-test-helpers/doc-builder';

_getCopyButtonTestSuite({
  nodeType: 'table',
  editorOptions: {
    allowTables: {
      advanced: true,
    },
  },
  doc: doc(table()(tr(td({})(p())), tr(td({})(p())), tr(td({})(p())))),
});
