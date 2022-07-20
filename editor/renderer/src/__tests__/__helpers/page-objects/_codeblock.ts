import { CodeBlockSharedCssClassName } from '@atlaskit/editor-common/styles';
import { LightWeightCodeBlockCssClassName } from '../../../react/nodes/codeBlock/components/lightWeightCodeBlock';

export const selectors = {
  codeBlock: `.${CodeBlockSharedCssClassName.CODEBLOCK_CONTAINER}`,
  copyToClipboardButton: `.copy-to-clipboard`,
  lightWeightCodeBlock: `.${LightWeightCodeBlockCssClassName.CONTAINER}`,
  designSystemCodeBlock: CodeBlockSharedCssClassName.DS_CODEBLOCK,
};
