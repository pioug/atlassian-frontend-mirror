/** @jsx jsx */
import React, { PureComponent } from 'react';

import { InterpolationWithTheme, jsx } from '@emotion/core';
import { PrismAsync as SyntaxHighlighter } from 'react-syntax-highlighter';

import type { ThemeProps } from '@atlaskit/theme/types';

import { normalizeLanguage } from '../supportedLanguages';
import { applyTheme } from '../themes/themeBuilder';
import type { CodeBlockTheme } from '../themes/types';

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

const LANGUAGE_FALLBACK = 'text';
const DEFAULT_LINE_EL_ATTR_OBJ = { 'data-ds--code--row': '' };

const getLineStyleObject = (lineNumber: number, testId?: string) => {
  return testId
    ? {
        'data-testid': `${testId}-line-${lineNumber}`,
        ...DEFAULT_LINE_EL_ATTR_OBJ,
      }
    : DEFAULT_LINE_EL_ATTR_OBJ;
};

export default class CodeBlock extends PureComponent<CodeBlockProps, {}> {
  static displayName = 'CodeBlock';

  static defaultProps = {
    showLineNumbers: true,
    language: LANGUAGE_FALLBACK,
    theme: {},
    themeOverride: {},
    highlight: '',
    highlightedStartText: 'Highlight start',
    highlightedEndText: 'Highlight end',
  };

  getHighlightStyles = (
    lineNumber: number,
    highlightedLines: number[],
  ): React.HTMLProps<HTMLElement> => {
    if (!this.props.highlight || highlightedLines.length === 0) {
      return getLineStyleObject(
        lineNumber,
        this.props.testId,
      ) as React.HTMLProps<HTMLElement>;
    }

    if (highlightedLines.includes(lineNumber)) {
      const highlightedDataAttrObj = {
        'data-ds--code--row--highlight': '',
      } as React.HTMLProps<HTMLElement>;
      return {
        ...highlightedDataAttrObj,
        ...getLineStyleObject(lineNumber, this.props.testId),
      } as React.HTMLProps<HTMLElement>;
    }

    return getLineStyleObject(lineNumber, this.props.testId) as React.HTMLProps<
      HTMLElement
    >;
  };

  // TODO unclear if this is even used, investiagte removal?
  handleCopy = (event: any) => {
    /**
     * We don't want to copy the markup after highlighting, but rather the preformatted text in the selection
     */
    const data = event.nativeEvent.clipboardData;
    if (data) {
      event.preventDefault();
      const selection = window.getSelection();
      if (selection === null) {
        return;
      }
      const selectedText = selection.toString();
      const document = `<!doctype html><html><head></head><body><pre>${selectedText}</pre></body></html>`;
      data.clearData();
      data.setData('text/html', document);
      data.setData('text/plain', selectedText);
    }
  };

  render() {
    // TODO look at memoising this
    const numLines = (this.props.text || '').split('\n').length;

    const {
      lineNumberStyle,
      codeBlockStyle,
      codeContainerStyle,
      codeLayoutContainer,
    } = applyTheme(
      { ...this.props.theme, ...this.props.themeOverride },
      numLines,
    );

    const props: SyntaxHighlighterProps = {
      language: normalizeLanguage(this.props.language || LANGUAGE_FALLBACK),
      PreTag: 'span',
      style: codeBlockStyle,
      lineNumberStyle,
      showLineNumbers: this.props.showLineNumbers,
      codeTagProps: {
        style: codeContainerStyle(this.props.showLineNumbers),
      } as React.HTMLProps<HTMLElement>,
    };

    const { highlightedStartText = '', highlightedEndText = '' } = this.props;

    const highlightedLines =
      this.props
        .highlight!.split(',')
        .map(num => {
          if (num.indexOf('-') > 0) {
            // We found a line group, e.g. 1-3
            const [from, to] = num
              .split('-')
              .map(Number)
              // Sort by lowest value first, highest value last.
              .sort((a, b) => a - b);
            return Array(to + 1)
              .fill(undefined)
              .map((_, index) => index)
              .slice(from, to + 1);
          }

          return Number(num);
        })
        .reduce<number[]>((acc, val) => acc.concat(val), []) || [];

    return (
      <div
        data-testid={this.props.testId}
        data-code-block=""
        css={
          codeLayoutContainer(
            highlightedStartText,
            highlightedEndText,
            this.props.showLineNumbers,
          ) as InterpolationWithTheme<any>
        }
      >
        <SyntaxHighlighter
          data-code-lang={this.props.language}
          // Wrap lines is needed to set styles on the line.
          // We use this to set opacity if highlight specific lines.
          wrapLines={this.props.highlight!.length > 0 || this.props.testId}
          lineProps={(line: number) =>
            this.getHighlightStyles(line, highlightedLines)
          }
          {...props}
        >
          {this.props.text}
        </SyntaxHighlighter>
      </div>
    );
  }
}
