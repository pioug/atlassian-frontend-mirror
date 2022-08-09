/** @jsx jsx */
import { jsx } from '@emotion/react';
import { injectIntl, WrappedComponentProps } from 'react-intl-next';

import { CodeBlockSharedCssClassName } from '@atlaskit/editor-common/styles';
import { CodeBlock as AkCodeBlock } from '@atlaskit/code';
import type { SupportedLanguages } from '@atlaskit/code';
import { codeBidiWarningMessages } from '@atlaskit/editor-common/messages';

import CodeBlockContainer from './components/codeBlockContainer';

export interface Props {
  text: string;
  language: SupportedLanguages;
  allowCopyToClipboard?: boolean;
  codeBidiWarningTooltipEnabled: boolean;
  className?: string;
}

function CodeBlock(props: Props & WrappedComponentProps) {
  const {
    text,
    language,
    allowCopyToClipboard = false,
    codeBidiWarningTooltipEnabled,
  } = props;

  const codeBidiWarningLabel = props.intl.formatMessage(
    codeBidiWarningMessages.label,
  );

  const className = [
    CodeBlockSharedCssClassName.CODEBLOCK_CONTAINER,
    props.className,
  ].join(' ');

  return (
    <CodeBlockContainer
      text={text}
      className={className}
      allowCopyToClipboard={allowCopyToClipboard}
    >
      <AkCodeBlock
        language={language}
        text={text}
        codeBidiWarningLabel={codeBidiWarningLabel}
        codeBidiWarningTooltipEnabled={codeBidiWarningTooltipEnabled}
      />
    </CodeBlockContainer>
  );
}

export default injectIntl(CodeBlock);
