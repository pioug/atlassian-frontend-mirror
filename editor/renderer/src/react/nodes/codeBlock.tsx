import React from 'react';
import styled from 'styled-components';
import { CodeBlock as AkCodeBlock, SupportedLanguages } from '@atlaskit/code';
import {
  overflowShadow,
  relativeFontSizeToBase16,
} from '@atlaskit/editor-shared-styles';
import { N20, DN50 } from '@atlaskit/theme/colors';
import { themed } from '@atlaskit/theme/components';
import { fontSize, gridSize } from '@atlaskit/theme/constants';

import CopyButton from './codeBlockCopyButton';

export interface Props {
  text: string;
  language: SupportedLanguages;
  allowCopyToClipboard?: boolean;
  className?: string;
}

function CodeBlock(props: Props) {
  const { text, language, allowCopyToClipboard = false } = props;

  const className = ['code-block', props.className].join(' ');

  return (
    <div className={className}>
      {allowCopyToClipboard ? <CopyButton content={text} /> : null}
      <AkCodeBlock language={language} text={text} />
    </div>
  );
}

export default styled(CodeBlock)`
  tab-size: 4;
  [data-ds--code--code-block] {
    font-size: ${relativeFontSizeToBase16(fontSize())};
    line-height: 1.5rem;
    background-image: ${overflowShadow({
      background: themed({ light: N20, dark: DN50 }),
      width: `${gridSize()}px`,
    })};
    background-attachment: local, scroll, scroll;
    background-position: 100% 0, 100% 0, 0 0;
  }
`;
