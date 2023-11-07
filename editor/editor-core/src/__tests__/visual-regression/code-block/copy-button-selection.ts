import { _getCopyButtonTestSuite } from '../copy-button/_getCopyButtonTestSuite';
// eslint-disable-next-line import/no-extraneous-dependencies -- Removed import for fixing circular dependencies
import { codeBlockSelectors } from '@atlaskit/editor-test-helpers/page-objects/code-block';
import { basicCodeBlock } from '../../__fixtures__/code-block/basic-code-block';

_getCopyButtonTestSuite({
  nodeName: 'Code block',
  editorOptions: {
    defaultValue: basicCodeBlock,
    codeBlock: { allowCopyToClipboard: true },
  },
  nodeSelector: codeBlockSelectors.content,
  copyButtonText: 'Copy as text',
});
