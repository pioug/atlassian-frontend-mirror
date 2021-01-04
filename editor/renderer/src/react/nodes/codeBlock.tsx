import React from 'react';
import styled from 'styled-components';
import { CodeBlock as AkCodeBlock } from '@atlaskit/code';
import { overflowShadow } from '@atlaskit/editor-shared-styles';
import * as colors from '@atlaskit/theme/colors';
import { themed } from '@atlaskit/theme/components';
import { fontSize } from '@atlaskit/theme/constants';
import CopyButton from './codeBlockCopyButton';

export interface Props {
  text: string;
  language: string;
  allowCopyToClipboard?: boolean;
  className?: string;
}

// code blocks eat trailing empty newlines, add a bogus additional one
// to get one rendered 🤷‍♀️
function patch(text: string): string {
  return text[text.length - 1] === '\n' ? text + '\n' : text;
}

const CodeBlock: React.FC<Props> = function CodeBlock(props) {
  const { text, language, allowCopyToClipboard = false } = props;

  const className = ['code-block', props.className].join(' ');

  return (
    <div className={className}>
      {allowCopyToClipboard ? <CopyButton content={text} /> : null}
      <AkCodeBlock language={language} text={patch(text)} />
    </div>
  );
};

export default styled(CodeBlock)`
  /* 😢 no other way */
  > span:last-child {
    background: ${overflowShadow({
      background: themed({ light: colors.N20, dark: colors.DN50 }),
      width: '8px',
    })}!important;
    background-attachment: local, scroll, scroll !important;
    background-position: 100% 0, 100% 0, 0 0 !important;
    background-color: ${themed({
      light: colors.N20,
      dark: colors.DN50,
    })}!important;
  }

  code:first-child {
    /* gutter */
    font-size: ${fontSize() + 1}px !important;
    line-height: 22px !important;
  }
  code:last-child {
    /* content */
    font-size: ${fontSize()}px !important;
    line-height: 22px !important;
  }
`;
