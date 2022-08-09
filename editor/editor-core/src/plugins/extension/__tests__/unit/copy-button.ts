import { _getCopyButtonTestSuite } from '../../../copy-button/__tests__/unit/_getCopyButtonTestSuite';
import { doc, extension } from '@atlaskit/editor-test-helpers/doc-builder';

_getCopyButtonTestSuite({
  nodeType: 'extension',
  editorOptions: {
    allowExtension: true,
  },
  doc: doc(extension({ extensionKey: 'key', extensionType: 'type' })()),
});
