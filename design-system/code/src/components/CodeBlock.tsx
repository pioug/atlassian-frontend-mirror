/** @jsx jsx */
import { HTMLProps, memo, useCallback } from 'react';

import { InterpolationWithTheme, jsx } from '@emotion/core';
import {
  PrismAsync as SyntaxHighlighter,
  SyntaxHighlighterProps,
} from 'react-syntax-highlighter';

import type { ThemeProps } from '@atlaskit/theme/types';

import { normalizeLanguage } from '../supportedLanguages';
import { applyTheme } from '../themes/themeBuilder';
import type { CodeBlockTheme } from '../themes/types';

import { useHighlightLines } from './hooks/use-highlight';
import type { CommonCodeProps } from './types';

export interface CodeBlockProps extends CommonCodeProps {
  /**
   * A temporary prop to allow users to override theme styles
   * without losing the theme context
   **/
  themeOverride?: CodeBlockTheme | ThemeProps;
  /**
   * Lines to highlight comma delimited.
   * Example uses:

   * - To highlight one line `highlight="3"`
   * - To highlight a group of lines `highlight="1-5"`
   * - To highlight multiple groups `highlight="1-5,7,10,15-20"`
   */
  highlight?: string;
  /** Screen reader text for the start of a highlighted line */
  highlightedStartText?: string;
  /** Screen reader text for the end of a highlighted line  */
  highlightedEndText?: string;
}

const CodeBlock = ({
  showLineNumbers = true,
  language = 'text',
  theme = {},
  themeOverride = {},
  highlight = '',
  highlightedStartText = 'Highlight start',
  highlightedEndText = 'Highlight end',
  testId,
  text,
}: CodeBlockProps) => {
  // TODO look at memoising this
  const numLines = (text || '').split('\n').length;

  const {
    lineNumberStyle,
    codeBlockStyle,
    codeContainerStyle,
    codeLayoutContainer,
  } = applyTheme({ ...theme, ...themeOverride }, numLines);

  const { getHighlightStyles, highlightedLines } = useHighlightLines({
    highlight,
    testId,
  });

  const getLineProps = useCallback(
    (line: number) => getHighlightStyles(line, highlightedLines),
    [getHighlightStyles, highlightedLines],
  );

  const props: SyntaxHighlighterProps = {
    language: normalizeLanguage(language),
    PreTag: 'span',
    style: codeBlockStyle,
    lineNumberStyle,
    showLineNumbers,
    codeTagProps: {
      style: codeContainerStyle(showLineNumbers),
    } as HTMLProps<HTMLElement>,
    // Wrap lines is needed to set styles on the line when highlighting.
    wrapLines: highlight.length > 0 || testId,
    lineProps: getLineProps,
  };

  return (
    <div
      data-testid={testId}
      data-code-block=""
      css={
        codeLayoutContainer(
          highlightedStartText,
          highlightedEndText,
          showLineNumbers,
        ) as InterpolationWithTheme<any>
      }
    >
      <SyntaxHighlighter data-code-lang={language} {...props}>
        {text}
      </SyntaxHighlighter>
    </div>
  );
};

export default memo(CodeBlock);
