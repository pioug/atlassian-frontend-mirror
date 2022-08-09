import { _getCopyButtonTestSuite } from '../../../copy-button/__tests__/visual-regression/_getCopyButtonTestSuite';
import { codeBlockSelectors } from '../../../../__tests__/__helpers/page-objects/_code-block';
import { basicCodeBlock } from '../__fixtures__/basic-code-block';

_getCopyButtonTestSuite({
  nodeName: 'Code block',
  editorOptions: {
    defaultValue: basicCodeBlock,
    codeBlock: { allowCopyToClipboard: true },
  },
  nodeSelector: codeBlockSelectors.content,
});
