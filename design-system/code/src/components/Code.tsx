import React, { PureComponent, ReactNode } from 'react';

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

export default class Code extends PureComponent<CodeProps, {}> {
  static defaultProps = {
    theme: {},
    codeTagProps: {},
    preTag: 'span',
  };

  render() {
    const { inlineCodeStyle } = applyTheme(this.props.theme);
    const language = normalizeLanguage(this.props.language);

    const props = {
      language,
      PreTag: this.props.preTag,
      style: this.props.codeStyle || inlineCodeStyle,
      codeTagProps: this.props.codeTagProps,
    };

    return (
      <SyntaxHighlighter
        data-code-lang={this.props.language}
        data-testid={this.props.testId}
        {...props}
      >
        {this.props.text}
      </SyntaxHighlighter>
    );
  }
}
