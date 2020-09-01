import React, { PureComponent } from 'react';

import { PrismAsync as SyntaxHighlighter } from 'react-syntax-highlighter';

import { ThemeProps } from '@atlaskit/theme/types';

import { normalizeLanguage, SupportedLanguages } from '../supportedLanguages';
import { applyTheme } from '../themes/themeBuilder';
import { CodeBlockTheme } from '../themes/types';

export interface CodeBlockProps {
  /** The code to be formatted */
  text: string;
  /** The language in which the code is written */
  language?: SupportedLanguages | string;
  /** Indicates whether or not to show line numbers */
  showLineNumbers?: boolean;
  /** A custom theme to be applied, implements the CodeBlockTheme interface */
  theme?: CodeBlockTheme | ThemeProps;

  /**
   * Lines to highlight comma delimited.
   * Example uses:

   * - To highlight one line `highlight="3"`
   * - To highlight a group of lines `highlight="1-5"`
   * - To highlight multiple groups `highlight="1-5,7,10,15-20"`
   */
  highlight?: string;
}

const LANGUAGE_FALLBACK = 'text';

export default class CodeBlock extends PureComponent<CodeBlockProps, {}> {
  static displayName = 'CodeBlock';

  static defaultProps = {
    showLineNumbers: true,
    language: LANGUAGE_FALLBACK,
    theme: {},
    highlight: '',
  };

  getLineOpacity(lineNumber: number) {
    if (!this.props.highlight) {
      return 1;
    }

    const highlight = this.props.highlight
      .split(',')
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
      .reduce<number[]>((acc, val) => acc.concat(val), []);

    if (highlight.length === 0) {
      return 1;
    }

    if (highlight.includes(lineNumber)) {
      return 1;
    }

    return 0.3;
  }

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
    const {
      lineNumberContainerStyle,
      codeBlockStyle,
      codeContainerStyle,
    } = applyTheme(this.props.theme);

    const props = {
      language: normalizeLanguage(this.props.language || LANGUAGE_FALLBACK),
      PreTag: 'span',
      style: codeBlockStyle,
      showLineNumbers: this.props.showLineNumbers,
      codeTagProps: { style: codeContainerStyle },
      lineNumberContainerStyle,
    };

    return (
      <SyntaxHighlighter
        {...props}
        // Wrap lines is needed to set styles on the line.
        // We use this to set opacity if highlight specific lines.
        wrapLines={this.props.highlight!.length > 0}
        lineNumberStyle={(lineNumber: number) => ({
          opacity: this.getLineOpacity(lineNumber),
        })}
        // Types are incorrect.
        // @ts-ignore
        lineProps={lineNumber => ({
          style: {
            opacity: this.getLineOpacity(lineNumber),
          },
        })}
      >
        {this.props.text}
      </SyntaxHighlighter>
    );
  }
}
