import React, { memo, ReactNode } from 'react';

import { PrismAsyncLight as SyntaxHighlighter } from 'react-syntax-highlighter';

import { normalizeLanguage } from '../supportedLanguages';
import { applyTheme } from '../themes/themeBuilder';

import type { CommonCodeProps } from './types';

export interface CodeProps extends CommonCodeProps {
  /** The styles that will be used when prism highlighter has tokenised the output */
  codeStyle?: Partial<ReturnType<typeof applyTheme>['inlineCodeStyle']>;
  /** The props that will be spread into the `<code>` tag. Useful for styling/assigning classNames */
  codeTagProps?: {};
  /** The element or custom react component to use in place of the default span tag */
  preTag?: ReactNode | string;
}

const Code = ({
  language = 'text',
  theme = {},
  codeStyle,
  codeTagProps = {},
  preTag = 'span',
  testId,
  text,
}: CodeProps) => {
  const { inlineCodeStyle } = applyTheme(theme);

  const props = {
    language: normalizeLanguage(language),
    PreTag: preTag,
    style: codeStyle || inlineCodeStyle,
    codeTagProps: codeTagProps,
  };

  return (
    <SyntaxHighlighter
      data-code-lang={language}
      data-testid={testId}
      {...props}
    >
      {text}
    </SyntaxHighlighter>
  );
};

export default memo(Code);
