import React from 'react';
import styled from 'styled-components';
import { CodeBlock as AkCodeBlock } from '@atlaskit/code';
import { overflowShadow } from '@atlaskit/editor-shared-styles';
import * as colors from '@atlaskit/theme/colors';
import { themed } from '@atlaskit/theme/components';
import { gridSize } from '@atlaskit/theme/constants';

import CopyButton from './codeBlockCopyButton';

export interface Props {
  text: string;
  language: string;
  allowCopyToClipboard?: boolean;
  className?: string;
}

const defaultThemeOverride = { codeFontSize: 14, codeLineHeight: '24px' };

const CodeBlock: React.FC<Props> = function CodeBlock(props) {
  const { text, language, allowCopyToClipboard = false } = props;

  const className = ['code-block', props.className].join(' ');

  return (
    <div className={className}>
      {allowCopyToClipboard ? <CopyButton content={text} /> : null}
      <AkCodeBlock
        language={language}
        text={text}
        themeOverride={defaultThemeOverride}
      />
    </div>
  );
};

export default styled(CodeBlock)`
  [data-code-block] > span:last-child {
    background-image: ${overflowShadow({
      background: themed({ light: colors.N20, dark: colors.DN50 }),
      width: `${gridSize()}px`,
    })};
    background-attachment: local, scroll, scroll;
    background-position: 100% 0, 100% 0, 0 0;
  }
`;
