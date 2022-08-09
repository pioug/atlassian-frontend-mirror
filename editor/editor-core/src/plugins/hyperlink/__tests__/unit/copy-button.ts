import { _getCopyButtonTestSuite } from '../../../copy-button/__tests__/unit/_getCopyButtonTestSuite';
import { doc, p, a } from '@atlaskit/editor-test-helpers/doc-builder';

_getCopyButtonTestSuite({
  nodeName: 'Hyperlink',
  nodeType: 'paragraph',
  doc: doc(p(a({ href: 'google.com' })('{<>}google'))),
});
