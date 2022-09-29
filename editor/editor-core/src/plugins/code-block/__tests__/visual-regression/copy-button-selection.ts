import { _getCopyButtonTestSuite } from '../../../copy-button/__tests__/visual-regression/_getCopyButtonTestSuite';
import { codeBlockSelectors } from '@atlaskit/editor-test-helpers/page-objects/code-block';
import { basicCodeBlock } from '../__fixtures__/basic-code-block';

_getCopyButtonTestSuite({
  nodeName: 'Code block',
  editorOptions: {
    defaultValue: basicCodeBlock,
    codeBlock: { allowCopyToClipboard: true },
  },
  nodeSelector: codeBlockSelectors.content,
  copyButtonText: 'Copy as text',
});
